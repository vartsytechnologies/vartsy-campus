from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from rest_framework.response import Response


def _set_jwt_cookies(response: Response, access_token: str, refresh_token: str):
    cookie_params = dict(
        secure=getattr(settings, "SESSION_COOKIE_SECURE", True),
        httponly=True,
        samesite=getattr(settings, "SAMESITE", "None"),
    )

    # access
    response.set_cookie(
    settings.ACCESS_TOKEN_COOKIE_NAME, access_token, httponly=True, **cookie_params, max_age=60*60
    )
    # refresh
    response.set_cookie(
    settings.REFRESH_TOKEN_COOKIE_NAME, refresh_token, httponly=True, **cookie_params, max_age=60*60*24*14
    )


def _clear_jwt_cookies(resp: Response):
    resp.delete_cookie(settings.ACCESS_TOKEN_COOKIE_NAME, samesite=getattr(settings, "SAMESITE", "None"), secure=getattr(settings, "SESSION_COOKIE_SECURE", True))
    resp.delete_cookie(settings.REFRESH_TOKEN_COOKIE_NAME, samesite=getattr(settings, "SAMESITE", "None"), secure=getattr(settings, "SESSION_COOKIE_SECURE", True))
