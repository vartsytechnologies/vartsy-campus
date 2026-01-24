from django.contrib import admin
from .models import SchoolDomain, Membership, School
# Register your models here.

@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ('name', 'schema_name', 'plan', 'paid_until', 'on_trial')
    search_fields = ('name', 'schema_name', 'plan')
    list_filter = ('plan', 'on_trial')
    
@admin.register(SchoolDomain)
class SchoolDomainAdmin(admin.ModelAdmin):
    list_display = ('domain', 'tenant', 'is_primary')
    search_fields = ('domain',)
    list_filter = ('is_primary',)
    
@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'school', 'role', 'is_active')
    search_fields = ('user__email', 'school__name', 'role')
    list_filter = ('role', 'is_active')