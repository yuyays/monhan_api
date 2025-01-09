import createApp from "./lib/create-app.ts";
import { endemicLifeData, monsterData } from "./lib/query.ts";
import { setupEndemicLifeRoutes } from "./routes/endemicLife/handlers.ts";
import { setupMonsterRoutes } from "./routes/monsters/handlers.ts";

const app = createApp();
setupMonsterRoutes(app, monsterData);
setupEndemicLifeRoutes(app, endemicLifeData);

export { app };
