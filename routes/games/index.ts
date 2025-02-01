import { OpenAPIHono } from "@hono/zod-openapi";

import { AppBindings } from "../../lib/create-app.ts";
import { getGameContent } from "./handlers.ts";
import { getGameContentRoute } from "./routes.ts";

export const setupGamesRoutes = (app: OpenAPIHono<AppBindings>) => {
  app.openapi(getGameContentRoute, getGameContent);
};
