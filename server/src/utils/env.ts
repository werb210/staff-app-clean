// server/src/utils/env.ts

export const env = {
  PORT: Number(process.env.PORT || 5000),
  DATABASE_URL: process.env.DATABASE_URL || "",
  AZURE_BLOB_CONNECTION: process.env.AZURE_BLOB_CONNECTION || "",
};
