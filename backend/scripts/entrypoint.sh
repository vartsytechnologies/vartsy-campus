#!/bin/bash
set -euo pipefail

# Normalize line endings and ensure executability for all script files
for script in /app/scripts/*.sh; do
    if [ -f "$script" ]; then
        sed -i 's/\r$//' "$script"
        chmod +x "$script"
    fi
done

# Execute the provided command
exec "$@"
