from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from .models import (
    AcademicYear,
    Term,
    ClassLevel,
    ClassGroup,
    Subject,
)


@admin.register(AcademicYear)
class AcademicYearAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "school",
        "start_date",
        "end_date",
        "is_current",
        "terms_count",
        "created_at",
    )
    list_filter = ("school", "is_current")
    search_fields = ("name", "school__name")
    date_hierarchy = "start_date"
    readonly_fields = ("created_at", "updated_at")
    list_per_page = 20

    def terms_count(self, obj):
        return obj.terms.count()
    terms_count.short_description = _("Number of Terms")


@admin.register(Term)
class TermAdmin(admin.ModelAdmin):
    list_display = (
        "__str__",
        "academic_year",
        "term_number",
        "start_date",
        "end_date",
        "is_current",
        "created_at",
    )
    list_filter = ("academic_year__school", "is_current", "academic_year")
    search_fields = ("academic_year__name", "term_number")
    date_hierarchy = "start_date"
    readonly_fields = ("created_at", "updated_at")
    list_per_page = 20


@admin.register(ClassLevel)
class ClassLevelAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "short_code",
        "level_order",
        "is_active",
        "school",
        "created_at",
    )
    list_filter = ("school", "is_active")
    search_fields = ("name", "short_code", "school__name")
    readonly_fields = ("created_at", "updated_at")
    list_per_page = 20


@admin.register(ClassGroup)
class ClassGroupAdmin(admin.ModelAdmin):
    list_display = (
        "__str__",
        "class_level",
        "section",
        "academic_year",
        "capacity",
        "room_number",
        "created_at",
    )
    list_filter = ("class_level__school", "academic_year", "class_level")
    search_fields = (
        "class_level__name",
        "section",
        "academic_year__name",
        "room_number",
    )
    readonly_fields = ("created_at", "updated_at")
    list_per_page = 20


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "short_code",
        "is_elective",
        "is_examinable",
        "credit_hours",
        "school",
        "created_at",
    )
    list_filter = ("school", "is_elective", "is_examinable")
    search_fields = ("name", "short_code", "school__name")
    filter_horizontal = ("class_levels",)  
    readonly_fields = ("created_at", "updated_at")
    list_per_page = 20