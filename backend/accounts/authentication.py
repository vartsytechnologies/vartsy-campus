from drf_spectacular.extensions import OpenApiAuthenticationExtension
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # If Authorization header exists, default behavior still works
        header = self.get_header(request)
        if header is not None:
            return super().authenticate(request)

        access = request.COOKIES.get(getattr(settings, "ACCESS_TOKEN_COOKIE_NAME", "vc_access"))
        if not access:
            return None

        try:
            raw_token = access.encode("utf-8")
            validated_token = self.get_validated_token(raw_token)
        except AttributeError:
            return None
        return self.get_user(validated_token), validated_token


class CookieJWTAuthenticationScheme(OpenApiAuthenticationExtension):
    # fully qualified path to your auth class
    target_class = "CookieJWTAuthentication"
    match_subclasses = True

    def get_security_definition(self, auto_schema):
        # represent cookie-based JWT as an apiKey in cookies.
        return {
            "type": "apiKey",
            "in": "cookie",
            "name": getattr(settings, "ACCESS_TOKEN_COOKIE_NAME", "vc_access"),
        }