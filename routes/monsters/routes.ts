import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { MonsterSchema, QuestSchema } from "../../lib/type.ts";

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

export const getMonsterTypesRoute = createRoute({
  method: "get",
  path: "/api/types",
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

export const getMonstersByTypeRoute = createRoute({
  method: "get",
  path: "/api/monsters/type/{type}",
  request: {
    params: z.object({
      type: z.string().openapi({
        param: {
          name: "type",
          in: "path",
        },
        example: "Flying Wyvern",
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
      description: "Monsters of specified type",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "No monsters found with specified type",
    },
  },
});

export const getMonstersByElementRoute = createRoute({
  method: "get",
  path: "/api/monsters/element/{element}",
  request: {
    params: z.object({
      element: z.string().openapi({
        param: {
          name: "element",
          in: "path",
        },
        example: "Fire",
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
      description: "Monsters with specified element",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "No monsters found with specified element",
    },
  },
});

export const getMonstersByAilmentRoute = createRoute({
  method: "get",
  path: "/api/monsters/ailment/{ailment}",
  request: {
    params: z.object({
      ailment: z.string().openapi({
        param: {
          name: "ailment",
          in: "path",
        },
        example: "Fireblight",
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
      description: "Monsters with specified ailment",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "No monsters found with specified ailment",
    },
  },
});

export const getMonstersByWeaknessRoute = createRoute({
  method: "get",
  path: "/api/monsters/weakness/{weakness}",
  request: {
    params: z.object({
      weakness: z.string().openapi({
        param: {
          name: "weakness",
          in: "path",
        },
        example: "Fire",
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
      description: "Monsters with specified weakness",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "No monsters found with specified weakness",
    },
  },
});

export const getMonsterIconRoute = createRoute({
  method: "get",
  path: "/api/monsters/{name}/icon",
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
