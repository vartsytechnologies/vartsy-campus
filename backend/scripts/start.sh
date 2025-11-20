#!/bin/sh
set -e

echo "Waiting for database..."
/app/scripts/wait_for_db.sh db:5432 --timeout=30 --strict

echo "Running migrations..."
python manage.py migrate --noinput

echo "Starting Gunicorn..."
exec gunicorn vcampus.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3