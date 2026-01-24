from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
# Register your models here.

CustomUser = get_user_model()
@admin.register(get_user_model())
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email','first_name', 'last_name','role','auth_provider', 'is_staff', 'is_active', 'is_email_verified')
    list_filter = ('is_staff', 'is_active', 'is_email_verified')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_email_verified')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active', 'is_email_verified')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)