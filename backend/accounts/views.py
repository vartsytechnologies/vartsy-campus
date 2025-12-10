# users/views.py
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken 
from django.http import JsonResponse
from django.contrib.auth import get_user_model

from .utils import set_jwt_cookies, clear_jwt_cookies
from .serializers import (
    UserRegistrationSerializer,UserSerializer,ChangePasswordSerializer,
    ForgotPasswordSerializer,ResetPasswordSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer,TokenRefreshSerializer
    
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.db import transaction
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests


def health(_):
    return JsonResponse({"status": "ok"})

CustomUser = get_user_model()


class CsrfBootstrapView(APIView):
    permission_classes = [AllowAny]
    
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        # This sets 'csrftoken' cookie; body is irrelevant
        return Response({"detail": "csrf set"})

    
class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            result = super().post(request, *args, **kwargs)
        except Exception:
            return Response({"detail": "Invalid credentials"}, status=401)

        access = result.data.get("access")
        refresh = result.data.get("refresh")

        # Return user info instead of "login successful"
        user = self.user  # TokenObtainPairSerializer sets `self.user`

        resp = Response({
            "message": "login successful",
            "user": UserSerializer(user).data,
        })

        set_jwt_cookies(resp, access, refresh)
        return resp


class CookieTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]
    serializer_class = TokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        # read refresh from cookie if not provided
        if "refresh" not in request.data:
            refresh = request.COOKIES.get(settings.REFRESH_TOKEN_COOKIE_NAME)
            if not refresh:
                return Response({"detail": "no refresh"}, status=400)
            request.data["refresh"] = refresh
        result = super().post(request, *args, **kwargs)
        access = result.data.get("access")
        resp = Response({"detail": "refresh ok"}, status=status.HTTP_200_OK)
        set_jwt_cookies(resp, access, None)
        return resp
    
class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User registered successfully",
                "user": {"email": user.email,
                         "role": user.role,
                         "is_email_verified": user.is_email_verified},
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer
    def post(self, request):
        ser = ChangePasswordSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = request.user
        if not user.check_password(ser.validated_data["old_password"]):
            return Response({"detail": "old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(ser.validated_data["new_password"])
        user.save()
        resp = Response({"detail": "password changed"})
        clear_jwt_cookies(resp)
        return resp

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ForgotPasswordSerializer
    def post(self, request):
        ser = ForgotPasswordSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        email = ser.validated_data["email"]
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            # Don't reveal whether email exists
            return Response({"detail": "ok"})

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = PasswordResetTokenGenerator().make_token(user)

        # In dev we just print to console email backend
        reset_link = f"{request.build_absolute_uri('/')}reset-password?uid={uid}&token={token}"
        send_mail(
            subject="V-Campus password reset",
            message=f"Use the link to reset your password:\n{reset_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=True,
        )
        return Response({"detail": "ok"})

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ResetPasswordSerializer
    def post(self, request):
        ser = ResetPasswordSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.validated_data["user"]
        user.set_password(ser.validated_data["new_password"])
        user.save()
        return Response({"detail": "password reset ok"})

class MeView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get(self, request):
        data = UserSerializer(request.user).data
        # mark accounts created via social/google where no usable password was set
        data["is_social"] = not request.user.has_usable_password()
        return Response(data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        # optional: blacklist refresh
        refresh = request.COOKIES.get(settings.REFRESH_TOKEN_COOKIE_NAME)
        if refresh:
            try:
                RefreshToken(refresh).blacklist()
            except Exception:
                pass
        resp = Response({"detail": "logout ok"})
        clear_jwt_cookies(resp)
        return resp


class GoogleOneTapView(APIView):
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request):
        """
        Body: { "credential": "<google id_token>" }
        """
        cred = (request.data or {}).get("credential")
        if not cred:
            return Response({"detail": "missing credential"}, status=400)

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
        first_name = idinfo.get("given_name") or ""
        last_name  = idinfo.get("family_name") or ""
        picture    = idinfo.get("picture")  # (optional, ignore for now)

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
                role=getattr(CustomUser.Roles, settings.GOOGLE_ALLOWED_SIGNUP_ROLE, CustomUser.Roles.SCHOOL_ADMIN),
                is_email_verified=True,
            )
            user.set_unusable_password()
            user.save()

        # Issue JWT cookies (reuse your helpers)
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        resp = Response({"detail": "google sign-in ok"})
        set_jwt_cookies(resp, str(access), str(refresh))
        return resp
