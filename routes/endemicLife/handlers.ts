import { RouteConfig, RouteHandler } from "@hono/zod-openapi";
import { sql, and, ilike } from "drizzle-orm";

import {
  getEndemicLifeByNameRoute,
  getFilteredEndemicLifeRoute,
  getPaginatedEndemicLifeRoute,
} from "./routes.ts";
import { AppBindings } from "../../lib/create-app.ts";
import { db } from "../../db/index.ts";
import { endemicLife } from "../../db/schema.ts";

type Endemic_LifeRouteHandler<T extends RouteConfig> = RouteHandler<
  T,
  AppBindings
>;

export const getFilteredEndemicLife: Endemic_LifeRouteHandler<
  typeof getFilteredEndemicLifeRoute
> = async (c) => {
  const { name, game_name } = c.req.valid("query");

  const conditions = [];

  if (name) {
    conditions.push(ilike(endemicLife.name, `%${name}%`));
  }

  if (game_name) {
    conditions.push(
      sql`EXISTS (
      SELECT 1 FROM jsonb_array_elements(${endemicLife.game}) as g
      WHERE LOWER(g->>'game') LIKE LOWER(${`%${game_name}%`})
    )`
    );
  }

  const filteredEndemicLife = await db
    .select({
      id: endemicLife.id,
      name: endemicLife.name,
      game: endemicLife.game,
    })
    .from(endemicLife)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  return c.json(filteredEndemicLife);
};

export const getEndemicLifeByName: Endemic_LifeRouteHandler<
  typeof getEndemicLifeByNameRoute
> = async (c) => {
  const { name } = c.req.valid("param");

  const result = await db
    .select({
      id: endemicLife.id,
      name: endemicLife.name,
      game: endemicLife.game,
    })
    .from(endemicLife)
    .where(sql`LOWER(${endemicLife.name}) = LOWER(${name})`)
    .limit(1);

  if (result.length === 0) {
    return c.json(
      {
        message: `Endemic life not found: ${name}`,
      },
      404
    );
  }

  return c.json(result[0], 200);
};

export const getPaginatedEndemicLife: Endemic_LifeRouteHandler<
  typeof getPaginatedEndemicLifeRoute
> = async (c) => {
  const { limit: limitStr, offset: offsetStr } = c.req.valid("query");
  const limit = parseInt(limitStr || "20");
  const offset = parseInt(offsetStr || "0");

  const [{ count }, paginatedEndemicLife] = await Promise.all([
    db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(endemicLife)
      .then((res) => res[0]),
    db
      .select({
        id: endemicLife.id,
        name: endemicLife.name,
        game: endemicLife.game,
      })
      .from(endemicLife)
      .limit(limit)
      .offset(offset),
  ]);

  return c.json({
    count,
    next:
      offset + limit < count
        ? `/api/endemic-life?limit=${limit}&offset=${offset + limit}`
        : null,
    previous:
      offset > 0
        ? `/api/endemic-life?limit=${limit}&offset=${Math.max(
            0,
            offset - limit
          )}`
        : null,
    results: paginatedEndemicLife,
  });
};
