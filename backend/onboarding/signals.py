# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from django.utils import timezone
# from tenancy.models import School
# from .models import OnboardingProgress, OnboardingStep


# @receiver(post_save, sender=School)
# def create_onboarding_progress(sender, instance, created, **kwargs):
#     """Create onboarding progress and default steps when a new school is created"""
#     if created:
#         # Create the main onboarding progress
#         progress = OnboardingProgress.objects.create(
#             school=instance,
#             status=OnboardingProgress.OnboardingStatus.NOT_STARTED,
#             started_at=timezone.now(),
#             total_steps=6
#         )
        
#         # Create default onboarding steps
#         default_steps = [
#             {
#                 'step_number': 1,
#                 'step_type': OnboardingStep.StepType.SCHOOL_INFO,
#                 'title': 'Complete School Information',
#                 'description': 'Add your school logo, contact details, and basic information.',
#                 'is_required': True,
#             },
#             {
#                 'step_number': 2,
#                 'step_type': OnboardingStep.StepType.ADMIN_SETUP,
#                 'title': 'Set Up Admin Account',
#                 'description': 'Configure your administrator profile and permissions.',
#                 'is_required': True,
#             },
#             {
#                 'step_number': 3,
#                 'step_type': OnboardingStep.StepType.ACADEMIC_YEAR,
#                 'title': 'Configure Academic Year',
#                 'description': 'Set up terms, semesters, and the academic calendar.',
#                 'is_required': True,
#             },
#             {
#                 'step_number': 4,
#                 'step_type': OnboardingStep.StepType.CLASSES_GRADES,
#                 'title': 'Create Classes and Grades',
#                 'description': 'Add grade levels, classes, and subjects.',
#                 'is_required': True,
#             },
#             {
#                 'step_number': 5,
#                 'step_type': OnboardingStep.StepType.STAFF_INVITE,
#                 'title': 'Invite Staff Members',
#                 'description': 'Add teachers and staff to your school.',
#                 'is_required': False,
#             },
#             {
#                 'step_number': 6,
#                 'step_type': OnboardingStep.StepType.STUDENT_IMPORT,
#                 'title': 'Import Students',
#                 'description': 'Add students individually or import from a spreadsheet.',
#                 'is_required': False,
#             },
#         ]
        
#         for step_data in default_steps:
#             OnboardingStep.objects.create(
#                 progress=progress,
#                 **step_data
#             )