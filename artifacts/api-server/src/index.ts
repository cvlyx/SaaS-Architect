import app from "./app";
import { logger } from "./lib/logger";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

if (process.env.NODE_ENV === "production") {
  requireEnv("DATABASE_URL");
  requireEnv("TURSO_AUTH_TOKEN");
  requireEnv("JWT_SECRET");
} else {
  if (!process.env.DATABASE_URL) logger.warn("DATABASE_URL not set, DB operations will fail");
  if (!process.env.TURSO_AUTH_TOKEN) logger.warn("TURSO_AUTH_TOKEN not set, DB operations may fail");
  if (!process.env.JWT_SECRET) logger.warn("JWT_SECRET not set, using dev fallback");
}

const rawPort = process.env["PORT"] || "3001";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
