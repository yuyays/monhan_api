import { OpenAPIHono } from "@hono/zod-openapi";
import { sql, and, SQL, ilike, or } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

import {
  getFilteredMonstersRoute,
  getMonsterIconRoute,
  getMonsterRoute,
  getMonstersByAilmentRoute,
  getMonstersByElementRoute,
  getMonstersByTypeRoute,
  getMonstersByWeaknessRoute,
  getMonsterTypesRoute,
  getPaginatedMonstersRoute,
} from "./routes.ts";
import { AppBindings } from "../../lib/create-app.ts";
import { db } from "../../db/index.ts";
import { monsters } from "../../db/schema.ts";

export const setupMonsterRoutes = (app: OpenAPIHono<AppBindings>) => {
  app.openapi(getMonsterTypesRoute, async (c) => {
    const types = await db
      .select({ type: monsters.type })
      .from(monsters)
      .groupBy(monsters.type);

    return c.json(types.map((m) => m.type));
  });

  app.openapi(getPaginatedMonstersRoute, async (c) => {
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
  });

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

  app.openapi(getFilteredMonstersRoute, async (c) => {
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
  });

  app.openapi(getMonsterRoute, async (c) => {
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
  });

  app.openapi(getMonstersByTypeRoute, async (c) => {
    const { type } = c.req.valid("param");
    const result = await db
      .select()
      .from(monsters)
      .where(sql`LOWER(${monsters.type}) = LOWER(${type})`);

    if (result.length === 0) {
      return c.json({ message: `No monsters found with type: ${type}` }, 404);
    }
    return c.json(result, 200);
  });

  app.openapi(getMonstersByElementRoute, async (c) => {
    const { element } = c.req.valid("param");
    const result = await db.select().from(monsters).where(sql`EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(${monsters.elements}) as elem
      WHERE LOWER(elem::text) = LOWER(${element})
    )`);

    return result.length > 0
      ? c.json(result, 200)
      : c.json({ message: `No monsters found with element: ${element}` }, 404);
  });

  app.openapi(getMonstersByAilmentRoute, async (c) => {
    const { ailment } = c.req.valid("param");
    const result = await db.select().from(monsters).where(sql`EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(${monsters.ailments}) as elem
      WHERE LOWER(elem::text) = LOWER(${ailment})
    )`);

    return result.length > 0
      ? c.json(result, 200)
      : c.json({ message: `No monsters found with ailment: ${ailment}` }, 404);
  });

  app.openapi(getMonstersByWeaknessRoute, async (c) => {
    const { weakness } = c.req.valid("param");
    const result = await db.select().from(monsters).where(sql`EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(${monsters.weakness}) as elem
      WHERE LOWER(elem::text) = LOWER(${weakness})
    )`);

    return result.length > 0
      ? c.json(result, 200)
      : c.json(
          { message: `No monsters found with weakness: ${weakness}` },
          404
        );
  });

  app.openapi(getMonsterIconRoute, async (c) => {
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
  });
};
