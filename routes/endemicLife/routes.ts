import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { EndemicLifeSchema } from "../../type.ts";

export const getEndemicLifeByNameRoute = createRoute({
  method: "get",
  path: "/api/endemic-life/{name}",
  request: {
    params: z.object({
      name: z.string().openapi({
        param: {
          name: "name",
          in: "path",
        },
        example: "Shepherd Hare",
      }),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: EndemicLifeSchema,
        },
      },
      description: "Endemic life details",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Endemic life not found",
    },
  },
});

export const getPaginatedEndemicLifeRoute = createRoute({
  method: "get",
  path: "/api/endemic-life",
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
            results: z.array(EndemicLifeSchema),
          }),
        },
      },
      description: "Paginated list of endemic life",
    },
  },
});
