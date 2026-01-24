from rest_framework import serializers
from .models import (
    OnboardingProgress,
    OnboardingStep,
    OnboardingChecklist,
    OnboardingResource,
    OnboardingNote
)


class OnboardingChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnboardingChecklist
        fields = [
            'id', 'item_number', 'title', 'description',
            'is_completed', 'is_optional', 'action_url', 'completed_at'
        ]
        read_only_fields = ['completed_at']


class OnboardingResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnboardingResource
        fields = [
            'id', 'title', 'resource_type', 'url',
            'description', 'display_order'
        ]


class OnboardingStepSerializer(serializers.ModelSerializer):
    checklist_items = OnboardingChecklistSerializer(many=True, read_only=True)
    resources = OnboardingResourceSerializer(many=True, read_only=True)
    completed_by_name = serializers.CharField(
        source='completed_by.get_full_name',
        read_only=True,
        allow_null=True
    )
    
    class Meta:
        model = OnboardingStep
        fields = [
            'id', 'step_number', 'step_type', 'title', 'description',
            'is_required', 'is_completed', 'is_skipped',
            'completed_at', 'completed_by', 'completed_by_name',
            'step_data', 'checklist_items', 'resources'
        ]
        read_only_fields = ['completed_at', 'completed_by']


class OnboardingNoteSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(
        source='created_by.get_full_name',
        read_only=True
    )
    
    class Meta:
        model = OnboardingNote
        fields = [
            'id', 'step', 'created_by', 'created_by_name',
            'note', 'is_issue', 'is_resolved',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']


class OnboardingProgressSerializer(serializers.ModelSerializer):
    steps = OnboardingStepSerializer(many=True, read_only=True)
    notes = OnboardingNoteSerializer(many=True, read_only=True)
    school_name = serializers.CharField(source='school.name', read_only=True)
    onboarding_admin_name = serializers.CharField(
        source='onboarding_admin.get_full_name',
        read_only=True,
        allow_null=True
    )
    
    class Meta:
        model = OnboardingProgress
        fields = [
            'id', 'school', 'school_name', 'status',
            'started_at', 'completed_at', 'current_step', 'total_steps',
            'completion_percentage', 'onboarding_admin', 'onboarding_admin_name',
            'steps', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'completion_percentage', 'created_at', 'updated_at'
        ]