from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.shortcuts import get_object_or_404
# Create your views here.


from .models import (
    OnboardingProgress,
    OnboardingStep,
    OnboardingChecklist,
    OnboardingNote
)
from .serializers import (
    OnboardingProgressSerializer,
    OnboardingStepSerializer,
    OnboardingChecklistSerializer,
    OnboardingNoteSerializer
)


class OnboardingProgressViewSet(viewsets.ModelViewSet):
    queryset = OnboardingProgress.objects.all()
    serializer_class = OnboardingProgressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Filter by school memberships
        user_schools = self.request.user.memberships.values_list('school', flat=True)
        return OnboardingProgress.objects.filter(school__in=user_schools)
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Start the onboarding process"""
        progress = self.get_object()
        
        if progress.status == OnboardingProgress.OnboardingStatus.NOT_STARTED:
            progress.status = OnboardingProgress.OnboardingStatus.IN_PROGRESS
            progress.started_at = timezone.now()
            progress.onboarding_admin = request.user
            progress.save()
            
            return Response({
                'message': 'Onboarding started successfully',
                'data': self.get_serializer(progress).data
            })
        
        return Response({
            'message': 'Onboarding already started'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark onboarding as completed"""
        progress = self.get_object()
        
        progress.status = OnboardingProgress.OnboardingStatus.COMPLETED
        progress.completed_at = timezone.now()
        progress.save()
        
        return Response({
            'message': 'Onboarding completed successfully',
            'data': self.get_serializer(progress).data
        })
    
    @action(detail=True, methods=['post'])
    def skip(self, request, pk=None):
        """Skip the onboarding process"""
        progress = self.get_object()
        
        progress.status = OnboardingProgress.OnboardingStatus.SKIPPED
        progress.save()
        
        return Response({
            'message': 'Onboarding skipped',
            'data': self.get_serializer(progress).data
        })


class OnboardingStepViewSet(viewsets.ModelViewSet):
    queryset = OnboardingStep.objects.all()
    serializer_class = OnboardingStepSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user_schools = self.request.user.memberships.values_list('school', flat=True)
        return OnboardingStep.objects.filter(progress__school__in=user_schools)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark a step as completed"""
        step = self.get_object()
        step.mark_complete(user=request.user)
        
        # Update current step in progress
        progress = step.progress
        progress.current_step = step.step_number
        progress.save()
        
        return Response({
            'message': f'Step "{step.title}" completed successfully',
            'data': self.get_serializer(step).data,
            'completion_percentage': progress.completion_percentage
        })
    
    @action(detail=True, methods=['post'])
    def skip(self, request, pk=None):
        """Skip a step"""
        step = self.get_object()
        
        if not step.is_required:
            step.is_skipped = True
            step.save()
            
            # Recalculate completion
            step.progress.calculate_completion_percentage()
            
            return Response({
                'message': f'Step "{step.title}" skipped',
                'data': self.get_serializer(step).data
            })
        
        return Response({
            'message': 'Cannot skip required steps'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def save_data(self, request, pk=None):
        """Save step-specific data"""
        step = self.get_object()
        step.step_data = request.data.get('step_data', {})
        step.save()
        
        return Response({
            'message': 'Step data saved successfully',
            'data': self.get_serializer(step).data
        })


class OnboardingChecklistViewSet(viewsets.ModelViewSet):
    queryset = OnboardingChecklist.objects.all()
    serializer_class = OnboardingChecklistSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        """Toggle checklist item completion"""
        item = self.get_object()
        item.is_completed = not item.is_completed
        
        if item.is_completed:
            item.completed_at = timezone.now()
        else:
            item.completed_at = None
        
        item.save()
        
        return Response({
            'message': 'Checklist item updated',
            'data': self.get_serializer(item).data
        })


class OnboardingNoteViewSet(viewsets.ModelViewSet):
    queryset = OnboardingNote.objects.all()
    serializer_class = OnboardingNoteSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Mark an issue as resolved"""
        note = self.get_object()
        note.is_resolved = True
        note.save()
        
        return Response({
            'message': 'Issue marked as resolved',
            'data': self.get_serializer(note).data
        })