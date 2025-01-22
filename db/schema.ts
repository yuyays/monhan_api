import { pgTable, text, boolean, serial, jsonb } from "drizzle-orm/pg-core";

export const monsters = pgTable("monsters", {
  id: serial().primaryKey().notNull(),
  monsterId: text("monster_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  isLarge: boolean("is_large"),
  elements: jsonb("elements").$type<string[]>(),
  ailments: jsonb("ailments").$type<string[]>(),
  weakness: jsonb("weakness").$type<string[]>(),
  games: jsonb("games").notNull().$type<
    {
      game: string;
      image: string;
      info?: string;
      danger?: string;
    }[]
  >(),
});

// Database-specific types
export type DbMonster = typeof monsters.$inferSelect;
export type NewDbMonster = typeof monsters.$inferInsert;
