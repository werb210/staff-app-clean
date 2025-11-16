// server/src/utils/env.ts
export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  AZURE_BLOB_CONNECTION: process.env.AZURE_BLOB_CONNECTION ?? "",
  AZURE_BLOB_CONTAINER: process.env.AZURE_BLOB_CONTAINER ?? "",
};
