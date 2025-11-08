from django.db import models

# Create your models here.

class User(models.Model):
    email = models.EmailField(max_length=225)
    password = models.CharField(max_length=225)
    date_registered = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
    
class OnboardModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    schoolName = models.CharField(max_length=255)
    schoolType = models.CharField(max_length=255)
    schoolEmail = models.EmailField(max_length=255)
    schoolRegion = models.CharField(max_length=255)
    schoolResidentialAddress = models.CharField(max_length=255)
    schoolLogoImage = models.ImageField(upload_to='school_logo/', blank=True, null=True)
    dateOnboarded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.schoolName