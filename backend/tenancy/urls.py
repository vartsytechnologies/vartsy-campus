from django.urls import path
from .views import WhoAmIInTenantView

urlpatterns = [
    path("whoami/", WhoAmIInTenantView.as_view(), name="tenant-whoami"),
]
