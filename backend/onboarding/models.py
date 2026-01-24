from django.db import models
from django.conf import settings
from tenancy.models import School

# Create your models here.
class OnboardingProgress(models.Model):
    """
        Tracks the onboarding progress of a school(admin)
    """
    class OnboardingStatus(models.TextChoices):
        NOT_STARTED = "NOT_STARTED","Not Started"
        INPROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETE = "COMPLETED", "Completed"
        SKIPPED = "SKIPPED", "Skipped"
    
    school = models.OneToOneField(School, on_delete=models.CASCADE, related_name="onboarding_progress")
    status = models.CharField(max_length=30, choices=OnboardingStatus.choices, default=OnboardingStatus.NOT_STARTED)
    started_at = models.DateTimeField(null=True)
