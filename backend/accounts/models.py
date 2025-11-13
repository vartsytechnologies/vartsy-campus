from django.contrib.auth.models import User
from django.db import models


class OnboardModel(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='onboard' 
    )
    schoolName = models.CharField(max_length=255)
    schoolType = models.CharField(max_length=255)
    schoolEmail = models.EmailField(max_length=255) 
    schoolRegion = models.CharField(max_length=255)
    schoolResidentialAddress = models.CharField(max_length=255)
    schoolLogoImage = models.ImageField(
        upload_to='school_logo/',
        blank=True,
        null=True
    )
    dateOnboarded = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'School Onboarding'
        verbose_name_plural = 'School Onboardings'

    def __str__(self):
        return f"{self.schoolName} ({self.user.email})"