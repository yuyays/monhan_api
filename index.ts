import app from "./routes/monsters/handlers.ts";

//import app from "./routes/monsters/main.ts";

Deno.serve(app.fetch);
