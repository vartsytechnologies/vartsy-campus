# users/views.py
import logging
from tokenize import TokenError
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken 
from django.contrib.auth import get_user_model, authenticate
from .utils import (
    EmailVerificationTokenGenerator, IsVerified, set_jwt_cookies, clear_jwt_cookies,build_frontend_url, send_verification_email)
from .serializers import (
    RegisterSerializer,MeSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    EmailVerificationSendSerializer, EmailVerificationSerializer,
    LoginRequestSerializer, GoogleOneTapSerializer
)
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from django.db import IntegrityError
from drf_spectacular.utils import extend_schema, OpenApiExample,OpenApiResponse
   
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_str
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.db import transaction
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests

logger = logging.getLogger(__name__)
    
CustomUser = get_user_model()

# #---------- CSRF VIEW ----------
class CsrfBootstrapView(APIView):
    permission_classes = [AllowAny]
    
    @method_decorator(ensure_csrf_cookie)
    @extend_schema(
        responses={200: dict},
               tags=["Authentication"],
               description="Get CSRF token to be used in subsequent write requests."
    )
    def get(self, request):
        # sets CSRF cookie; Next.js will include it as 'X-CSRFToken' on writes
        # This sets 'csrftoken' cookie; body is irrelevant
        return Response({"detail": "csrf set"})


#---------- REGISTER SCHOOL ADMIN VIEW ----------
class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    @extend_schema(
    auth=[],  # open endpoint in docs
    request=RegisterSerializer,
    responses={201: MeSerializer,400: dict},
    description="Register an account (email verification required before login).",
    examples=[OpenApiExample(name="Kwame Registration", value={
        "first_name": "Kwame",
        "last_name": "Agyei",
        "email": "kwame_agyei@example.com",
        "auth_provider": "local",
        "password": "StrongPass!23",
    })],
    tags=["Authentication"],
    )
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response({"detail": serializer.errors}, status=400)

        try:
            user = serializer.save()  # creates CustomUser
        except IntegrityError as e:
            logger.exception("Integrity error on registration")
            return Response({"detail": str(e)}, status=400)
        except Exception as e:
            logger.exception("Serializer save failed on registration")
            return Response({"detail": str(e)}, status=400)
        # Send verification email (do NOT call the API view directly)
        try:
            email_details = send_verification_email(user)
        except Exception as e:
            logger.exception("Failed to send verification email")
            email_details = {"ok": False, "error": str(e)}

        # Return created user representation
        return Response(
            {
                "message": "User registered successfully. Please verify your email.",
                "user data": MeSerializer(user).data,
                "email_details": email_details,
            }, status=status.HTTP_201_CREATED)

