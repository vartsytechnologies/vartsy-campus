from django.conf import settings
from drf_spectacular.extensions import OpenApiAuthenticationExtension

class CookieJWTAuthScheme(OpenApiAuthenticationExtension):
    # Must point to your authenticator’s import path
    target_class = 'accounts.authentication.CookieJWTAuthentication'
    name = 'CookieJWTAuth'          # name shown in the OpenAPI security schemes
    match_subclasses = True

    def get_security_definition(self, auto_schema):
        # Choose the exact cookie name your utils set
        cookie_name = settings.ACCESS_TOKEN_COOKIE_NAME
        # OpenAPI ‘cookie’ auth is an apiKey in cookie
        return {
            "type": "apiKey",
            "in": "cookie",
            "name": cookie_name,
            "description": "JWT access token stored in an HttpOnly cookie.",
        }
