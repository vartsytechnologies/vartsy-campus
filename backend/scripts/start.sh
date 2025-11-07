#!/usr/bin/env bash
set -e
./scripts/wait_for_db.sh
python manage.py migrate --noinput
python manage.py collectstatic --noinput
gunicorn vcampus.wsgi:application --bind 0.0.0.0:8000 --workers 3
