import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";

import {
  MonsterSchema,
  QuestSchema,
  EndemicLifeSchema,
} from "../../lib/type.ts";

export const getGameContentRoute = createRoute({
  method: "get",
  path: "/api/games/{gameName}/content",
  tags: ["Games"],
  request: {
    params: z.object({
      gameName: z.string().openapi({
        param: {
          name: "gameName",
          in: "path",
        },
        example: "Monster Hunter Rise",
        description: "Game title to fetch content for",
      }),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            monsters: z.array(MonsterSchema),
            quests: z.array(QuestSchema),
            endemicLife: z.array(EndemicLifeSchema),
          }),
        },
      },
      description: "All content for the specified game",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Game not found",
    },
  },
});
