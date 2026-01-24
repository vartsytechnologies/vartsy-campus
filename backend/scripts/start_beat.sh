#!/usr/bin/env bash
set -euo pipefail

echo "Waiting for database..."
/app/scripts/wait_for_db.sh db:5432 --timeout=30 --strict

echo "Starting Celery beat..."
exec celery -A vcampus beat -l info
