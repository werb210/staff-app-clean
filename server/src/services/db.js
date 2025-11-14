// services/db.js
// ---------------------------------------------------------
// Temporary In-Memory DB Layer (SILO-SCOPED)
// Fully matches applicationService + controllers
// ---------------------------------------------------------

import { randomUUID } from "crypto";

// Silo constants (lowercase for auth, uppercase for routing)
export const Silo = {
  BF: "bf",
  SLF: "slf",
};

// ---------------------------------------------------------
// Create one table
// ---------------------------------------------------------
const createTable = () => ({
  data: [],
});

// ---------------------------------------------------------
// Database object — silo-scoped tables exactly as expected
// ---------------------------------------------------------
export const db = {
  id: () => randomUUID(),

  applications: {
    bf: createTable(),
    slf: createTable(),
  },

  documents: {
    bf: createTable(),
    slf: createTable(),
  },

  lenders: {
    bf: createTable(),
    slf: createTable(),
  },

  pipeline: {
    bf: createTable(),
    slf: createTable(),
  },

  communications: {
    bf: createTable(),
    slf: createTable(),
  },

  notifications: {
    bf: createTable(),
    slf: createTable(),
  },

  users: createTable(),

  auditLogs: [],
};

// ---------------------------------------------------------
// Seed user
// ---------------------------------------------------------
db.users.data.push({
  id: "1",
  email: "todd.w@boreal.financial",
  role: "admin",
  silo: "bf",
});

// ---------------------------------------------------------
// Utility (used by /api/_int/db)
// ---------------------------------------------------------
export const describeDatabaseUrl = (url) => {
  if (!url) return { status: "missing" };

  try {
    const u = new URL(url);
    return {
      status: "ok",
      driver: u.protocol.replace(":", ""),
      sanitizedUrl: `${u.protocol}//${u.hostname}:${u.port}${u.pathname}`,
      host: u.hostname,
      port: u.port,
    };
  } catch {
    return { status: "invalid" };
  }
};
