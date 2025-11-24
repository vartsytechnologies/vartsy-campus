from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, email, password = None, **extra_fields):
        if not (email):
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        accountUser = self.model(email = email, **extra_fields)
        accountUser.set_password(password)
        accountUser.save(using=self._db)
        return accountUser
    
    def create_superuser(self, email, password = None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', CustomUser.Roles.SUPER_ADMIN)

       
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser = True.')
        return self.create_user(email, password, **extra_fields)
    
class CustomUser(AbstractBaseUser, PermissionsMixin):
    class Roles(models.TextChoices):
        SCHOOL_ADMIN = "SCHOOL_ADMIN", "School Admin"
        SUPER_ADMIN = "SUPER_ADMIN", "Super Admin"   # you can map this to Django superuser

    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.SCHOOL_ADMIN   # default role for normal users
    )

    is_email_verified = models.BooleanField(default=False)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def is_school_admin(self):
        return self.role == self.Roles.SCHOOL_ADMIN

    def is_super_admin(self):
        return self.role == self.Roles.SUPER_ADMIN

    def __str__(self):
        return self.email

    
class SchoolOnboard(models.Model):
    userAccount = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='onboarded_school'
    )
    schoolName = models.CharField(max_length=255)
    schoolType = models.CharField(max_length=255)
    schoolEmail = models.EmailField(max_length=255, unique=True)
    schoolRegion = models.CharField(max_length=255)
    schoolLogoImage = models.ImageField(
        upload_to='school_logo',
        blank=True,
        null=True,
        help_text="optional logo (max 2 MB)"
    )

    dateOnboard = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'School Onboarding'
        verbose_name_plural = 'School Onboardings'

    def __str__(self):
        return f"{self.schoolName} ({self.userAccount.email})"
