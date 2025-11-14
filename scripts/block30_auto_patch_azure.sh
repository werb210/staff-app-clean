#!/usr/bin/env bash
set -euo pipefail

echo "=== BLOCK 30: AUTO-PATCH AZURE + FINALIZE BACKEND ==="

############################################
# 0) Load ENV
############################################
if [ ! -f ".env" ]; then
  echo "❌ .env missing"
  exit 1
fi

set -a
source .env
set +a

if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ DATABASE_URL missing from .env"
  exit 1
fi

############################################
# 1) Prepare directories
############################################
PATCH_DIR="db-validate/patch-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$PATCH_DIR"

############################################
# 2) Generate fresh Drizzle SQL snapshot
############################################
echo "Generating code schema snapshot..."
npx drizzle-kit generate:pg --out "$PATCH_DIR/drizzle_codegen"

############################################
# 3) Diff Code → Azure
############################################
echo "Normalizing Azure schema..."
pg_dump \
  --schema-only \
  --no-owner \
  --no-privileges \
  --file "$PATCH_DIR/azure_schema.sql" \
  "$DATABASE_URL"

sed 's/--.*//' "$PATCH_DIR/azure_schema.sql" | sed '/^$/d' | sort > "$PATCH_DIR/azure_norm.sql"

echo "Normalizing code schema..."
cat "$PATCH_DIR/drizzle_codegen"/*.sql > "$PATCH_DIR/code_schema.sql"
sed 's/--.*//' "$PATCH_DIR/code_schema.sql" | sed '/^$/d' | sort > "$PATCH_DIR/code_norm.sql"

echo "Running diff..."
set +e
diff -u "$PATCH_DIR/azure_norm.sql" "$PATCH_DIR/code_norm.sql" > "$PATCH_DIR/schema_diff.txt"
DIFF=$?
set -e

if [ "$DIFF" -eq 0 ]; then
  echo "✔ Azure schema already matches code"
else
  echo "⚠ Patching required"
  echo "See diff at: $PATCH_DIR/schema_diff.txt"
fi

############################################
# 4) Auto-apply schema fixes (safe mode)
############################################
echo "=== Applying missing SQL structures to Azure ==="

for f in "$PATCH_DIR/drizzle_codegen"/*.sql; do
  echo "Applying: $f"
  psql "$DATABASE_URL" -f "$f" || true
done

############################################
# 5) Re-check Production schema
############################################
echo "Re-dumping Azure schema..."

pg_dump \
  --schema-only \
  --no-owner \
  --no-privileges \
  --file "$PATCH_DIR/final_schema.sql" \
  "$DATABASE_URL"

sed 's/--.*//' "$PATCH_DIR/final_schema.sql" | sed '/^$/d' | sort > "$PATCH_DIR/final_norm.sql"

echo "Comparing again..."
set +e
diff -u "$PATCH_DIR/code_norm.sql" "$PATCH_DIR/final_norm.sql" > "$PATCH_DIR/final_diff.txt"
FINAL=$?
set -e

############################################
# 6) Output summary
############################################
SUMMARY="$PATCH_DIR/patch_summary.txt"
{
  echo "=== BLOCK 30 SUMMARY ==="
  echo "Completed: $(date)"
  echo ""
  if [ "$FINAL" -eq 0 ]; then
    echo "✔ Azure is fully synced with code schema"
  else
    echo "⚠ Differences remain (see final_diff.txt)"
  fi
  echo ""
  echo "Next:"
  echo "Run Block 31 (Backend Build + Start Verification)"
} > "$SUMMARY"

echo "Summary saved to: $SUMMARY"
echo "=== BLOCK 30 COMPLETE ==="
echo "Run: \"Block 30 done → Continue.\""
