#!/usr/bin/env bash
set -euo pipefail

echo "=== STARTING STAFF SERVER ==="
echo "PWD: $(pwd)"
echo "FILES IN WWWROOT:"
ls -la

node dist/index.js
