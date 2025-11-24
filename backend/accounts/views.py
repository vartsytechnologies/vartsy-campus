# users/views.py
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken 
from django.http import JsonResponse
from django.contrib.auth import get_user_model

from .utils import _set_jwt_cookies, _clear_jwt_cookies
from .serializers import (
    UserRegistrationSerializer,UserSerializer,OnboardSerializer,
    ChangePasswordSerializer,ForgotPasswordSerializer,ResetPasswordSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer,TokenRefreshSerializer
    
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

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
        result = super().post(request, *args, **kwargs)
        access = result.data.get("access")
        refresh = result.data.get("refresh")
        resp = Response({"detail": "login successful"}, status=status.HTTP_200_OK)
        _set_jwt_cookies(resp, access, refresh)
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
        _set_jwt_cookies(resp, access, None)
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
        _clear_jwt_cookies(resp)
        return resp

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ForgotPasswordSerializer
    def post(self, request):
        ser = ForgotPasswordSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        User = get_user_model()
        email = ser.validated_data["email"]
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
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
        return Response(UserSerializer(request.user).data)


class LogoutView(APIView):
    def post(self, request):
        # optional: blacklist refresh
        refresh = request.COOKIES.get(settings.REFRESH_TOKEN_COOKIE_NAME)
        if refresh:
            try:
                RefreshToken(refresh).blacklist()
            except Exception:
                pass
        resp = Response({"detail": "logout ok"})
        _clear_jwt_cookies(resp)
        return resp
    
    
class OnboardAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = OnboardSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "School onboarded successfully"
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
