import { OpenAPIHono } from "@hono/zod-openapi";

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
import { Monster, MonsterData } from "../../lib/type.ts";
import { AppBindings } from "../../lib/create-app.ts";
import { db } from "../../db/index.ts";
import { sql } from "drizzle-orm";
import { monsters } from "../../db/schema.ts";

export const setupMonsterRoutes = (
  app: OpenAPIHono<AppBindings>,
  monsterData: MonsterData
) => {
  app.openapi(getMonsterTypesRoute, (c) => {
    const types = [...new Set(monsterData.monsters.map((m) => m.type))];
    return c.json(types);
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

  app.openapi(getFilteredMonstersRoute, (c) => {
    const filterByArrayProperty = (
      monsters: Monster[],
      values: string[],
      operator: "and" | "or",
      propertyName: keyof Pick<Monster, "elements" | "ailments" | "weakness">
    ) => {
      console.log(`Filtering ${propertyName}:`);
      console.log(`Operation: ${operator.toUpperCase()}`);
      console.log(`Values to match: ${values.join(", ")}`);

      return monsters.filter((monster) => {
        const monsterValues =
          monster[propertyName]?.map((v) => v.toLowerCase()) ?? [];

        const result =
          operator === "and"
            ? values.every((v) => monsterValues.includes(v))
            : values.some((v) => monsterValues.includes(v));

        return result;
      });
    };

    const {
      elements,
      elements_operator = "or",
      weakness,
      weakness_operator = "or",
      ailments,
      ailments_operator = "or",
    } = c.req.valid("query");

    let filteredMonsters = monsterData.monsters;

    // Apply filters if parameters are provided
    if (elements) {
      const elementValues = elements
        .split(",")
        .map((e) => e.trim().toLowerCase());
      filteredMonsters = filterByArrayProperty(
        filteredMonsters,
        elementValues,
        elements_operator,
        "elements"
      );
    }

    if (weakness) {
      const weaknessValues = weakness
        .split(",")
        .map((w) => w.trim().toLowerCase());
      filteredMonsters = filterByArrayProperty(
        filteredMonsters,
        weaknessValues,
        weakness_operator,
        "weakness"
      );
    }

    if (ailments) {
      const ailmentValues = ailments
        .split(",")
        .map((a) => a.trim().toLowerCase());
      filteredMonsters = filterByArrayProperty(
        filteredMonsters,
        ailmentValues,
        ailments_operator,
        "ailments"
      );
    }

    return c.json(filteredMonsters);
  });

  app.openapi(getMonsterRoute, (c) => {
    const name = c.req.param("name");
    const monster = monsterData.monsters.find(
      (m: Monster) => m.name.toLowerCase() === name.toLowerCase()
    );
    if (monster) {
      return c.json(monster);
    }
    return c.notFound();
  });

  app.openapi(getMonstersByTypeRoute, (c) => {
    const { type } = c.req.valid("param");
    const monsters: Monster[] = monsterData.monsters.filter(
      (m: Monster) => m.type.toLowerCase() === type.toLowerCase()
    );

    if (monsters.length === 0) {
      return c.json({ message: `No monsters found with type: ${type}` }, 404);
    }
    return c.json(monsters, 200);
  });

  // Add these handlers after your route definitions
  app.openapi(getMonstersByElementRoute, (c) => {
    const { element } = c.req.valid("param");
    const monsters = monsterData.monsters.filter((m) =>
      m.elements?.some((e) => e.toLowerCase() === element.toLowerCase())
    );
    return monsters.length > 0
      ? c.json(monsters, 200)
      : c.json({ message: `No monsters found with element: ${element}` }, 404);
  });

  app.openapi(getMonstersByAilmentRoute, (c) => {
    const { ailment } = c.req.valid("param");
    const monsters = monsterData.monsters.filter((m) =>
      m.ailments?.some((a) => a.toLowerCase() === ailment.toLowerCase())
    );
    return monsters.length > 0
      ? c.json(monsters, 200)
      : c.json({ message: `No monsters found with ailment: ${ailment}` }, 404);
  });

  app.openapi(getMonstersByWeaknessRoute, (c) => {
    const { weakness } = c.req.valid("param");
    const monsters = monsterData.monsters.filter((m) =>
      m.weakness?.some((w) => w.toLowerCase() === weakness.toLowerCase())
    );
    return monsters.length > 0
      ? c.json(monsters, 200)
      : c.json(
          { message: `No monsters found with weakness: ${weakness}` },
          404
        );
  });

  app.openapi(getMonsterIconRoute, (c) => {
    const { name } = c.req.valid("param");
    const monster = monsterData.monsters.find(
      (m) => m.name.toLowerCase() === name.toLowerCase()
    );

    if (monster?.games?.[0]?.image) {
      const iconPath = `/static/monster-hunter-DB-master/icons/${monster.games[0].image}`;
      console.log("Icon path:", iconPath);
      return c.redirect(iconPath);
    }

    console.log("Monster or image not found for:", name);
    return c.json(
      {
        message: `Icon not found for monster: ${name}`,
      },
      404
    );
  });
};
