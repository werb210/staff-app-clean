import dotenv from "dotenv";
dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    console.error(`❌ Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  // --- Database ---
  DATABASE_URL: requireEnv("DATABASE_URL"),

  // --- JWT ---
  JWT_SECRET: requireEnv("JWT_SECRET"),

  // --- Azure / General App Settings ---
  PORT: Number(process.env.PORT || 5000),

  // --- Twilio ---
  TWILIO_ACCOUNT_SID: requireEnv("TWILIO_ACCOUNT_SID"),
  TWILIO_AUTH_TOKEN: requireEnv("TWILIO_AUTH_TOKEN"),
  TWILIO_PHONE_BF: requireEnv("TWILIO_PHONE_BF"),
  TWILIO_PHONE_SLF: requireEnv("TWILIO_PHONE_SLF"),

  // --- Email ---
  SENDGRID_API_KEY: requireEnv("SENDGRID_API_KEY"),

  // --- AI keys ---
  OPENAI_API_KEY: requireEnv("OPENAI_API_KEY"),
};

export default env;
