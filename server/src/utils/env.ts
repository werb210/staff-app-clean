export type DatabaseUrlMetadata =
  | {
      status: "missing";
      driver: null;
      sanitizedUrl: null;
      host: null;
      port: null;
    }
  | {
      status: "invalid";
      driver: null;
      sanitizedUrl: string;
      host: null;
      port: null;
    }
  | {
      status: "ok";
      driver: string;
      sanitizedUrl: string;
      host: string | null;
      port: string | null;
    };

const REDACTED = "****";

export function describeDatabaseUrl(value: string | undefined): DatabaseUrlMetadata {
  if (!value) {
    return {
      status: "missing",
      driver: null,
      sanitizedUrl: null,
      host: null,
      port: null,
    };
  }

  try {
    const parsed = new URL(value);
    const driver = parsed.protocol.replace(/:$/, "");

    if (parsed.password) {
      parsed.password = REDACTED;
    }

    if (parsed.username) {
      parsed.username = REDACTED;
    }

    return {
      status: "ok",
      driver,
      sanitizedUrl: parsed.toString(),
      host: parsed.hostname || null,
      port: parsed.port || null,
    };
  } catch (error) {
    return {
      status: "invalid",
      driver: null,
      sanitizedUrl: value,
      host: null,
      port: null,
    };
  }
}
