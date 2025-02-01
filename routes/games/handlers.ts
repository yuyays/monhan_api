import { RouteConfig, RouteHandler } from "@hono/zod-openapi";
import { sql } from "drizzle-orm";

import { AppBindings } from "../../lib/create-app.ts";
import { db } from "../../db/index.ts";
import { endemicLife, monsters, quests } from "../../db/schema.ts";
import { getGameContentRoute } from "./routes.ts";

type GameRouteHandler<T extends RouteConfig> = RouteHandler<T, AppBindings>;

export const getGameContent: GameRouteHandler<
  typeof getGameContentRoute
> = async (c) => {
  const { gameName } = c.req.valid("param");

  const gameMonsters = await db
    .select()
    .from(monsters)
    .where(
      sql`EXISTS (
          SELECT 1 FROM jsonb_array_elements(${monsters.games}) g
          WHERE g->>'game' = ${gameName}
        )`
    );

  const gameQuests = await db
    .select()
    .from(quests)
    .where(sql`LOWER(${quests.game}) = LOWER(${gameName})`);

  const gameEndemicLife = await db
    .select()
    .from(endemicLife)
    .where(
      sql`EXISTS (
          SELECT 1 FROM jsonb_array_elements(${endemicLife.game}) g
          WHERE g->>'game' = ${gameName}
        )`
    );

  if (
    gameMonsters.length === 0 &&
    gameQuests.length === 0 &&
    gameEndemicLife.length === 0
  ) {
    return c.json(
      {
        message: `No content found for game: ${gameName}`,
      },
      404
    );
  }

  return c.json(
    {
      monsters: gameMonsters,
      quests: gameQuests,
      endemicLife: gameEndemicLife,
    },
    200
  );
};
