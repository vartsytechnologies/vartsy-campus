from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, email, password = None, **extra_fields):
        if not (email):
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email = email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
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
    
class CustomUser(AbstractUser, PermissionsMixin):
    class Roles(models.TextChoices):
        SCHOOL_ADMIN = "SCHOOL_ADMIN", "School Admin"
        SUPER_ADMIN = "SUPER_ADMIN", "Super Admin"   # you can map this to Django superuser

    class AuthProvider(models.TextChoices):
        LOCAL = "local", "Local"
        GOOGLE = "google", "Google"
        
    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.SCHOOL_ADMIN   # default role for normal users
    )
    avatar_url = models.URLField(blank=True, null=True)
    auth_provider = models.CharField(max_length=20, choices = AuthProvider.choices, default = AuthProvider.LOCAL)
    provider_account_id = models.CharField(max_length=255, blank=True, null=True)

    is_email_verified = models.BooleanField(default=False)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = list[str] = []

    def is_school_admin(self):
        return self.role == self.Roles.SCHOOL_ADMIN

    def is_super_admin(self):
        return self.role == self.Roles.SUPER_ADMIN

    def __str__(self):
        return self.email


