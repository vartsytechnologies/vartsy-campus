from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

app_name = 'onboarding'

router = DefaultRouter()
router.register('progress', views.OnboardingProgressViewSet, basename='progress')
router.register('steps', views.OnboardingStepViewSet, basename='step')
router.register('checklist', views.OnboardingChecklistViewSet, basename='checklist')
router.register('notes', views.OnboardingNoteViewSet, basename='note')

urlpatterns = [
    path('', include(router.urls)),
]