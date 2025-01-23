import createApp from "./lib/create-app.ts";
import { monsterData, questsData } from "./lib/query.ts";
import { setupEndemicLifeRoutes } from "./routes/endemicLife/handlers.ts";
import { setupMonsterRoutes } from "./routes/monsters/handlers.ts";
import { setupQuestsRoutes } from "./routes/quests/handlers.ts";

const app = createApp();
setupMonsterRoutes(app, monsterData);
setupEndemicLifeRoutes(app);
setupQuestsRoutes(app, questsData);
export { app };
