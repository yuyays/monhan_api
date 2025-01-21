import { OpenAPIHono } from "@hono/zod-openapi";

import { AppBindings } from "../../lib/create-app.ts";
import { Quest, QuestData } from "../../lib/type.ts";
import {
  getFilteredQuestsRoute,
  getPaginatedQuestsRoute,
  getQuestByIdRoute,
} from "./routes.ts";

export const setupQuestsRoutes = (
  app: OpenAPIHono<AppBindings>,
  questData: QuestData
) => {
  const filterByArrayProperty = (
    quests: Quest[],
    values: string[],
    operator: "and" | "or"
  ) => {
    return quests.filter((quest) => {
      const questTargets = quest.targets.map((t) => t.toLowerCase());

      return operator === "and"
        ? values.every((v) => questTargets.includes(v.toLowerCase()))
        : values.some((v) => questTargets.includes(v.toLowerCase()));
    });
  };

  // Handler
  app.openapi(getFilteredQuestsRoute, (c) => {
    const {
      game,
      questType,
      difficulty,
      isKey,
      targets,
      targets_operator = "or",
      map,
    } = c.req.valid("query");

    let filteredQuests = questData.quests;

    // Filter by exact match properties
    if (game) {
      filteredQuests = filteredQuests.filter(
        (q) => q.game.toLowerCase() === game.toLowerCase()
      );
    }

    if (questType) {
      filteredQuests = filteredQuests.filter(
        (q) => q.questType.toLowerCase() === questType.toLowerCase()
      );
    }

    if (difficulty) {
      filteredQuests = filteredQuests.filter(
        (q) => q.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    if (isKey !== undefined) {
      const isKeyBool = isKey.toLowerCase() === "true";
      filteredQuests = filteredQuests.filter((q) => q.isKey === isKeyBool);
    }

    if (map) {
      filteredQuests = filteredQuests.filter(
        (q) => q.map.toLowerCase() === map.toLowerCase()
      );
    }

    // Filter by targets array
    if (targets) {
      const targetValues = targets.split(",").map((t) => t.trim());
      filteredQuests = filterByArrayProperty(
        filteredQuests,
        targetValues,
        targets_operator
      );
    }

    return c.json(filteredQuests);
  });

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
// Once we set the json data in database and query to db,
// we can write in this way.
// export const setupQuestsRoutes: RouteHandler<
//   typeof getQuestByIdRoute,
//   AppBindings
// > = (c) => {
//   const { id } = c.req.valid("param");
//   const quest = questsData.quests.find((q) => q._id.$oid === id);

//   if (!quest) {
//     return c.json(
//       {
//         message: `Quest not found with id: ${id}`,
//       },
//       404
//     );
//   }

//   return c.json(quest, 200);
// };
