import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { QuestSchema } from "../../lib/type.ts";

export const getQuestByIdRoute = createRoute({
  method: "get",
  path: "/api/quests/{id}",
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          name: "id",
          in: "path",
        },
        example: "5313279a31807935cec2e31a",
      }),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: QuestSchema,
        },
      },
      description: "Quest details",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Quest not found",
    },
  },
});

export const getPaginatedQuestsRoute = createRoute({
  method: "get",
  path: "/api/quests",
  request: {
    query: z.object({
      limit: z
        .string()
        .optional()
        .openapi({
          param: {
            name: "limit",
            in: "query",
          },
          example: "20",
        }),
      offset: z
        .string()
        .optional()
        .openapi({
          param: {
            name: "offset",
            in: "query",
          },
          example: "0",
        }),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            count: z.number(),
            next: z.string().nullable(),
            previous: z.string().nullable(),
            results: z.array(QuestSchema),
          }),
        },
      },
      description: "Paginated list of quests",
    },
  },
});
