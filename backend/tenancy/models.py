from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings
from django_tenants.models import TenantMixin, DomainMixin


class School(TenantMixin):
    class Plans(models.TextChoices):
        FREEMIUM = "FREEMIUM", "Freemium"
        BASIC = "BASIC", "Basic"
        PREMIUM = "PREMIUM", "Premium"
    
    name = models.CharField(max_length=255)
    plan = models.CharField(max_length=32, choices=Plans.choices, default=Plans.FREEMIUM)
    paid_until = models.DateField(null=True, blank=True)
    on_trial = models.BooleanField(default=True)
    schema_name = models.CharField(max_length=63, unique=True)
    
    auto_create_schema = True
    auto_drop_schema = False

    def __str__(self):
        return f"{self.name} ({self.schema_name})"

class SchoolDomain(DomainMixin):
    # Inherit: domain (str), tenant (FK), is_primary (bool)
    pass

class Membership(models.Model):
    class Roles(models.TextChoices):
        SCHOOL_ADMIN = "SCHOOL_ADMIN", "School Admin"
        TEACHER = "TEACHER", "Teacher"
        STUDENT = "STUDENT", "Student"
        PARENT = "PARENT", "Parent"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="memberships")
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="memberships")
    role = models.CharField(max_length=20, choices=Roles.choices)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("user", "school")

    def __str__(self):
        return f"{self.user} @ {self.school} ({self.role})"
