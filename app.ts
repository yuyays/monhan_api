import createApp from "./lib/create-app.ts";
import { setupEndemicLifeRoutes } from "./routes/endemicLife/index.ts";
import { setupMonsterRoutes } from "./routes/monsters/handlers.ts";
import { setupQuestRoutes } from "./routes/quests/index.ts";

const app = createApp();
setupMonsterRoutes(app);
setupEndemicLifeRoutes(app);
setupQuestRoutes(app);
export { app };
