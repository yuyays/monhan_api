//import app from "./openapi.ts";

import app from "./routes/monsters/main.ts";

Deno.serve(app.fetch);
