#!/usr/bin/env bash
set -euo pipefail

echo "=== BLOCK 29: APPLY DRIZZLE MIGRATIONS TO AZURE ==="

############################################
# 0) Verify environment
############################################
if [ ! -f ".env" ]; then
  echo "❌ ERROR: .env file not found."
  exit 1
fi

set -a
source .env
set +a

if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ ERROR: DATABASE_URL missing from .env"
  exit 1
fi

echo "Azure Postgres URL loaded."

############################################
# 1) Create production backup folder
############################################
BACKUP_DIR="db-validate/azure-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "=== BACKUP START ==="
echo "Saving schema + data to: $BACKUP_DIR"

# Schema backup
pg_dump \
  --schema-only \
  --no-owner \
  --no-privileges \
  --file "$BACKUP_DIR/schema.sql" \
  "$DATABASE_URL"

# Data backup
pg_dump \
  --data-only \
  --no-owner \
  --no-privileges \
  --inserts \
  --file "$BACKUP_DIR/data.sql" \
  "$DATABASE_URL"

echo "=== BACKUP COMPLETE ==="

############################################
# 2) Apply Drizzle migrations to Azure
############################################
echo "=== APPLYING MIGRATIONS TO AZURE ==="

npx drizzle-kit migrate:pg --url "$DATABASE_URL"

echo "=== MIGRATIONS APPLIED ==="

############################################
# 3) Dump final production schema
############################################
echo "Dumping final Azure schema for verification..."

pg_dump \
  --schema-only \
  --no-owner \
  --no-privileges \
  --file "$BACKUP_DIR/final_schema.sql" \
  "$DATABASE_URL"

############################################
# 4) Normalize schemas for diff
############################################
echo "Normalizing schemas for diff..."

sed 's/--.*//' "$BACKUP_DIR/final_schema.sql" | sed '/^$/d' | sort > "$BACKUP_DIR/final_norm.sql"
sed 's/--.*//' db-validate/code_norm.sql | sed '/^$/d' | sort > "$BACKUP_DIR/code_norm.sql"

############################################
# 5) Compare production vs code
############################################
echo "Comparing production schema → code schema..."

set +e
diff -u "$BACKUP_DIR/code_norm.sql" "$BACKUP_DIR/final_norm.sql" > "$BACKUP_DIR/schema_diff.txt"
DIFF_CODE=$?
set -e

if [ "$DIFF_CODE" -eq 0 ]; then
  echo "=== BLOCK 29 SUCCESS: PRODUCTION IS 100% IN SYNC WITH CODE ==="
else
  echo "⚠️  WARNING: Differences detected. See:"
  echo "   $BACKUP_DIR/schema_diff.txt"
  echo ""
  echo "These can be auto-fixed in Block 30."
fi

############################################
# 6) Create repair summary
############################################
SUMMARY_FILE="$BACKUP_DIR/azure_repair_summary.txt"

{
  echo "=== AZURE MIGRATION SUMMARY ==="
  echo "Completed: $(date)"
  echo ""
  echo "Backup directory: $BACKUP_DIR"
  echo ""
  echo "Migration status:"
  if [ "$DIFF_CODE" -eq 0 ]; then
    echo " - ✔ Production schema matches code schema"
  else
    echo " - ⚠ Differences exist (see schema_diff.txt)"
  fi
  echo ""
  echo "Next Step:"
  echo " - Run Block 30 (Auto-patch Azure if needed)"
} > "$SUMMARY_FILE"

echo "Summary saved → $SUMMARY_FILE"

echo "=== BLOCK 29 COMPLETE ==="
echo "Run: \"Block 29 done → Continue.\""
