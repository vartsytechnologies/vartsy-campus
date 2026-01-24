import os
from urllib.parse import urlparse
from django.core.management.base import BaseCommand
from tenancy.models import School, SchoolDomain


class Command(BaseCommand):
    help = "Create or ensure the public tenant and register domains from environment."

    def handle(self, *args, **opts):
        # 1) Get or create public tenant
        tenant, created = School.objects.get_or_create(
            schema_name="public",
            defaults={
                "name": "Public Tenant",
                "plan": School.Plans.FREEMIUM,
                "on_trial": False,
            },
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f"Created public tenant: {tenant}"))
        else:
            self.stdout.write(self.style.WARNING(f"Public tenant already exists: {tenant}"))

        # 2) Register domains from environment variables
        domains_to_register = []

        # From PUBLIC_API_BASE_URL (e.g., https://your-app.onrender.com)
        public_api_url = os.getenv("PUBLIC_API_BASE_URL", "").strip()
        if public_api_url:
            parsed = urlparse(public_api_url)
            if parsed.hostname:
                domains_to_register.append(parsed.hostname)

        # Always include localhost and 127.0.0.1 for local dev
        domains_to_register.extend(["localhost", "127.0.0.1"])

        # 3) Create SchoolDomain entries
        for domain in domains_to_register:
            domain_obj, domain_created = SchoolDomain.objects.get_or_create(
                domain=domain,
                defaults={"tenant": tenant, "is_primary": (domain == domains_to_register[0])},
            )
            if domain_created:
                self.stdout.write(self.style.SUCCESS(f"  ✓ Registered domain: {domain}"))
            else:
                self.stdout.write(self.style.WARNING(f"  - Domain already exists: {domain}"))

        self.stdout.write(self.style.SUCCESS("Public tenant setup complete."))
