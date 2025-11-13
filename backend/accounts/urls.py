from django.urls import path
from .views import RegisterAPIView, OnboardAPIView, DashboardAPIView

urlpatterns = [
    path('api/register/', RegisterAPIView.as_view(), name='api_register'),
    path('api/onboard/', OnboardAPIView.as_view(), name='api_onboard'),
    path('api/dashboard/', DashboardAPIView.as_view(), name='api_dashboard'),
]