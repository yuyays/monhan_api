import { OpenAPIHono } from "@hono/zod-openapi";

import { AppBindings } from "../../lib/create-app.ts";
import { QuestData } from "../../lib/type.ts";
import { getPaginatedQuestsRoute, getQuestByIdRoute } from "./routes.ts";

export const setupQuestsRoutes = (
  app: OpenAPIHono<AppBindings>,
  questData: QuestData
) => {
  app.openapi(getQuestByIdRoute, (c) => {
    const { id } = c.req.valid("param");
    const quest = questData.quests.find((q) => q._id.$oid === id);

    if (!quest) {
      return c.json(
        {
          message: `Quest not found with id: ${id}`,
        },
        404
      );
    }

    return c.json(quest, 200);
  });

  app.openapi(getPaginatedQuestsRoute, (c) => {
    const { limit: limitStr, offset: offsetStr } = c.req.valid("query");
    const limit = parseInt(limitStr || "20");
    const offset = parseInt(offsetStr || "0");

    const paginatedQuests = questData.quests.slice(offset, offset + limit);
    const totalQuests = questData.quests.length;

    return c.json({
      count: totalQuests,
      next:
        offset + limit < totalQuests
          ? `/api/quests?limit=${limit}&offset=${offset + limit}`
          : null,
      previous:
        offset > 0
          ? `/api/quests?limit=${limit}&offset=${Math.max(0, offset - limit)}`
          : null,
      results: paginatedQuests,
    });
  });
};
