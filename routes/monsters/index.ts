import { OpenAPIHono } from "@hono/zod-openapi";

import { AppBindings } from "../../lib/create-app.ts";
import {
  getMonsterTypesRoute,
  getPaginatedMonstersRoute,
  getFilteredMonstersRoute,
  getMonsterRoute,
  getMonstersByTypeRoute,
  getMonstersByAilmentRoute,
  getMonstersByElementRoute,
  getMonstersByWeaknessRoute,
  getMonsterIconRoute,
  getMonsterQuestsRoute,
} from "./routes.ts";
import {
  getFilteredMonsters,
  getMonster,
  getMonsterIcon,
  getMonstersByAilment,
  getMonstersByElement,
  getMonstersByType,
  getMonstersByWeakness,
  getMonsterTypes,
  getPaginatedMonsters,
  getMonsterQuests,
} from "./handlers.ts";

export const setupMonstersRoutes = (app: OpenAPIHono<AppBindings>) => {
  app.openapi(getMonsterTypesRoute, getMonsterTypes);
  app.openapi(getFilteredMonstersRoute, getFilteredMonsters);
  app.openapi(getMonsterQuestsRoute, getMonsterQuests);
  app.openapi(getPaginatedMonstersRoute, getPaginatedMonsters);
  app.openapi(getMonsterRoute, getMonster);
  app.openapi(getMonstersByTypeRoute, getMonstersByType);
  app.openapi(getMonstersByElementRoute, getMonstersByElement);
  app.openapi(getMonstersByAilmentRoute, getMonstersByAilment);
  app.openapi(getMonstersByWeaknessRoute, getMonstersByWeakness);
  app.openapi(getMonsterIconRoute, getMonsterIcon);
};
