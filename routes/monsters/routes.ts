import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { MonsterSchema, QuestSchema } from "../../lib/type.ts";

export const getMonsterRoute = createRoute({
  method: "get",
  path: "/api/monsters/{name}",
  tags: ["Monsters"],
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
  tags: ["Monsters"],
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

export const getMonsterTypesRoute = createRoute({
  method: "get",
  path: "/api/types",
  tags: ["Monsters"],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(z.string()),
        },
      },
      description: "List of all monster types",
    },
  },
});

export const getMonsterIconRoute = createRoute({
  method: "get",
  path: "/api/monsters/{name}/icon",
  tags: ["Monsters"],
  request: {
    params: z.object({
      name: z.string().openapi({
        param: {
          name: "name",
          in: "path",
        },
        example: "Rathalos",
      }),
    }),
  },
  responses: {
    302: {
      description: "Redirect to monster icon",
      headers: {
        Location: {
          schema: {
            type: "string",
          },
        },
      },
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Monster or icon not found",
    },
  },
});

export const getFilteredMonstersRoute = createRoute({
  method: "get",
  path: "/api/monsters/filter",
  tags: ["Monsters"],
  request: {
    query: z.object({
      elements: z
        .string()
        .optional()
        .openapi({
          param: {
            name: "elements",
            in: "query",
          },
          example: "fire,water,thunder",
          description: "Comma-separated list of elements",
        }),
      elements_operator: z
        .enum(["and", "or"])
        .optional()
        .default("or")
        .openapi({
          param: {
            name: "elements_operator",
            in: "query",
          },
          example: "or",
          description: "Operator for elements filter (and/or)",
        }),
      weakness: z
        .string()
        .optional()
        .openapi({
          param: {
            name: "weakness",
            in: "query",
          },
          example: "ice,water",
          description: "Comma-separated list of weaknesses",
        }),
      weakness_operator: z
        .enum(["and", "or"])
        .optional()
        .default("or")
        .openapi({
          param: {
            name: "weakness_operator",
            in: "query",
          },
          example: "and",
          description: "Operator for weakness filter (and/or)",
        }),
      ailments: z
        .string()
        .optional()
        .openapi({
          param: {
            name: "ailments",
            in: "query",
          },
          example: "Thunderblight, Paralysis",
          description: "Comma-separated list of ailments",
        }),
      ailments_operator: z
        .enum(["and", "or"])
        .optional()
        .default("or")
        .openapi({
          param: {
            name: "ailments_operator",
            in: "query",
          },
          example: "or",
          description: "Operator for ailments filter (and/or)",
        }),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(MonsterSchema),
        },
      },
      description: "Filtered list of monsters",
    },
  },
});

export const getMonsterQuestsRoute = createRoute({
  method: "get",
  path: "/api/monsters/{id}/quests",
  tags: ["Monsters"],
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
          schema: z.object({
            monster: MonsterSchema,
            quests: z.array(QuestSchema),
          }),
        },
      },
      description: "Quests featuring the specified monster",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Monster not found",
    },
  },
});

export const getSimilarMonstersRoute = createRoute({
  method: "get",
  path: "/api/monsters/{id}/similar",
  tags: ["Monsters"],
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          name: "id",
          in: "path",
        },
        example: "5313279a31807935cec2e31a",
        description: "Monster ID to find similar monsters for",
      }),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            source: MonsterSchema,
            similarByElements: z.array(MonsterSchema),
            similarByWeakness: z.array(MonsterSchema),
          }),
        },
      },
      description: "Similar monsters by elements and weaknesses",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Monster not found",
    },
  },
});
