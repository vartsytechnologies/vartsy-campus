from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views
from drf_spectacular.utils import extend_schema

app_name = 'onboarding'

router = DefaultRouter()
router.register('progress', views.OnboardingProgressViewSet, basename='progress')
router.register('steps', views.OnboardingStepViewSet, basename='step')
router.register('checklist', views.OnboardingChecklistViewSet, basename='checklist')
router.register('notes', views.OnboardingNoteViewSet, basename='note')

urlpatterns = [
    path('', include(router.urls)),
]

@extend_schema(exclude=True)
def update(self, request, *args, **kwargs):
    return super().update(request, *args, **kwargs)

@extend_schema(exclude=True)
def partial_update(self, request, *args, **kwargs):
    return super().partial_update(request, *args, **kwargs)

@extend_schema(exclude=True)
def destroy(self, request, *args, **kwargs):
    return super().destroy(request, *args, **kwargs)