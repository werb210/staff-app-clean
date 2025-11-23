#!/usr/bin/env bash
set -euo pipefail

# Azure strips executable perms — restore them
chmod +x /home/site/wwwroot/startup.sh || true

echo "== STARTING STAFF SERVER =="

# Print working directory for debugging
echo "PWD: $(pwd)"
echo "Node version: $(node -v)"

# Force absolute path because Azure’s startup dir changes
node /home/site/wwwroot/dist/index.js
