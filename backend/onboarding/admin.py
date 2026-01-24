from django.contrib import admin
from django.contrib import admin
from .models import (
    OnboardingProgress, 
    OnboardingStep, 
    OnboardingChecklist,
    OnboardingResource,
    OnboardingNote
)
# Register your models here.



class OnboardingStepInline(admin.TabularInline):
    model = OnboardingStep
    extra = 0
    fields = ('step_number', 'title', 'step_type', 'is_completed', 'is_required')
    readonly_fields = ('is_completed',)


class OnboardingNoteInline(admin.TabularInline):
    model = OnboardingNote
    extra = 0
    fields = ('created_by', 'note', 'is_issue', 'is_resolved', 'created_at')
    readonly_fields = ('created_at',)


@admin.register(OnboardingProgress)
class OnboardingProgressAdmin(admin.ModelAdmin):
    list_display = ('school', 'status', 'completion_percentage', 'current_step', 'started_at', 'completed_at')
    list_filter = ('status', 'started_at', 'completed_at')
    search_fields = ('school__name', 'school__schema_name')
    readonly_fields = ('completion_percentage', 'created_at', 'updated_at')
    inlines = [OnboardingStepInline, OnboardingNoteInline]
    
    fieldsets = (
        ('School Information', {
            'fields': ('school', 'onboarding_admin')
        }),
        ('Progress', {
            'fields': ('status', 'current_step', 'total_steps', 'completion_percentage')
        }),
        ('Timestamps', {
            'fields': ('started_at', 'completed_at', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class OnboardingChecklistInline(admin.TabularInline):
    model = OnboardingChecklist
    extra = 1
    fields = ('item_number', 'title', 'is_completed', 'is_optional')


class OnboardingResourceInline(admin.TabularInline):
    model = OnboardingResource
    extra = 1
    fields = ('title', 'resource_type', 'url', 'display_order')


@admin.register(OnboardingStep)
class OnboardingStepAdmin(admin.ModelAdmin):
    list_display = ('step_number', 'title', 'progress', 'step_type', 'is_completed', 'is_required')
    list_filter = ('step_type', 'is_completed', 'is_required')
    search_fields = ('title', 'progress__school__name')
    readonly_fields = ('completed_at', 'created_at', 'updated_at')
    inlines = [OnboardingChecklistInline, OnboardingResourceInline]
    
    fieldsets = (
        ('Step Information', {
            'fields': ('progress', 'step_number', 'step_type', 'title', 'description')
        }),
        ('Status', {
            'fields': ('is_required', 'is_completed', 'is_skipped', 'completed_by', 'completed_at')
        }),
        ('Additional Data', {
            'fields': ('step_data',),
            'classes': ('collapse',)
        }),
    )


@admin.register(OnboardingChecklist)
class OnboardingChecklistAdmin(admin.ModelAdmin):
    list_display = ('item_number', 'title', 'step', 'is_completed', 'is_optional')
    list_filter = ('is_completed', 'is_optional')
    search_fields = ('title', 'step__title')


@admin.register(OnboardingResource)
class OnboardingResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'resource_type', 'step', 'display_order')
    list_filter = ('resource_type',)
    search_fields = ('title', 'description')
    ordering = ('display_order', 'created_at')


@admin.register(OnboardingNote)
class OnboardingNoteAdmin(admin.ModelAdmin):
    list_display = ('created_by', 'progress', 'step', 'is_issue', 'is_resolved', 'created_at')
    list_filter = ('is_issue', 'is_resolved', 'created_at')
    search_fields = ('note', 'created_by__username', 'progress__school__name')
    readonly_fields = ('created_at', 'updated_at')