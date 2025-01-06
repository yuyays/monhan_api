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

export type Game = z.infer<typeof GameSchema>;
export type Monster = z.infer<typeof MonsterSchema>;
