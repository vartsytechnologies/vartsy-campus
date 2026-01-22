from django.utils import timezone
from datetime import timedelta
import logging
from rest_framework.permissions import BasePermission
from django.conf import settings
from django.core.mail import send_mail
from rest_framework.response import Response
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator

logger = logging.getLogger(__name__)

def _seconds(td: timedelta) -> int:
    return int(td.total_seconds())

def set_jwt_cookies(response: Response, access_token: str, refresh_token: str):
    cookie_params = dict(
        secure=getattr(settings, "SESSION_COOKIE_SECURE"),
        httponly=True,
        samesite=getattr(settings, "SAMESITE"),
        path=getattr(settings, "JWT_COOKIE_PATH"),
    )
    # access
    response.set_cookie(
    settings.ACCESS_TOKEN_COOKIE_NAME, access_token, **cookie_params, max_age=_seconds(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"])
    )
    # refresh
    response.set_cookie(
    settings.REFRESH_TOKEN_COOKIE_NAME, refresh_token, **cookie_params, max_age=_seconds(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"])
    )


def clear_jwt_cookies(resp: Response):
    resp.delete_cookie(settings.ACCESS_TOKEN_COOKIE_NAME, samesite=getattr(settings, "SAMESITE"), secure=getattr(settings, "SESSION_COOKIE_SECURE"))
    resp.delete_cookie(settings.REFRESH_TOKEN_COOKIE_NAME, samesite=getattr(settings, "SAMESITE"), secure=getattr(settings, "SESSION_COOKIE_SECURE"))


class EmailVerificationTokenGenerator(PasswordResetTokenGenerator):
    # token invalidates once the user is verified
    def _make_hash_value(self, user, timestamp):
        return f"{user.pk}{timestamp}{user.is_email_verified}"
    

def build_frontend_url(path: str) -> str:
    """
    Compose a link your Next.js app will handle, e.g.
    https://app.example.com/auth/reset-password?uid=...&token=...
    During local dev, use http://localhost:3000/api
    """
    base = getattr(settings, "FRONTEND_BASE_URL")
    if path.startswith("/"):
        return f"{base}{path}"
    return f"{base}/{path}"
class IsVerified(BasePermission):
    message = "Email not verified."

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and getattr(user, "is_email_verified", False))


def send_verification_email(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = EmailVerificationTokenGenerator().make_token(user)
    link = build_frontend_url(f"/auth/verify-email?uid={uid}&token={token}")
    send_mail(
        subject="Verify your email",
        message=f"Hi,\n\nConfirm your email by clicking:\n{link}\n\nThanks!",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )
    return {"ok": True}
