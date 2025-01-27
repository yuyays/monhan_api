import { OpenAPIHono } from "@hono/zod-openapi";

import { AppBindings } from "../../lib/create-app.ts";
import {
  getfilterdQuests,
  getPaginatedQuests,
  getQuestById,
} from "./handlers.ts";
import {
  getFilteredQuestsRoute,
  getPaginatedQuestsRoute,
  getQuestByIdRoute,
} from "./routes.ts";

export const setupQuestRoutes = (app: OpenAPIHono<AppBindings>) => {
  app.openapi(getFilteredQuestsRoute, getfilterdQuests);
  app.openapi(getQuestByIdRoute, getQuestById);
  app.openapi(getPaginatedQuestsRoute, getPaginatedQuests);
};
