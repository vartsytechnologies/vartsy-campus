from __future__ import annotations

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from rest_framework.exceptions import PermissionDenied

from .models import (
    AcademicYear,
    Term,
    ClassLevel,
    ClassGroup,
    Subject,
)

from .serializers import (
    AcademicYearListSerializer,
    AcademicYearDetailSerializer,
    AcademicYearCreateUpdateSerializer,

    TermSerializer,

    ClassLevelSerializer,

    ClassGroupListSerializer,
    ClassGroupDetailSerializer,
    ClassGroupCreateUpdateSerializer,

    SubjectListSerializer,
    SubjectDetailSerializer,
    SubjectCreateUpdateSerializer,
)


# ──────────────────────────────────────────────────────────────
# Permission class – only school admins can write
# ──────────────────────────────────────────────────────────────

class IsSchoolAdminOrReadOnly(IsAuthenticated):
    """
    Read access: any authenticated user in the tenant
    Write access: only SCHOOL_ADMIN in the current tenant
    """
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        if request.method in SAFE_METHODS:
            return True

        # Write operations → only school admin
        tenant = getattr(request, 'tenant', None)
        if not tenant:
            return False

        return request.user.memberships.filter(
            school=tenant,
            role='SCHOOL_ADMIN',
            is_active=True
        ).exists()


# ──────────────────────────────────────────────────────────────
# AcademicYear ViewSet
# ──────────────────────────────────────────────────────────────

class AcademicYearViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSchoolAdminOrReadOnly]
    lookup_field = 'pk'

    def get_queryset(self):
        tenant = getattr(self.request, 'tenant', None)
        if not tenant:
            return AcademicYear.objects.none()
        return AcademicYear.objects.filter(school=tenant)

    def get_serializer_class(self):
        if self.action == 'list':
            return AcademicYearListSerializer
        if self.action == 'retrieve':
            return AcademicYearDetailSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return AcademicYearCreateUpdateSerializer
        return AcademicYearDetailSerializer  # fallback

    def perform_create(self, serializer):
        tenant = getattr(self.request, 'tenant', None)
        if not tenant:
            raise PermissionDenied("No tenant context available.")
        serializer.save(school=tenant)

    @action(detail=True, methods=['post'], url_path='set-current')
    def set_current(self, request, pk=None):
        """Mark this academic year as the current one (unsets others)"""
        year = self.get_object()
        year.is_current = True
        year.save()  # model.save() should unset other current flags
        serializer = AcademicYearDetailSerializer(
            year,
            context=self.get_serializer_context()
        )
        return Response(
            {
                "message": f"Academic year '{year.name}' is now the current year.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )


# ──────────────────────────────────────────────────────────────
# Term ViewSet
# ──────────────────────────────────────────────────────────────

class TermViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        tenant = getattr(self.request, 'tenant', None)
        if not tenant:
            return Term.objects.none()
        return Term.objects.filter(academic_year__school=tenant)

    def get_serializer_class(self):
        return TermSerializer

    def perform_create(self, serializer):
        tenant = getattr(self.request, 'tenant', None)
        if not tenant:
            raise PermissionDenied("No tenant context available.")
        serializer.save()


# ──────────────────────────────────────────────────────────────
# ClassLevel ViewSet
# ──────────────────────────────────────────────────────────────

class ClassLevelViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        tenant = getattr(self.request, 'tenant', None)
        if not tenant:
            return ClassLevel.objects.none()
        return ClassLevel.objects.filter(school=tenant)

    def get_serializer_class(self):
        return ClassLevelSerializer

    def perform_create(self, serializer):
        tenant = getattr(self.request, 'tenant', None)
        if not tenant:
            raise PermissionDenied("No tenant context available.")
        serializer.save(school=tenant)


# ──────────────────────────────────────────────────────────────
# ClassGroup ViewSet
# ──────────────────────────────────────────────────────────────

class ClassGroupViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        tenant = getattr(self.request, 'tenant', None)
        if not tenant:
            return ClassGroup.objects.none()
        return ClassGroup.objects.filter(class_level__school=tenant)

    def get_serializer_class(self):
        if self.action == 'list':
            return ClassGroupListSerializer
        if self.action == 'retrieve':
            return ClassGroupDetailSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return ClassGroupCreateUpdateSerializer
        return ClassGroupDetailSerializer

    def perform_create(self, serializer):
        tenant = getattr(self.request, 'tenant', None)
        if not tenant:
            raise PermissionDenied("No tenant context available.")
        serializer.save()


# ──────────────────────────────────────────────────────────────
# Subject ViewSet
# ──────────────────────────────────────────────────────────────

class SubjectViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        tenant = getattr(self.request, 'tenant', None)
        if not tenant:
            return Subject.objects.none()
        return Subject.objects.filter(school=tenant)

    def get_serializer_class(self):
        if self.action == 'list':
            return SubjectListSerializer
        if self.action == 'retrieve':
            return SubjectDetailSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return SubjectCreateUpdateSerializer
        return SubjectDetailSerializer

    def perform_create(self, serializer):
        tenant = getattr(self.request, 'tenant', None)
        if not tenant:
            raise PermissionDenied("No tenant context available.")
        serializer.save(school=tenant)