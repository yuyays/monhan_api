//import app from "./openapi.ts";
import app from "./main.ts";

Deno.serve(app.fetch);
