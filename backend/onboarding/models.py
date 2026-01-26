from django.db import models
from django.conf import settings
from django.utils import timezone
from tenancy.models import School
from django.core.validators import MinValueValidator, MaxValueValidator
from academics.models import AcademicYear, Term, ClassLevel, ClassGroup, Subject
from django.core.exceptions import ValidationError


class OnboardingProgress(models.Model):
    """Track overall onboarding progress for a school"""
    
    class OnboardingStatus(models.TextChoices):
        NOT_STARTED = "NOT_STARTED", "Not Started"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"
        SKIPPED = "SKIPPED", "Skipped"
    
    school = models.OneToOneField(
        School, 
        on_delete=models.CASCADE, 
        related_name="onboarding_progress"
    )
    status = models.CharField(
        max_length=20, 
        choices=OnboardingStatus.choices, 
        default=OnboardingStatus.NOT_STARTED
    )
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    current_step = models.PositiveIntegerField(default=0)
    total_steps = models.PositiveIntegerField(default=6)
    completion_percentage = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    
    # Track which user is handling the onboarding
    onboarding_admin = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="onboarding_sessions"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Onboarding Progress"
        verbose_name_plural = "Onboarding Progresses"
    
    def __str__(self):
        return f"{self.school.name} - {self.status} ({self.completion_percentage}%)"
    
    def calculate_completion_percentage(self):
        """Calculate completion percentage based on completed steps"""
        completed_steps = self.steps.filter(is_completed=True).count()
        if self.total_steps > 0:
            self.completion_percentage = int((completed_steps / self.total_steps) * 100)
        else:
            self.completion_percentage = 0
        self.save(update_fields=['completion_percentage'])
        return self.completion_percentage


class OnboardingStep(models.Model):
    """Individual steps in the onboarding process"""
    
    class StepType(models.TextChoices):
        SCHOOL_INFO = "SCHOOL_INFO", "School Information"
        ADMIN_SETUP = "ADMIN_SETUP", "Admin Setup"
        ACADEMIC_YEAR = "ACADEMIC_YEAR", "Academic Year Setup"
        CLASSES_GRADES = "CLASSES_GRADES", "Classes & Grades"
        STAFF_INVITE = "STAFF_INVITE", "Invite Staff"
        STUDENT_IMPORT = "STUDENT_IMPORT", "Import Students"
        CUSTOM = "CUSTOM", "Custom Step"

        # Academic related steps
        ACADEMIC_YEAR_SETUP = "ACADEMIC_YEAR_SETUP", "Set Up Current Academic Year"
        TERMS_SETUP = "TERMS_SETUP", "Define Terms / Semesters"
        CLASS_LEVELS_SETUP = "CLASS_LEVELS_SETUP", "Create Class Levels / Forms"
        CLASS_GROUPS_SETUP = "CLASS_GROUPS_SETUP", "Create Class Groups / Streams"
        SUBJECTS_SETUP = "SUBJECTS_SETUP", "Add Subjects (Core & Elective)"
    
    progress = models.ForeignKey(
        OnboardingProgress, 
        on_delete=models.CASCADE, 
        related_name="steps"
    )
    step_type = models.CharField(max_length=20, choices=StepType.choices)
    step_number = models.PositiveIntegerField()
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    is_required = models.BooleanField(default=True)
    is_completed = models.BooleanField(default=False)
    is_skipped = models.BooleanField(default=False)
    
    completed_at = models.DateTimeField(null=True, blank=True)
    completed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="completed_onboarding_steps"
    )
    
    #Store step-specific data as JSON
    step_data = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Onboarding Step"
        verbose_name_plural = "Onboarding Steps"
        ordering = ['step_number']
        unique_together = ('progress', 'step_number')
    
    def __str__(self):
        status = "completed" if self.is_completed else "not completed"
        return f"{status} Step {self.step_number}: {self.title}"
    
    def mark_complete(self, user=None):
        # For academic steps: check real data before allowing completion
        if self.step_type in [
            self.StepType.ACADEMIC_YEAR_SETUP,
            self.StepType.TERMS_SETUP,
            self.StepType.CLASS_LEVELS_SETUP,
            self.StepType.CLASS_GROUPS_SETUP,
            self.StepType.SUBJECTS_SETUP,
        ]:
            if not self.is_academic_step_fulfilled():
                raise ValidationError(
                    f"Cannot complete '{self.title}' yet. "
                    f"Please finish the required academic setup first."
                )

        self.is_completed = True
        self.completed_at = timezone.now()
        if user:
            self.completed_by = user
        self.save()

        # Update overall progress
        self.progress.calculate_completion_percentage()

        # Auto-complete entire onboarding if all required steps are done
        remaining_required = self.progress.steps.filter(
            is_required=True,
            is_completed=False
        ).count()

        if remaining_required == 0:
            self.progress.status = OnboardingProgress.OnboardingStatus.COMPLETED
            self.progress.completed_at = timezone.now()
            self.progress.save()
        


    def is_academic_step_fulfilled(self) -> bool:
        """Check if the academic step is actually done based on real data"""
        if not self.progress or not self.progress.school:
            return False

        school = self.progress.school

        if self.step_type == self.StepType.ACADEMIC_YEAR_SETUP:
            return AcademicYear.objects.filter(school=school, is_current=True).exists()

        if self.step_type == self.StepType.TERMS_SETUP:
            current_year = AcademicYear.objects.filter(school=school, is_current=True).first()
            if not current_year:
                return False
            return current_year.terms.filter(is_current=True).exists()

        if self.step_type == self.StepType.CLASS_LEVELS_SETUP:
            return ClassLevel.objects.filter(school=school, is_active=True).count() >= 3

        if self.step_type == self.StepType.CLASS_GROUPS_SETUP:
            return ClassGroup.objects.filter(class_level__school=school).exists()

        if self.step_type == self.StepType.SUBJECTS_SETUP:
            return Subject.objects.filter(school=school).count() >= 8

        return self.is_completed


