#!/bin/bash
set -euo pipefail

# Fix any CRLF line endings in scripts
for script in /app/scripts/*.sh; do
    if [ -f "$script" ]; then
        sed -i 's/\r$//' "$script"
        chmod +x "$script"
    fi
done

# Now run the specified command
exec "$@"
