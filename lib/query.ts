import { EndemicLifeData, MonsterData } from "./type.ts";

export const monsterData: MonsterData = JSON.parse(
  await Deno.readTextFile("./static/monster-hunter-DB-master/monsters.json")
);
export const endemicLifeData: EndemicLifeData = JSON.parse(
  await Deno.readTextFile("./static/monster-hunter-DB-master/endemicLife.json")
);
