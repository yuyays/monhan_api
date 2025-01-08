import createApp from "./lib/create-app.ts";
import {
  endemicLifeData,
  setupEndemicLifeRoutes,
} from "./routes/endemicLife/handlers.ts";
import { monsterData, setupMonsterRoutes } from "./routes/monsters/handlers.ts";

const app = createApp();
setupMonsterRoutes(app, monsterData);
setupEndemicLifeRoutes(app, endemicLifeData);

export { app };
