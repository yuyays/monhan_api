import { EndemicLifeData, MonsterData, QuestData } from "./type.ts";

export const monsterData: MonsterData = JSON.parse(
  await Deno.readTextFile("./static/monster-hunter-DB-master/monsters.json")
);
export const endemicLifeData: EndemicLifeData = JSON.parse(
  await Deno.readTextFile("./static/monster-hunter-DB-master/endemicLife.json")
);
export const questsData: QuestData = JSON.parse(
  await Deno.readTextFile("./static/monster-hunter-DB-master/quests.json")
);
