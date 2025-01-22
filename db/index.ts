import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionPool = postgres(Deno.env.get("DATABASE_URL")!, {
  max: 10,
  idle_timeout: 30,
  connect_timeout: 30,
});

export const db = drizzle(connectionPool);
