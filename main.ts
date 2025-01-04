import { app } from "./app.ts";
import { setupRoutes } from "./route.ts";
import { Monster } from "./type.ts";

export type MonsterData = {
  monsters: Monster[];
};
const monsterData: MonsterData = JSON.parse(
  await Deno.readTextFile("./static/monster-hunter-DB-master/monsters.json")
);
setupRoutes(app, monsterData);

export default app;
