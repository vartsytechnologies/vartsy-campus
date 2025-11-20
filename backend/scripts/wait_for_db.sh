#!/usr/bin/env bash
# wait_for_db.sh - Wait until Postgres is ready
set -e

DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}

echo "Waiting for Postgres at $DB_HOST:$DB_PORT..."

while ! python3 - <<'END_PY'
import socket, sys
import os

host = os.environ.get("DB_HOST", "db")
port = int(os.environ.get("DB_PORT", 5432))

s = socket.socket()
try:
    s.connect((host, port))
except socket.error:
    sys.exit(1)
END_PY
do
  sleep 1
done

echo "Postgres is up!"
