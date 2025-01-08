import { z } from "@hono/zod-openapi";

const GameSchema = z
  .object({
    game: z.string().openapi({
      example: "Monster Hunter Rise",
    }),
    image: z.string().openapi({
      example: "MHRise-Arzuros_Icon.png",
    }),
    info: z.string().optional().openapi({
      example: "Bear-like monsters found in warm, damp environments.",
    }),
    danger: z.string().optional().openapi({
      example: "3",
    }),
  })
  .openapi("Game");

export const MonsterSchema = z
  .object({
    _id: z.object({
      $oid: z.string().openapi({
        example: "5e1570f48a80af35ce52d757",
      }),
    }),
    name: z.string().openapi({
      example: "Arzuros",
    }),
    type: z.string().openapi({
      example: "Fanged Beast",
    }),
    isLarge: z.boolean().openapi({
      example: true,
    }),
    elements: z
      .array(z.string())
      .optional()
      .openapi({
        example: ["Fire", "Thunder"],
      }),
    ailments: z
      .array(z.string())
      .optional()
      .openapi({
        example: ["Fireblight", "Thunderblight"],
      }),
    weakness: z
      .array(z.string())
      .optional()
      .openapi({
        example: ["Fire", "Ice"],
      }),
    games: z.array(GameSchema),
  })
  .openapi("Monster");

export const QuestSchema = z
  .object({
    _id: z.object({
      $oid: z.string().openapi({
        example: "5313279a31807935cec2e31a",
      }),
    }),
    name: z.string().openapi({
      example: "Now That's What I Call Great!",
      description: "Quest name",
    }),
    client: z.string().optional().openapi({
      example: "Enthusiastic Commentator",
      description: "NPC who gives the quest",
    }),
    description: z.string().optional().openapi({
      example:
        "Welcome to the Arena, folks! And boy do we have a show for you tonight!",
      description: "Quest description text",
    }),
    map: z.string().openapi({
      example: "Arena",
      description: "Location where quest takes place",
    }),
    isKey: z.boolean().openapi({
      example: true,
      description: "Whether this is a key quest",
    }),
    questType: z.string().openapi({
      example: "Hub",
      description: "Type of quest (Hub, Village, etc)",
    }),
    game: z.string().openapi({
      example: "Monster Hunter Rise",
      description: "Game where quest appears",
    }),
    difficulty: z.string().openapi({
      example: "MR2",
      description: "Quest difficulty rating",
    }),
    objective: z.string().openapi({
      example: "Hunt all target monsters",
      description: "Main objective of the quest",
    }),
    targets: z.array(z.string()).openapi({
      example: ["Great Izuchi", "Great Baggi", "Great Wroggi"],
      description: "Target monsters to hunt",
    }),
  })
  .openapi("Quest");

export const GameInfoSchema = z
  .object({
    game: z.string().openapi({
      example: "Monster Hunter World",
      description: "Game title",
    }),
    info: z.string().optional().openapi({
      example:
        "Just look at these ginormous ears! Fluffy, AND they can discern precise sounds to avoid danger!",
      description: "Endemic life description",
    }),
    image: z.string().openapi({
      example: "MHW-Shepherd_Hare_Icon.png",
      description: "Icon image filename",
    }),
  })
  .openapi("GameInfo");

export const EndemicLifeSchema = z
  .object({
    name: z.string().openapi({
      example: "Shepherd Hare",
      description: "Endemic life name",
    }),
    game: z.array(GameInfoSchema),
  })
  .openapi("EndemicLife");

export type Game = z.infer<typeof GameSchema>;
export type Monster = z.infer<typeof MonsterSchema>;
export type Quest = z.infer<typeof QuestSchema>;
export type EndemicLife = z.infer<typeof EndemicLifeSchema>;
export type GameInfo = z.infer<typeof GameInfoSchema>;

export type MonsterData = {
  monsters: Monster[];
};

export type EndemicLifeData = {
  endemicLife: EndemicLife[];
};
