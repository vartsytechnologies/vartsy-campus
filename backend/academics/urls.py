from __future__ import annotations

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    AcademicYearViewSet,
    TermViewSet,
    ClassLevelViewSet,
    ClassGroupViewSet,
    SubjectViewSet,
)

app_name = 'academics'

router = DefaultRouter()

router.register(r'academic-years', AcademicYearViewSet, basename='academic-year')
router.register(r'terms',TermViewSet,basename='term')
router.register(r'class-levels',ClassLevelViewSet,basename='class-level')
router.register(r'class-groups',ClassGroupViewSet,basename='class-group')
router.register(r'subjects',SubjectViewSet,basename='subject')

urlpatterns = [
    path('', include(router.urls)),
]