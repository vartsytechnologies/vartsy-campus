# apps/accounts/management/commands/create_company_superuser.py
import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = "Create (or ensure) a company superuser. Reads env vars or CLI args."

    def add_arguments(self, parser):
        parser.add_argument("--email", help="Superuser email (overrides env)", default=None)
        parser.add_argument("--password", help="Superuser password (overrides env)", default=None)
        parser.add_argument(
            "--reset-password",
            action="store_true",
            help="If user exists, reset password instead of skipping",
        )

    def handle(self, *args, **opts):
        CustomUser = get_user_model()

        email = (
            (opts["email"] or os.environ.get("DJANGO_SUPERUSER_EMAIL") or "admin@example.com")
            .strip()
            .lower()
        )
        password = opts["password"] or os.environ.get("DJANGO_SUPERUSER_PASSWORD")

        if not password:
            self.stderr.write(
                self.style.ERROR("No password provided. Set --password or DJANGO_SUPERUSER_PASSWORD.")
            )
            return

        user, created = CustomUser.objects.get_or_create(
            email=email,
            defaults={"is_staff": True, "is_superuser": True, "is_active": True},
        )

        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Superuser {email} created."))
            return

        # If user already exists
        if opts["reset_password"]:
            user.set_password(password)
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True
            user.save()
            self.stdout.write(
                self.style.WARNING(
                    f"Superuser {email} existed — password reset & flags ensured."
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING(f"Superuser {email} already exists — skipped.")
            )
