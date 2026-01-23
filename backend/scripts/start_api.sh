#!/usr/bin/env bash
set -euo pipefail

echo "Waiting for database..."
/app/scripts/wait_for_db.sh db:5432 --timeout=30 --strict

echo "Running migrations..."
python manage.py migrate --noinput

echo "Ensuring superuser exists..."
python - <<'PY'
import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vcampus.settings")
django.setup()

from django.contrib.auth import get_user_model
from django.core.management import call_command

User = get_user_model()
email = os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@example.com").strip().lower()

if not User.objects.filter(email=email).exists():
    call_command("create_company_superuser")
PY

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn..."
exec gunicorn vcampus.asgi:application \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --workers 3 \
  --timeout 60
