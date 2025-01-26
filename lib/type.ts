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
    id: z.number().openapi({
      example: 1,
      description: "Database ID",
    }),
    monsterId: z.string().openapi({
      example: "5e1570f48a80af35ce52d757",
      description: "Original Monster ID",
    }),
    name: z.string().openapi({
      example: "Arzuros",
      description: "Monster name",
    }),
    type: z.string().openapi({
      example: "Fanged Beast",
      description: "Monster type",
    }),
    isLarge: z.boolean().nullable().openapi({
      example: true,
      description: "Whether the monster is large",
    }),
    elements: z
      .array(z.string())
      .nullable()
      .openapi({
        example: ["Fire", "Thunder"],
        description: "Monster's elements",
      }),
    ailments: z
      .array(z.string())
      .nullable()
      .openapi({
        example: ["Fireblight", "Thunderblight"],
        description: "Ailments caused by monster",
      }),
    weakness: z
      .array(z.string())
      .nullable()
      .openapi({
        example: ["Fire", "Ice"],
        description: "Monster's weaknesses",
      }),
    games: z
      .array(
        z.object({
          game: z.string(),
          image: z.string(),
          info: z.string().optional(),
          danger: z.string().optional(),
        })
      )
      .openapi({
        example: [
          {
            game: "Monster Hunter Rise",
            image: "MHRise-Arzuros_Icon.png",
            info: "A bear-like monster...",
            danger: "1",
          },
        ],
      }),
  })
  .openapi("Monster");

export const QuestSchema = z
  .object({
    id: z.number().optional(),
    quest_id: z.string().openapi({
      example: "5313279a31807935cec2e31a",
      description: "Original MongoDB ObjectId",
    }),
    name: z.string().openapi({
      example: "Now That's What I Call Great!",
      description: "Quest name",
    }),
    client: z.string().openapi({
      example: "Enthusiastic Commentator",
      description: "NPC who gives the quest",
    }),
    description: z.string().openapi({
      example:
        "Welcome to the Arena, folks! And boy do we have a show for you tonight!",
      description: "Quest description text",
    }),
    map: z.string().openapi({
      example: "Arena",
      description: "Location where quest takes place",
    }),
    isKey: z.boolean().nullable().openapi({
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
    targets: z
      .array(z.string())
      .nullable()
      .openapi({
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

export type QuestData = {
  quests: Quest[];
};
