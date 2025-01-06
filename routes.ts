import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { MonsterSchema } from "./type.ts";

export const getMonsterRoute = createRoute({
  method: "get",
  path: "/api/monsters/{name}",
  request: {
    params: z.object({
      name: z.string().openapi({
        param: {
          name: "name",
          in: "path",
        },
        example: "Arzuros",
      }),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: MonsterSchema,
        },
      },
      description: "Monster details",
    },
    404: {
      description: "Monster not found",
    },
  },
});

export const getPaginatedMonstersRoute = createRoute({
  method: "get",
  path: "/api/monsters",
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
            results: z.array(MonsterSchema),
          }),
        },
      },
      description: "List of monsters with pagination",
    },
  },
});
