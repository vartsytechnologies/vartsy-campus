from django.urls import path
from .views import(
    ChangePasswordView,CsrfBootstrapView,MeView,
    RegisterAPIView,EmailTokenObtainPairView,
    CookieTokenRefreshView,LogoutView,MeView,
    health,ForgotPasswordView,ResetPasswordView,GoogleOneTapView
)

urlpatterns = [
    path("health/", health),
    
    path('auth/register/', RegisterAPIView.as_view(), name='register'),
    path('auth/login/', EmailTokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', MeView.as_view(), name='me'),
    path("auth/csrf/", CsrfBootstrapView.as_view(), name="auth-csrf"),

    path("auth/password/change/", ChangePasswordView.as_view(), name="auth-password-change"),
    path("auth/password/forgot/", ForgotPasswordView.as_view(), name="auth-password-forgot"),
    path("auth/password/reset/", ResetPasswordView.as_view(), name="auth-password-reset"),

    path("auth/google/onetap/", GoogleOneTapView.as_view(), name="auth-google-onetap"),

]
