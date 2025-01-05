import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { cache } from "hono/cache";
import { cors } from "hono/cors";
import { serveStatic } from "hono/deno";
import { rateLimit } from "./ratelimit.ts";

const app = new Hono();

app.use("*", rateLimit(100, 60));
app.use("*", logger());
app.use("*", prettyJSON());
app.get(
  "*",
  cache({
    cacheName: "monhan_api",
    cacheControl: "max-age=3600",
    wait: true,
  })
);
app.use("*", cors());
app.use("/static/*", serveStatic({ root: "./" }));
// Error handlers
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json(
    {
      error: "Internal Server Error",
      message: err.message,
    },
    500
  );
});

app.notFound((c) => {
  return c.json(
    {
      error: "Not Found",
      message: "The requested endpoint does not exist",
      path: c.req.path,
    },
    404
  );
});

export { app };
