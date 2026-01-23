from django.urls import path
from .views import(
    ChangePasswordView,CsrfBootstrapView,MeView,LoginView,
    RegisterAPIView,CookieTokenRefreshView,
    LogoutView,MeView,ForgotPasswordView,
    GoogleOneTapView
)
from .views import CsrfBootstrapView

urlpatterns = [    
    path("csrf/", CsrfBootstrapView.as_view(), name="auth-csrf"),
    # Authentication
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),
    path("google/onetap/", GoogleOneTapView.as_view(), name="auth-google-onetap"),
    
    # # Password management
    path("password/change/", ChangePasswordView.as_view(), name="auth-password-change"),
    path("password/forgot/", ForgotPasswordView.as_view(), name="auth-password-forgot"),

]