class OnboardingChecklist(models.Model):
    """checklist items within each step"""
    
    step = models.ForeignKey(
        OnboardingStep, 
        on_delete=models.CASCADE, 
        related_name="checklist_items"
    )
    item_number = models.PositiveIntegerField()
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    is_completed = models.BooleanField(default=False)
    is_optional = models.BooleanField(default=False)
    
    # Link to specific action or URL
    action_url = models.CharField(max_length=500, blank=True)
    
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Checklist Item"
        verbose_name_plural = "Checklist Items"
        ordering = ['item_number']
        unique_together = ('step', 'item_number')
    
    def __str__(self):
        status = "completed" if self.is_completed else "not completed"
        return f"{status} {self.title}"


class OnboardingResource(models.Model):
    """Help resources and documentation for onboarding steps"""
    
    class ResourceType(models.TextChoices):
        VIDEO = "VIDEO", "Video Tutorial"
        ARTICLE = "ARTICLE", "Article/Guide"
        PDF = "PDF", "PDF Document"
        LINK = "LINK", "External Link"
    
    step = models.ForeignKey(
        OnboardingStep,
        on_delete=models.CASCADE,
        related_name="resources",
        null=True,
        blank=True
    )
    
    title = models.CharField(max_length=255)
    resource_type = models.CharField(max_length=20, choices=ResourceType.choices)
    url = models.URLField(max_length=500)
    description = models.TextField(blank=True)
    
    # For ordering resources
    display_order = models.PositiveIntegerField(default=0)
    
    # Track if user viewed the resource
    is_helpful = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Onboarding Resource"
        verbose_name_plural = "Onboarding Resources"
        ordering = ['display_order', 'created_at']
    
    def __str__(self):
        return f"{self.title} ({self.resource_type})"


class OnboardingNote(models.Model):
    """Notes or issues encountered during onboarding"""
    
    progress = models.ForeignKey(
        OnboardingProgress,
        on_delete=models.CASCADE,
        related_name="notes"
    )
    step = models.ForeignKey(
        OnboardingStep,
        on_delete=models.CASCADE,
        related_name="notes",
        null=True,
        blank=True
    )
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="onboarding_notes"
    )
    
    note = models.TextField()
    is_issue = models.BooleanField(default=False)
    is_resolved = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Onboarding Note"
        verbose_name_plural = "Onboarding Notes"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Note by {self.created_by} - {self.created_at.strftime('%Y-%m-%d')}"