# ---------- EMAIL VERIFICATION VIEW ----------
class EmailVerificationView(APIView):
    permission_classes = [AllowAny]
    serializer_class = EmailVerificationSerializer
    @extend_schema(
    auth=[],  # public
    request=EmailVerificationSerializer,
    responses={200: {"type":"object","properties":{"ok":{"type":"boolean"},"message":{"type":"string"}}},
               400: {"type":"object","properties":{"detail":{"type":"string"}}}},
    description="Confirm email verification with uid and token.",
    examples=[OpenApiExample("Verify", value={"uid":"<uidb64>","token":"<token>"})],
    tags=["Authentication"],
    )
    def post(self, request):
        ser = self.serializer_class(data=request.data)
        ser.is_valid(raise_exception=True)
        uidb64 = ser.validated_data["uid"]
        token = ser.validated_data["token"]
        
        # 1) Decode UID safely
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
        except Exception:
            logger.exception("UID decode failed")
            return Response({"message": "Invalid link"}, status=status.HTTP_400_BAD_REQUEST)

        # 2) Load user or 400
        try:
            user = CustomUser.objects.get(pk=uid, is_active=True)
        except CustomUser.DoesNotExist:
            return Response({"detail": "Invalid or inactive user"}, status=status.HTTP_400_BAD_REQUEST)

        # 3) Validate token or 400
        try:
            is_valid = EmailVerificationTokenGenerator().check_token(user, token)
        except Exception as e:
            logger.exception("Token check raised")
            return Response({"detail": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        if not is_valid:
            return Response({"detail": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        # 4) Mark verified (idempotent)
        if not user.is_email_verified:
            user.is_email_verified = True
            user.save(update_fields=["is_email_verified"])

        return Response({
            "message": "Email has been verified successfully.",
            "ok": True})


# ---------- EMAIL VERIFICATION RESEND ----------
class ResendEmailVerificationView(APIView):
    permission_classes = [AllowAny]
    serializer_class = EmailVerificationSendSerializer
    @extend_schema(
    auth=[],  # public
    request=EmailVerificationSendSerializer,
    responses={200: {"type":"object","properties":{"message":{"type":"string"},"details":{"type":"object"}}}},
    description="Resend email verification link to the given email or the authenticated user's email.",
    tags=["Authentication"],
    )
    def post(self, request):
        ser = self.serializer_class(data=request.data)
        ser.is_valid(raise_exception=True)
        email = ser.validated_data["email"]
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"detail": "if the email exists, a verification was sent"}, status=status.HTTP_200_OK)

        if user.is_email_verified:
            return Response({"detail": "email already verified"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            email_details = send_verification_email(user)
        except Exception as e:
            logger.exception("Failed to send verification email")
            return Response({"detail": "failed to send verification"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
        "message": "Verification email sent successfully.",
        **email_details})

#---------- LOGIN VIEW ----------
class LoginView(APIView):
    serializer_class = LoginRequestSerializer
    permission_classes = [AllowAny]
    @extend_schema(
        auth=[],  # open endpoint in docs
    description="Login with email and password. On success, JWT cookies (access_token, refresh_token) are set.",
    request=LoginRequestSerializer,  # updated to concrete serializer
    responses={
        200: OpenApiResponse(
            response={"type": "object", "properties": {"message": {"type": "string"}, "user data": {"type": "object"}}},
            description="Login successful response",),
        401: {"type": "object", "properties": {"detail": {"type": "string"}}},
        403: {
            "type": "object",
            "properties": {
                "detail": {"type": "string"},
                "requires_email_verification": {"type": "boolean"}
            }
        },
    },
    tags=["Authentication"],
    )
    def post(self, request, *args, **kwargs):
        ser = self.serializer_class(data=request.data)
        ser.is_valid(raise_exception=True)
        email = ser.validated_data["email"]
        password = ser.validated_data["password"]
        try:
            user = authenticate(request, email=email, password=password)
        except Exception:
            return Response({"detail": "Invalid credentials"}, status=401)

        if not user.is_email_verified:
            # Do NOT set cookies; tell the client to verify
            return Response({
                "detail": "Email not verified. Please verify your email.",
                "requires_email_verification": True
            }, status=403)
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        # Prepare response payload
        response = Response({
            "message": "Login successful.",
            "user data": MeSerializer(user).data})

        # Set HttpOnly cookies using your utils
        set_jwt_cookies(response, str(access), str(refresh))

        return response
    

#----------- LOGOUT VIEW ----------
class LogoutView(APIView):
    permission_classes = [IsAuthenticated,IsVerified]
    @extend_schema(
    request=None,  #no request body
    responses={
        200: OpenApiResponse(
            response={"type": "object", "properties": {"message": {"type": "string"}}},
            description="Logout successful response",),
        401: {"type": "object", "properties": {"detail": {"type": "string"}}},
    },
    description="Logout the current user by clearing JWT cookies.",
    tags=["Authentication"],
    )
    def post(self, request):
        # optional: blacklist refresh
        refresh = request.COOKIES.get(settings.REFRESH_TOKEN_COOKIE_NAME)
        if refresh:
            try:
                RefreshToken(refresh).blacklist()
            except Exception:
                pass
            
        response = Response({
        "message": "Logout successful."}, status=status.HTTP_200_OK)
        clear_jwt_cookies(response)
        return response
    

#---------- ME VIEW ----------
class MeView(APIView):
    permission_classes = [IsAuthenticated,IsVerified]
    serializer_class = MeSerializer
    @extend_schema(responses={200: MeSerializer,401: dict},
               description="Get details of the currently authenticated user.",
               tags=["Authentication"])
    def get(self, request):
        data = self.serializer_class(request.user).data
        # mark accounts created via social/google where no usable password was set
        data["is_social"] = not request.user.has_usable_password()
        return Response(
            {
            "message": "User data retrieved successfully.",
            "user data": data
            },
            status=status.HTTP_200_OK)
    
#----------- TOKEN REFRESH VIEW ----------
class CookieTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]
    serializer_class = TokenRefreshSerializer
    @extend_schema(
    auth=[],  # public
    request=None,
    responses={
        200: {"type": "object", "properties": {"message": {"type": "string"}, "ok": {"type": "boolean"}}},
        401: {"type": "object", "properties": {"detail": {"type": "string"}}},
    },
    description="Refresh access token using refresh token from HttpOnly cookie.",
    tags=["Authentication"],
    )
    def post(self, request, *args, **kwargs):
        # read refresh from cookie if not provided
        if "refresh" not in request.data:
            refresh = request.COOKIES.get(settings.REFRESH_TOKEN_COOKIE_NAME)
            if not refresh:
                return Response({"detail": "no refresh"}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            refresh = RefreshToken(refresh)
            access = refresh.access_token
            # If ROTATE_REFRESH_TOKENS=True, refresh will be rotated on use:
            new_refresh = str(refresh)  # after rotation, this is the new value
        except TokenError:
            resp = Response({"detail": "Invalid refresh"}, status=401)
            clear_jwt_cookies(resp)
            return resp

        resp = Response(
            {
                "message": "Token refreshed successfully.",
                "ok": True
            }, status=status.HTTP_200_OK)
        set_jwt_cookies(resp, str(access), new_refresh)
        return resp
    
    
# ---------- PASSWORD RESET REQUEST ----------
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetRequestSerializer
    @extend_schema(
    request=PasswordResetRequestSerializer,
    responses={200: {"type": "object", "properties": {"ok": {"type":"boolean"}}}},
    description="Request a password reset link. Always returns 200 for privacy.",
    tags=["Authentication"],
    examples=[OpenApiExample("Request", value={"email": "user@example.com"})],
    )
    def post(self, request):
        ser = self.serializer_class(data=request.data)
        ser.is_valid(raise_exception=True)
        email = ser.validated_data["email"]
        try:
            user = CustomUser.objects.get(email__iexact=email, is_active=True)
        except CustomUser.DoesNotExist:
            # Don't reveal whether email exists
            return Response({
            "message": "If an account with that email exists, a password reset link has been sent." ,
            "ok": True})

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = PasswordResetTokenGenerator().make_token(user)

        # e.g. your Next.js page /auth/password-reset
        link = build_frontend_url(f"/auth/password-reset?uid={uid}&token={token}")
        
        try:
            send_mail(
                subject="V-Campus password reset",
                message=f"Hi,\n\nClick the link to reset your password:\n{link}\n\nIf you didn't request this, ignore this email.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
            logger.info("Password reset email sent to %s", user.email)
        except Exception:
            logger.exception("Failed to send password reset email to %s", user.email)
        
        # Do not raise — still return success to avoid enumeration or 500
        # Ensure we return a response
        return Response({"message": "If an account with that email exists, a password reset link has been sent.", "ok": True})


# ---------- PASSWORD RESET CONFIRM ----------
class ChangePasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetConfirmSerializer
    @extend_schema(
    request=PasswordResetConfirmSerializer,
    responses={200: {"type":"object","properties":{"ok":{"type":"boolean"}}}, 400: dict},
    description="Confirm password reset using uid and token, then set a new password.",
    tags=["Authentication"],
    examples=[OpenApiExample("Confirm", value={"uid":"<uidb64>","token":"<token>","new_password":"NewStrong!23"})],
    )
    def post(self, request):
        ser = self.serializer_class(data=request.data)
        ser.is_valid(raise_exception=True)
        uidb64 = ser.validated_data["uid"]
        token = ser.validated_data["token"]
        new_password = ser.validated_data["new_password"]
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid, is_active=True)
        except Exception:
            return Response({"message": "Invalid link"}, status=status.HTTP_400_BAD_REQUEST)

        if not PasswordResetTokenGenerator().check_token(user, token):
            return Response({"message": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save(update_fields=["password"])
        return Response({
            "message": "Password has been reset successfully.",
            "ok": True})


class GoogleOneTapView(APIView):
    serializer_class = GoogleOneTapSerializer
    permission_classes = [AllowAny]
    @extend_schema(
    auth=[],  # public
    request=GoogleOneTapSerializer,
    responses={200: {"type":"object","properties":{"detail":{"type":"string"}}}, 400: dict},
    description="Sign in or sign up using Google One Tap with the provided ID token.",
    tags=["Authentication"],
    )
    @transaction.atomic
    def post(self, request):
        """
        Body: { "credential": "<google id_token>" }
        """
        ser = self.serializer_class(data=request.data)
        ser.is_valid(raise_exception=True)
        cred = ser.validated_data["credential"]

        try:
            # Verify signature, expiry, audience
            idinfo = google_id_token.verify_oauth2_token(
                cred,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )
        except Exception:
            return Response({"detail": "invalid google token"}, status=400)

        # Basic checks
        if idinfo.get("aud") != settings.GOOGLE_CLIENT_ID:
            return Response({"detail": "audience mismatch"}, status=400)
        if not idinfo.get("email"):
            return Response({"detail": "email required"}, status=400)
        if not idinfo.get("email_verified", False):
            return Response({"detail": "unverified email"}, status=400)

        email = idinfo["email"].lower()

        user = CustomUser.objects.filter(email=email).first()

        if user:
            # Only allow admins to sign in at this stage
            if user.role != CustomUser.Roles.SCHOOL_ADMIN:
                return Response({"detail": "role not allowed for One Tap"}, status=403)
        else:
            # Controlled auto-signup
            if not settings.GOOGLE_ALLOW_AUTO_SIGNUP:
                return Response({"detail": "signup disabled"}, status=403)

            # Create SCHOOL_ADMIN only
            user = CustomUser(
                email=email,
                avatar_url=idinfo.get("picture"),
                first_name=idinfo.get("given_name", ""),
                last_name=idinfo.get("family_name", ""),
                auth_provider=CustomUser.AuthProvider.GOOGLE,
                provider_account_id=idinfo.get("sub"),
                role=getattr(CustomUser.Roles, settings.GOOGLE_ALLOWED_SIGNUP_ROLE, CustomUser.Roles.SCHOOL_ADMIN),
                is_email_verified=True,
            )
            user.set_unusable_password()
            user.save()

        # Issue JWT cookies (reuse your helpers)
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        resp = Response({
            "message": "google sign-in successful.",
            "user data": MeSerializer(user).data,})
        set_jwt_cookies(resp, str(access), str(refresh))
        return resp
