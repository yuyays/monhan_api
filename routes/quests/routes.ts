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

export const getFilteredQuestsRoute = createRoute({
  method: "get",
  path: "/api/quests/filter",
  request: {
    query: z.object({
      game: z
        .string()
        .optional()
        .openapi({
          param: {
            name: "game",
            in: "query",
          },
          example: "Monster Hunter Rise",
          description: "Filter by game title",
        }),
      questType: z
        .string()
        .optional()
        .openapi({
          param: {
            name: "questType",
            in: "query",
          },
          example: "Hub",
          description: "Filter by quest type (Hub/Village)",
        }),
      difficulty: z
        .string()
        .optional()
        .openapi({
          param: {
            name: "difficulty",
            in: "query",
          },
          example: "MR2",
          description: "Filter by difficulty level",
        }),
      isKey: z
        .string()
        .optional()
        .openapi({
          param: {
            name: "isKey",
            in: "query",
          },
          example: "true",
          description: "Filter by key quest status (true/false)",
        }),
      targets: z
        .string()
        .optional()
        .openapi({
          param: {
            name: "targets",
            in: "query",
          },
          example: "Great Izuchi,Great Baggi",
          description: "Filter by target monsters (comma-separated)",
        }),
      targets_operator: z
        .enum(["and", "or"])
        .optional()
        .openapi({
          param: {
            name: "targets_operator",
            in: "query",
          },
          example: "or",
          description: "Operator for targets filter (and/or)",
        }),
      map: z
        .string()
        .optional()
        .openapi({
          param: {
            name: "map",
            in: "query",
          },
          example: "Arena",
          description: "Filter by quest location",
        }),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(QuestSchema),
        },
      },
      description: "Filtered list of quests",
    },
  },
});
