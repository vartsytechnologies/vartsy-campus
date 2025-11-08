from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.contrib import messages
from django.db import IntegrityError
from django.contrib.auth.hashers import make_password, check_password
from .models import *
from django.contrib.auth import login

# Create your views here.

def UserRegistrationView(request):
    if request.method == 'POST':
        userEmail = request.POST.get('email')
        userPassword = request.POST.get('password')
        userConfirmPassword = request.POST.get('confirm_password')

        if not userEmail or not userPassword:
            messages.error(request, "Email and Password are required")
            return redirect('registration_page')
        if(userPassword!=userConfirmPassword):
            messages.error(request, 'Password Mismatch')
            return redirect('registration_page') # will be changed when frontend is ready
        
        hashedPassword = make_password(userConfirmPassword)

        try:
             # storing data in the user data Table
            User.objects.create(
                email = userEmail,
                password = hashedPassword
            )

            messages.success(request, 'Account created succesfully')
            return redirect('onboarding')
        
        except IntegrityError:
            messages.error(request, 'An account with the same email aready exists')
            return redirect('register')

        

    return render(request, 'registrationPage.html') # will be changed when frontend is ready


def OnboardFormView(request):
    if not request.user.is_authenticated:
        messages.info(request, 'Please login to continue')
        return redirect('register')
    
    if request.method == 'POST':
        school_name = request.POST.get("schoolName")
        school_type = request.POST.get("schoolType")
        school_email = request.POST.get("schoolEmail")
        school_region = request.POST.get("schoolRegion")
        school_address = request.POST.get("SchoolResidentialAddress")
        logo = request.FILES.get('schoolLogoImage')

        if not all([school_name, school_type, school_email, school_region, school_address]):
            messages.error(request, "All fields are required. ")
            return redirect('onboarding')
        
        OnboardModel.objects.create(
            user = request.user,
            schoolName = school_name,
            schoolType = school_type,
            schoolEmail = school_email,
            schoolRegion = school_region,
            schoolResidentialAddress  = school_address,
            schoolLogoImage = logo
        )
        messages.success(request, "Onboarded successfully")
        return redirect('user_dashboard')
    
    return render(request, "accounts/AdminDashboard.html") # will be implemented after frontend implementation 
        

def UserDashboardView(request):
    return HttpResponse('Under Development')