import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { PinoLogger } from "npm:hono-pino";
//import { serveStatic } from "hono/deno";
// import { cache } from "hono/cache";
// import { cors } from "hono/cors";
import { getMonsterRoute, getPaginatedMonstersRoute } from "../../routes.ts";
import { monsterData } from "./main.ts";
import { Monster } from "../../type.ts";
import { pino_Logger } from "../../middlewares/pino_logger.ts";

type AppBindings = {
  Variables: {
    logger: PinoLogger;
  };
};
const app = new OpenAPIHono<AppBindings>();
app.use(pino_Logger());
// app.get(
//   "*",
//   cache({
//     cacheName: "monhan_api",
//     cacheControl: "max-age=3600",
//     wait: true,
//   })
// );
// app.use("*", cors());
// // Serve static files
//app.use("/static/*", serveStatic({ root: "./" }));

app.openapi(getMonsterRoute, (c) => {
  const name = c.req.param("name");
  const monster = monsterData.monsters.find(
    (m: Monster) => m.name.toLowerCase() === name.toLowerCase()
  );
  if (monster) {
    return c.json(monster);
  }
  return c.notFound();
});

app.openapi(getPaginatedMonstersRoute, (c) => {
  const limit = parseInt(c.req.query("limit") || "20");
  const offset = parseInt(c.req.query("offset") || "0");

  const paginatedMonsters = monsterData.monsters.slice(offset, offset + limit);
  const totalMonsters = monsterData.monsters.length;

  return c.json({
    count: totalMonsters,
    next:
      offset + limit < totalMonsters
        ? `/api/monsters?limit=${limit}&offset=${offset + limit}`
        : null,
    previous:
      offset > 0
        ? `/api/monsters?limit=${limit}&offset=${Math.max(0, offset - limit)}`
        : null,
    results: paginatedMonsters,
  });
});

app.doc("/api/docs", {
  openapi: "3.0.0",
  info: {
    title: "Monster Hunter API",
    version: "0.0.1",
    description: "API for accessing Monster Hunter monster data",
  },
  servers: [
    {
      url: "https://monhan-api.deno.dev",
      description: "Production server",
    },
  ],
});

app.get(
  "/ui",
  swaggerUI({
    url: "/doc",
  })
);

app.doc("/doc", {
  info: {
    title: "An API",
    version: "v0.01",
  },
  openapi: "3.1.0",
});

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

export default app;
