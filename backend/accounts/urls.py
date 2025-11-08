from django.urls import path
from .views import *

urlpatterns = [
    path('register/',UserRegistrationView, name='register'),
    path('onboard/',OnboardFormView, name='onboarding'),
    path('dashboard/',UserDashboardView, name='user_dashboard'),
]