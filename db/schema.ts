import {
  pgTable,
  text,
  boolean,
  serial,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";

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

export type DbMonster = typeof monsters.$inferSelect;
export type NewDbMonster = typeof monsters.$inferInsert;

export const endemicLife = pgTable("endemic_life", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  game: jsonb("game").notNull().$type<
    {
      game: string;
      info: string;
      image: string;
    }[]
  >(),
});
export type DbEndemicLife = typeof endemicLife.$inferSelect;
export type NewDbEndemicLife = typeof endemicLife.$inferInsert;

export const quests = pgTable("quests", {
  id: serial("id").primaryKey(),
  quest_id: text("quest_id").notNull(),
  name: varchar("name").notNull(),
  client: varchar("client").notNull(),
  description: text("description").notNull(),
  map: varchar("map").notNull(),
  isKey: boolean("is_key"),
  questType: varchar("quest_type").notNull(),
  game: varchar("game").notNull(),
  difficulty: varchar("difficulty").notNull(),
  objective: text("objective").notNull(),
  targets: jsonb("targets").$type<string[]>(),
});
export type DbQuest = typeof quests.$inferSelect;
export type NewDbQuest = typeof quests.$inferInsert;
