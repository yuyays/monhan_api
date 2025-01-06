import { pino } from "npm:pino";
import { pinoLogger } from "npm:hono-pino";
import pretty from "npm:pino-pretty";

export function pino_Logger() {
  return pinoLogger({
    pino: pino(
      {
        level: Deno.env.get("LOG_LEVEL") || "info",
      },
      Deno.env.get("DENO_ENV") == "production" ? undefined : pretty()
    ),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}
