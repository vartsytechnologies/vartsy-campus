#!/usr/bin/env bash
set -e
./scripts/wait_for_db.sh
python manage.py migrate --noinput
python manage.py collectstatic --noinput

# Use $PORT if defined, otherwise default to 8000
gunicorn vcampus.wsgi:application --bind 0.0.0.0:${PORT:-8001} --workers 3
    