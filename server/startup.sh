#!/bin/sh

cd /home/site/wwwroot

echo "Starting Staff Server..."
echo "Node version:"
node -v

echo "Running: node dist/index.js"
exec node dist/index.js
