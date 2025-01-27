import { RouteConfig, RouteHandler } from "@hono/zod-openapi";
import { sql, and, SQL, ilike, eq, or } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

import { AppBindings } from "../../lib/create-app.ts";
import { db } from "../../db/index.ts";
import { quests } from "../../db/schema.ts";
import {
  getFilteredQuestsRoute,
  getPaginatedQuestsRoute,
  getQuestByIdRoute,
} from "./routes.ts";

type QuestRouteHandler<T extends RouteConfig> = RouteHandler<T, AppBindings>;

export const getQuestById: QuestRouteHandler<typeof getQuestByIdRoute> = async (
  c
) => {
  const { id } = c.req.valid("param");

  const quest = await db
    .select()
    .from(quests)
    .where(eq(quests.quest_id, id))
    .limit(1);

  if (quest.length === 0) {
    return c.json(
      {
        message: `Quest not found with id: ${id}`,
      },
      404
    );
  }
  return c.json(quest[0], 200);
};

export const getfilterdQuests: QuestRouteHandler<
  typeof getFilteredQuestsRoute
> = async (c) => {
  const createTargetsFilter = (
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
    game,
    questType,
    difficulty,
    isKey,
    targets,
    targets_operator = "or",
    map,
  } = c.req.valid("query");

  const baseQuery = db.select().from(quests);
  const conditions: SQL[] = [];

  if (game) {
    conditions.push(sql`LOWER(${quests.game}) = LOWER(${game})`);
  }

  if (questType) {
    conditions.push(sql`LOWER(${quests.questType}) = LOWER(${questType})`);
  }

  if (difficulty) {
    conditions.push(sql`LOWER(${quests.difficulty}) = LOWER(${difficulty})`);
  }

  if (isKey !== undefined) {
    conditions.push(sql`${quests.isKey} = ${isKey.toLowerCase() === "true"}`);
  }

  if (map) {
    conditions.push(sql`LOWER(${quests.map}) = LOWER(${map})`);
  }

  if (targets) {
    const targetValues = targets.split(",").map((t) => t.trim());
    conditions.push(
      createTargetsFilter(quests.targets, targetValues, targets_operator)
    );
  }

  const filteredQuests =
    conditions.length > 0
      ? await baseQuery.where(and(...conditions))
      : await baseQuery.execute();

  return c.json(filteredQuests, 200);
};

export const getPaginatedQuests: QuestRouteHandler<
  typeof getPaginatedQuestsRoute
> = async (c) => {
  const { limit: limitStr, offset: offsetStr } = c.req.valid("query");
  const limit = parseInt(limitStr || "20");
  const offset = parseInt(offsetStr || "0");

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(quests);

  const paginatedQuests = await db
    .select()
    .from(quests)
    .limit(limit)
    .offset(offset);

  return c.json({
    count,
    next:
      offset + limit < count
        ? `/api/quests?limit=${limit}&offset=${offset + limit}`
        : null,
    previous:
      offset > 0
        ? `/api/quests?limit=${limit}&offset=${Math.max(0, offset - limit)}`
        : null,
    results: paginatedQuests,
  });
};
