import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { PinoLogger } from "npm:hono-pino";
import { serveStatic } from "hono/deno";
// import { cache } from "hono/cache";
// import { cors } from "hono/cors";
import {
  getMonsterIconRoute,
  getMonsterRoute,
  getMonstersByAilmentRoute,
  getMonstersByElementRoute,
  getMonstersByTypeRoute,
  getMonstersByWeaknessRoute,
  getMonsterTypesRoute,
  getPaginatedMonstersRoute,
} from "../../routes.ts";
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
app.use("/static/*", serveStatic({ root: "./" }));

app.openapi(getMonsterTypesRoute, (c) => {
  const types = [...new Set(monsterData.monsters.map((m) => m.type))];
  return c.json(types);
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

app.openapi(getMonstersByTypeRoute, (c) => {
  const { type } = c.req.valid("param");
  const monsters: Monster[] = monsterData.monsters.filter(
    (m: Monster) => m.type.toLowerCase() === type.toLowerCase()
  );

  if (monsters.length === 0) {
    return c.json({ message: `No monsters found with type: ${type}` }, 404);
  }
  return c.json(monsters, 200);
});

// Add these handlers after your route definitions
app.openapi(getMonstersByElementRoute, (c) => {
  const { element } = c.req.valid("param");
  const monsters = monsterData.monsters.filter((m) =>
    m.elements?.some((e) => e.toLowerCase() === element.toLowerCase())
  );
  return monsters.length > 0
    ? c.json(monsters, 200)
    : c.json({ message: `No monsters found with element: ${element}` }, 404);
});

app.openapi(getMonstersByAilmentRoute, (c) => {
  const { ailment } = c.req.valid("param");
  const monsters = monsterData.monsters.filter((m) =>
    m.ailments?.some((a) => a.toLowerCase() === ailment.toLowerCase())
  );
  return monsters.length > 0
    ? c.json(monsters, 200)
    : c.json({ message: `No monsters found with ailment: ${ailment}` }, 404);
});

app.openapi(getMonstersByWeaknessRoute, (c) => {
  const { weakness } = c.req.valid("param");
  const monsters = monsterData.monsters.filter((m) =>
    m.weakness?.some((w) => w.toLowerCase() === weakness.toLowerCase())
  );
  return monsters.length > 0
    ? c.json(monsters, 200)
    : c.json({ message: `No monsters found with weakness: ${weakness}` }, 404);
});

app.openapi(getMonsterIconRoute, (c) => {
  const { name } = c.req.valid("param");
  const monster = monsterData.monsters.find(
    (m) => m.name.toLowerCase() === name.toLowerCase()
  );

  if (monster?.games?.[0]?.image) {
    const iconPath = `/static/monster-hunter-DB-master/icons/${monster.games[0].image}`;
    console.log("Icon path:", iconPath);
    return c.redirect(iconPath);
  }

  console.log("Monster or image not found for:", name);
  return c.json(
    {
      message: `Icon not found for monster: ${name}`,
    },
    404
  );
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
    title: "Monster Hunter API",
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
