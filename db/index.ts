import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(Deno.env.get("DATABASE_URL")!);
export const db = drizzle(client);
