 #!/bin/bash
set -euo pipefail

echo "Waiting for Postgres..."

while ! python3 - <<'END_PY'
import os
import socket
import sys
from urllib.parse import urlparse

if "DATABASE_URL" in os.environ:
    parsed = urlparse(os.environ["DATABASE_URL"])
    host = parsed.hostname
    port = parsed.port or 5432
else:
    host = os.environ.get("DB_HOST", "db")
    port = int(os.environ.get("DB_PORT", 5432))

s = socket.socket()
s.settimeout(2)

try:
    s.connect((host, port))
except Exception:
    sys.exit(1)
finally:
    s.close()
END_PY
do
  sleep 1
done

echo "Postgres is up!"
