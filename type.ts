import { z } from "zod";

const GameSchema = z.object({
  game: z.string(),
  image: z.string(),
  info: z.string().optional(),
  danger: z.string().optional(),
});

export const MonsterSchema = z.object({
  _id: z.object({
    $oid: z.string(),
  }),
  name: z.string(),
  type: z.string(),
  isLarge: z.boolean(),
  elements: z.array(z.string()).optional(),
  ailments: z.array(z.string()).optional(),
  weakness: z.array(z.string()).optional(),
  games: z.array(GameSchema),
});

export type Game = z.infer<typeof GameSchema>;
export type Monster = z.infer<typeof MonsterSchema>;
