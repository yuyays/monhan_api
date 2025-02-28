import { RouteConfig, RouteHandler } from "@hono/zod-openapi";
import { sql, and, SQL, ilike, or, eq } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

import { AppBindings } from "../../lib/create-app.ts";
import { db } from "../../db/index.ts";
import { monsters, quests } from "../../db/schema.ts";
import {
  getFilteredMonstersRoute,
  getMonsterIconRoute,
  getMonsterQuestsRoute,
  getMonsterRoute,
  getMonsterTypesRoute,
  getPaginatedMonstersRoute,
  getSimilarMonstersRoute,
} from "./routes.ts";

type MonsterRouteHandler<T extends RouteConfig> = RouteHandler<T, AppBindings>;

export const getMonsterTypes: MonsterRouteHandler<
  typeof getMonsterTypesRoute
> = async (c) => {
  const types = await db
    .select({ type: monsters.type })
    .from(monsters)
    .groupBy(monsters.type);

  return c.json(
    types.map((m) => m.type),
    200
  );
};

export const getPaginatedMonsters: MonsterRouteHandler<
  typeof getPaginatedMonstersRoute
> = async (c) => {
  const { limit: limitStr, offset: offsetStr } = c.req.valid("query");
  const limit = parseInt(limitStr || "20");
  const offset = parseInt(offsetStr || "0");

  // Combine count and data fetch in single query for better performance
  const [{ count }, paginatedMonsters] = await Promise.all([
    db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(monsters)
      .then((res) => res[0]),
    db.select().from(monsters).limit(limit).offset(offset),
  ]);

  return c.json({
    count,
    next:
      offset + limit < count
        ? `/api/monsters?limit=${limit}&offset=${offset + limit}`
        : null,
    previous:
      offset > 0
        ? `/api/monsters?limit=${limit}&offset=${Math.max(0, offset - limit)}`
        : null,
    results: paginatedMonsters,
  });
};

export const getFilteredMonsters: MonsterRouteHandler<
  typeof getFilteredMonstersRoute
> = async (c) => {
  const createArrayFilter = (
    column: PgColumn<any>,
    values: string[],
    operator: "and" | "or"
  ): SQL => {
    const normalizedValues = values.map((v) => v.trim().toLowerCase());

    const conditions = normalizedValues.map(
      (value) =>
        sql`EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(${column}) elem
          WHERE ${ilike(sql`elem`, `%${value}%`)}
        )`
    );

    if (conditions.length === 0) {
      return sql`TRUE`;
    }

    if (operator === "and") {
      return and(...conditions) ?? sql`TRUE`;
    }
    return or(...conditions) ?? sql`TRUE`;
  };

  const {
    elements,
    elements_operator = "or",
    weakness,
    weakness_operator = "or",
    ailments,
    ailments_operator = "or",
  } = c.req.valid("query");

  const totalCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(monsters)
    .then((res) => res[0].count);

  console.log("Total monsters in database:", totalCount);

  const conditions = [];

  if (elements) {
    const elementValues = elements.split(",").map((e) => e.trim());
    console.log(
      "Processing elements:",
      elementValues,
      "with operator:",
      elements_operator
    );
    conditions.push(
      createArrayFilter(monsters.elements, elementValues, elements_operator)
    );
  }
  if (weakness) {
    const weaknessValues = weakness.split(",").map((w) => w.trim());
    conditions.push(
      createArrayFilter(monsters.weakness, weaknessValues, weakness_operator)
    );
  }

  if (ailments) {
    const ailmentValues = ailments.split(",").map((a) => a.trim());
    conditions.push(
      createArrayFilter(monsters.ailments, ailmentValues, ailments_operator)
    );
  }

  const filteredMonsters = await db
    .select()
    .from(monsters)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  return c.json(filteredMonsters);
};

export const getMonster: MonsterRouteHandler<typeof getMonsterRoute> = async (
  c
) => {
  const name = c.req.param("name");
  const monster = await db
    .select()
    .from(monsters)
    .where(sql`LOWER(${monsters.name}) = LOWER(${name})`)
    .limit(1);

  if (monster.length > 0) {
    return c.json(monster[0]);
  }
  return c.notFound();
};

export const getMonsterIcon: MonsterRouteHandler<
  typeof getMonsterIconRoute
> = async (c) => {
  const { name } = c.req.valid("param");
  const monster = await db
    .select()
    .from(monsters)
    .where(sql`LOWER(${monsters.name}) = LOWER(${name})`)
    .limit(1);

  if (monster[0]?.games?.[0]?.image) {
    const iconPath = `/static/monster-hunter-DB-master/icons/${monster[0].games[0].image}`;
    return c.redirect(iconPath);
  }

  return c.json({ message: `Icon not found for monster: ${name}` }, 404);
};

export const getMonsterQuests: MonsterRouteHandler<
  typeof getMonsterQuestsRoute
> = async (c) => {
  const { id } = c.req.valid("param");

  const monster = await db
    .select()
    .from(monsters)
    .where(eq(monsters.monsterId, id))
    .limit(1);

  if (monster.length === 0) {
    return c.json(
      {
        message: `Monster not found with id: ${id}`,
      },
      404
    );
  }

  const monsterQuests = await db
    .select()
    .from(quests)
    .where(
      sql`EXISTS (
        SELECT 1 FROM jsonb_array_elements_text(${quests.targets}) target
        WHERE LOWER(target) = LOWER(${monster[0].name})
      )`
    );

  return c.json(
    {
      monster: monster[0],
      quests: monsterQuests,
    },
    200
  );
};

export const getSimilarMonsters: MonsterRouteHandler<
  typeof getSimilarMonstersRoute
> = async (c) => {
  const { id } = c.req.valid("param");

  const sourceMonster = await db
    .select()
    .from(monsters)
    .where(eq(monsters.monsterId, id))
    .limit(1);

  if (sourceMonster.length === 0) {
    return c.json(
      {
        message: `Monster not found with id: ${id}`,
      },
      404
    );
  }

  // Find monsters with similar elements
  const similarByElements = sourceMonster[0].elements
    ? await db
        .select()
        .from(monsters)
        .where(
          and(
            sql`${monsters.monsterId} != ${id}`,
            sql`EXISTS (
              SELECT 1 FROM jsonb_array_elements_text(${monsters.elements}) elem
              WHERE elem IN (SELECT jsonb_array_elements_text(${sql`${JSON.stringify(
                sourceMonster[0].elements
              )}`}::jsonb))
            )`
          )
        )
        .limit(5)
    : [];

  // Find monsters with similar weaknesses
  const similarByWeakness = sourceMonster[0].weakness
    ? await db
        .select()
        .from(monsters)
        .where(
          and(
            sql`${monsters.monsterId} != ${id}`,
            sql`EXISTS (
              SELECT 1 FROM jsonb_array_elements_text(${monsters.weakness}) weak
              WHERE weak IN (SELECT jsonb_array_elements_text(${sql`${JSON.stringify(
                sourceMonster[0].weakness
              )}`}::jsonb))
            )`
          )
        )
        .limit(5)
    : [];

  return c.json(
    {
      source: sourceMonster[0],
      similarByElements,
      similarByWeakness,
    },
    200
  );
};
