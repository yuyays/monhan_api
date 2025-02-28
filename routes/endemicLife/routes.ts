import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { EndemicLifeSchema } from "../../lib/type.ts";

export const getEndemicLifeByNameRoute = createRoute({
  method: "get",
  path: "/api/endemic-life/{name}",
  tags: ["Endemic Life"],
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
  tags: ["Endemic Life"],
  request: {
    query: z.object({
      limit: z.string().optional(),
      offset: z.string().optional(),
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
            results: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                game: z.array(
                  z.object({
                    game: z.string(),
                    info: z.string(),
                    image: z.string(),
                  })
                ),
              })
            ),
          }),
        },
      },
      description: "List of endemic life",
    },
  },
});

export const getFilteredEndemicLifeRoute = createRoute({
  method: "get",
  path: "/api/endemic-life/filter",
  tags: ["Endemic Life"],
  request: {
    query: z.object({
      name: z.string().optional(),
      game_name: z.string().optional(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              game: z.array(
                z.object({
                  game: z.string(),
                  info: z.string(),
                  image: z.string(),
                })
              ),
            })
          ),
        },
      },
      description: "Filtered list of endemic life",
    },
  },
});
