#!/bin/bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:5000}"
PORT="${PORT:-5000}"
SERVER_START_CMD=("npx" "tsx" "server/src/index.ts")

STARTED_SERVER=0
SERVER_PID=""

cleanup() {
  if [[ $STARTED_SERVER -eq 1 && -n "${SERVER_PID}" ]]; then
    echo "Stopping temporary server (PID ${SERVER_PID})..."
    kill "${SERVER_PID}" 2>/dev/null || true
    wait "${SERVER_PID}" 2>/dev/null || true
  fi
}
trap cleanup EXIT

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required but not installed."
  exit 1
fi

wait_for_server() {
  local retries=30
  local delay=1
  for ((i=1; i<=retries; i++)); do
    if curl -sf "${BASE_URL}/api/_int/health" >/dev/null; then
      return 0
    fi
    sleep "${delay}"
  done
  return 1
}

ensure_server() {
  if curl -sf "${BASE_URL}/api/_int/health" >/dev/null; then
    echo "Detected running server at ${BASE_URL}."
    return
  fi

  echo "Starting temporary server with: ${SERVER_START_CMD[*]}"
  STARTED_SERVER=1
  (PORT="${PORT}" NODE_ENV=production "${SERVER_START_CMD[@]}" >/tmp/staff-app-smoke-server.log 2>&1) &
  SERVER_PID=$!

  if ! wait_for_server; then
    echo "Server failed to start within timeout."
    exit 1
  fi
  echo "Server is ready (PID ${SERVER_PID})."
}

run_checks() {
  local -a endpoints=(
    "/api/_int/health"
    "/api/applications"
    "/api/documents"
    "/api/lenders"
    "/api/pipeline"
    "/api/communication/sms"
    "/api/admin/retry-queue"
  )

  local failures=0

  for endpoint in "${endpoints[@]}"; do
    printf "Testing %s ... " "${endpoint}"
    local response http_status body
    if ! response=$(curl -sS -w "HTTPSTATUS:%{http_code}" "${BASE_URL}${endpoint}" 2>/tmp/staff-app-smoke-error.log); then
      printf "FAIL (curl error)\n"
      cat /tmp/staff-app-smoke-error.log >&2
      : $((failures++))
      continue
    fi

    http_status="${response##*HTTPSTATUS:}"
    body="${response%HTTPSTATUS:*}"

    if [[ ! "${http_status}" =~ ^2 ]]; then
      printf "FAIL (status %s)\n" "${http_status}"
      echo "Response body:" >&2
      echo "${body}" >&2
      : $((failures++))
      continue
    fi

    if ! echo "${body}" | jq '.' >/tmp/staff-app-smoke-jq.log 2>&1; then
      printf "FAIL (invalid JSON)\n"
      cat /tmp/staff-app-smoke-jq.log >&2
      echo "Raw body:" >&2
      echo "${body}" >&2
      : $((failures++))
      continue
    fi

    printf "PASS\n"
  done

  if [[ ${failures} -gt 0 ]]; then
    echo "${failures} endpoint(s) failed." >&2
    return 1
  fi

  echo "All endpoints responded successfully."
}

ensure_server
run_checks
