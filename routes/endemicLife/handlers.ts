import { OpenAPIHono } from "@hono/zod-openapi";

import {
  getEndemicLifeByNameRoute,
  getPaginatedEndemicLifeRoute,
} from "./routes.ts";
import { EndemicLife, EndemicLifeData } from "../../lib/type.ts";
import { AppBindings } from "../../lib/create-app.ts";

export const endemicLifeData: EndemicLifeData = JSON.parse(
  await Deno.readTextFile("./static/monster-hunter-DB-master/endemicLife.json")
);

export const setupEndemicLifeRoutes = (
  app: OpenAPIHono<AppBindings>,
  endemicLifeData: EndemicLifeData
) => {
  app
    .openapi(getEndemicLifeByNameRoute, (c) => {
      const { name } = c.req.valid("param");
      const endemicLife = endemicLifeData.endemicLife.find(
        (e: EndemicLife) => e.name.toLowerCase() === name.toLowerCase()
      );

      if (!endemicLife) {
        return c.json(
          {
            message: `Endemic life not found: ${name}`,
          },
          404
        );
      }

      return c.json(endemicLife, 200);
    })

    .openapi(getPaginatedEndemicLifeRoute, (c) => {
      const { limit: limitStr, offset: offsetStr } = c.req.valid("query");
      const limit = parseInt(limitStr || "20");
      const offset = parseInt(offsetStr || "0");

      const paginatedEndemicLife = endemicLifeData.endemicLife.slice(
        offset,
        offset + limit
      );
      const totalEndemicLife = endemicLifeData.endemicLife.length;

      return c.json({
        count: totalEndemicLife,
        next:
          offset + limit < totalEndemicLife
            ? `/api/endemic-life?limit=${limit}&offset=${offset + limit}`
            : null,
        previous:
          offset > 0
            ? `/api/endemic-life?limit=${limit}&offset=${Math.max(
                0,
                offset - limit
              )}`
            : null,
        results: paginatedEndemicLife,
      });
    });
};
