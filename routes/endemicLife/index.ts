import { OpenAPIHono } from "@hono/zod-openapi";

import { AppBindings } from "../../lib/create-app.ts";
import {
  getEndemicLifeByNameRoute,
  getFilteredEndemicLifeRoute,
  getPaginatedEndemicLifeRoute,
} from "./routes.ts";
import {
  getEndemicLifeByName,
  getFilteredEndemicLife,
  getPaginatedEndemicLife,
} from "./handlers.ts";

export const setupEndemicLifeRoutes = (app: OpenAPIHono<AppBindings>) => {
  app.openapi(getFilteredEndemicLifeRoute, getFilteredEndemicLife);
  app.openapi(getEndemicLifeByNameRoute, getEndemicLifeByName);
  app.openapi(getPaginatedEndemicLifeRoute, getPaginatedEndemicLife);
};
