import createApp from "./lib/create-app.ts";
import { setupEndemicLifeRoutes } from "./routes/endemicLife/index.ts";
import { setupGamesRoutes } from "./routes/games/index.ts";
import { setupMonstersRoutes } from "./routes/monsters/index.ts";
import { setupQuestRoutes } from "./routes/quests/index.ts";

const app = createApp();
setupMonstersRoutes(app);
setupEndemicLifeRoutes(app);
setupQuestRoutes(app);
setupGamesRoutes(app);
export { app };
