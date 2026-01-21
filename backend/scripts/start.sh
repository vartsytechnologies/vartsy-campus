#!/bin/sh
#!/usr/bin/env bash
set -euo pipefail


echo "Waiting for database..."
/app/scripts/wait_for_db.sh db:5432 --timeout=30 --strict

echo "Running migrations..."
python manage.py migrate --noinput

# Only create superuser if it does not exist
python - <<'PY'
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vcampus.settings')
django.setup()
from django.contrib.auth import get_user_model
from django.core.management import call_command

CustomUser = get_user_model()

email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@example.com").strip().lower()

if not CustomUser.objects.filter(email=email).exists():
    call_command("create_company_superuser")
PY

python manage.py collectstatic --noinput

echo "Starting Gunicorn..."
exec gunicorn vcampus.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3
