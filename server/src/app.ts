import dotenv from "dotenv";
dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT ? Number(process.env.PORT) : 5000,

  // Database
  DATABASE_URL: requireEnv("DATABASE_URL"),

  // Auth
  JWT_SECRET: requireEnv("JWT_SECRET"),
};

export default env;
