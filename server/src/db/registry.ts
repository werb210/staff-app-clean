cat << 'EOF' > server/src/db/registry.ts
// server/src/db/registry.ts
import pg from "pg";

export const registry = {
  pool: new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  }),

  // safe query helper
  async query(text: string, params?: any[]) {
    return this.pool.query(text, params);
  },
};
EOF
