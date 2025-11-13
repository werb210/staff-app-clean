#!/usr/bin/env bash
set -euo pipefail

echo "----------------------------------------"
echo "🔥 ROUTER INTEGRITY TEST (Boreal Staff API)"
echo "----------------------------------------"

echo ""
echo "1) Killing any previous server..."
pkill -f "node" || true
sleep 1

echo ""
echo "2) Starting server in background..."
npm run dev > router-test.log 2>&1 &
SERVER_PID=$!
sleep 4

echo ""
echo "3) Checking server boot..."
if ! ps -p $SERVER_PID > /dev/null; then
  echo "❌ Server failed to start. Log:"
  sed -n '1,80p' router-test.log
  exit 1
fi
echo "✅ Server started."

echo ""
echo "4) Testing mounted routes..."
declare -a ROUTES=(
  "/api/health"
  "/api/applications"
  "/api/documents"
  "/api/lenders"
  "/api/lender-products"
  "/api/pipeline"
)

for route in "${ROUTES[@]}"; do
  echo ""
  echo "→ Testing $route"
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000$route || true)
  echo "Status: $STATUS"

  if [[ "$STATUS" == "200" || "$STATUS" == "401" ]]; then
    echo "  ✅ Route OK"
  elif [[ "$STATUS" == "404" ]]; then
    echo "  ❌ MISSING ROUTE — This router is NOT mounted."
  else
    echo "  ⚠️  Unexpected status, check manually"
  fi
done

echo ""
echo "5) Testing raw Node module resolution..."
declare -a MODULES=(
  "./server/src/routes/applications.js"
  "./server/src/routes/documents.js"
  "./server/src/routes/lenders.js"
  "./server/src/routes/lenderProducts.js"
  "./server/src/routes/pipeline.routes.js"
)

for mod in "${MODULES[@]}"; do
  echo ""
  echo "→ require('$mod')"
  if node --eval "require('$mod')" 2>/dev/null; then
    echo "  ✅ Module loads"
  else
    echo "  ❌ FAIL — Cannot load module"
  fi
done

echo ""
echo "----------------------------------------"
echo "🔥 TEST COMPLETE. Above is truth."
echo "----------------------------------------"

echo ""
echo "Killing server..."
kill $SERVER_PID || true

exit 0
