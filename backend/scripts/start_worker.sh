 #!/bin/bash
set -euo pipefail

echo "Waiting for database..."
/app/scripts/wait_for_db.sh db:5432 --timeout=30 --strict

echo "Starting Celery worker..."
exec celery -A vcampus worker -l info
