from __future__ import annotations

from rest_framework import serializers

from .models import (
    AcademicYear,
    Term,
    ClassLevel,
    ClassGroup,
    Subject,
)


# Optional: field sets for future reference / maintenance
ACADEMIC_YEAR_FIELDS = {f.name for f in AcademicYear._meta.get_fields()} - {"school"}
TERM_FIELDS = {f.name for f in Term._meta.get_fields()}
CLASS_LEVEL_FIELDS = {f.name for f in ClassLevel._meta.get_fields()}
CLASS_GROUP_FIELDS = {f.name for f in ClassGroup._meta.get_fields()}
SUBJECT_FIELDS = {f.name for f in Subject._meta.get_fields()}


# ──────────────────────────────────────────────────────────────
# AcademicYear Serializers
# ──────────────────────────────────────────────────────────────

class AcademicYearListSerializer(serializers.ModelSerializer):
    """Minimal representation for list views"""
    class Meta:
        model = AcademicYear
        fields = ("id", "name", "start_date", "end_date", "is_current")
        read_only_fields = fields


class AcademicYearDetailSerializer(serializers.ModelSerializer):
    """Detailed representation including terms count"""
    terms_count = serializers.IntegerField(read_only=True, source="terms.count")

    class Meta:
        model = AcademicYear
        fields = (
            "id",
            "name",
            "start_date",
            "end_date",
            "is_current",
            "terms_count",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at", "terms_count")


class AcademicYearCreateUpdateSerializer(serializers.ModelSerializer):
    """Used for create & update – school is set automatically by view"""
    class Meta:
        model = AcademicYear
        fields = (
            "name",
            "start_date",
            "end_date",
            "is_current",
        )
        extra_kwargs = {
            "is_current": {"required": False, "default": False},
        }

    def validate(self, attrs):
        start = attrs.get("start_date")
        end = attrs.get("end_date")
        if start and end and start >= end:
            raise serializers.ValidationError(
                {"start_date": "Start date must be before end date."}
            )
        return attrs


# ──────────────────────────────────────────────────────────────
# Term Serializer
# ──────────────────────────────────────────────────────────────

class TermSerializer(serializers.ModelSerializer):
    class Meta:
        model = Term
        fields = (
            "id",
            "academic_year",
            "term_number",
            "start_date",
            "end_date",
            "is_current",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")


# ──────────────────────────────────────────────────────────────
# ClassLevel Serializer
# ──────────────────────────────────────────────────────────────

class ClassLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassLevel
        fields = (
            "id",
            "name",
            "short_code",
            "level_order",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")


# ──────────────────────────────────────────────────────────────
# ClassGroup Serializers
# ──────────────────────────────────────────────────────────────

class ClassGroupListSerializer(serializers.ModelSerializer):
    class_level_name = serializers.CharField(source="class_level.name", read_only=True)
    academic_year_name = serializers.CharField(source="academic_year.name", read_only=True)

    class Meta:
        model = ClassGroup
        fields = (
            "id",
            "class_level",
            "class_level_name",
            "academic_year",
            "academic_year_name",
            "section",
            "capacity",
            "room_number",
        )


class ClassGroupDetailSerializer(serializers.ModelSerializer):
    class_level = ClassLevelSerializer(read_only=True)
    academic_year = AcademicYearListSerializer(read_only=True)

    class Meta:
        model = ClassGroup
        fields = (
            "id",
            "class_level",
            "academic_year",
            "section",
            "capacity",
            "room_number",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")


class ClassGroupCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassGroup
        fields = (
            "class_level",
            "academic_year",
            "section",
            "capacity",
            "room_number",
        )


# ──────────────────────────────────────────────────────────────
# Subject Serializers
# ──────────────────────────────────────────────────────────────

class SubjectListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = (
            "id",
            "name",
            "short_code",
            "is_elective",
            "is_examinable",
            "credit_hours",
        )


class SubjectDetailSerializer(serializers.ModelSerializer):
    class_levels = ClassLevelSerializer(many=True, read_only=True)

    class Meta:
        model = Subject
        fields = (
            "id",
            "name",
            "short_code",
            "is_elective",
            "is_examinable",
            "credit_hours",
            "class_levels",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")


class SubjectCreateUpdateSerializer(serializers.ModelSerializer):
    class_levels = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ClassLevel.objects.all(),
        required=False,
    )

    class Meta:
        model = Subject
        fields = (
            "name",
            "short_code",
            "is_elective",
            "is_examinable",
            "credit_hours",
            "class_levels",
        )