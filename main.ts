import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { logger } from "hono/logger";
import { Monster } from "./type.ts";

export const app = new Hono();
app.use("*", logger());

// Serve static files
app.use("/static/*", serveStatic({ root: "./" }));
// Load monster data
const monsterData = JSON.parse(
  await Deno.readTextFile("./static/monster-hunter-DB-master/monsters.json")
);

app.get("/", (c) => c.text("Welcome to Monster Hunter API"));

app.get("/api/monsters/:name", (c) => {
  const name = c.req.param("name");
  const monster = monsterData.monsters.find(
    (m: Monster) => m.name.toLowerCase() === name.toLowerCase()
  );
  if (monster) {
    return c.json(monster);
  }
  return c.notFound();
});

// 1. List all monster types
app.get("/api/types", (c) => {
  const types = [...new Set(monsterData.monsters.map((m: Monster) => m.type))];
  return c.json(types);
});

// 2. Get monsters by type
app.get("/api/monsters/type/:type", (c) => {
  const type = c.req.param("type");
  const monsters = monsterData.monsters.filter(
    (m: Monster) => m.type.toLowerCase() === type.toLowerCase()
  );
  if (monsters.length === 0) {
    return c.json({ message: `No monsters found with type: ${type}` }, 404);
  }
  return c.json(monsters);
});

// 3. Get monsters by element
app.get("/api/monsters/element/:element", (c) => {
  const element = c.req.param("element");
  const monsters = monsterData.monsters.filter(
    (m: Monster) =>
      m.elements &&
      m.elements.some((e: string) => e.toLowerCase() === element.toLowerCase())
  );
  if (monsters.length === 0) {
    return c.json(
      { message: `No monsters found with element: ${element}` },
      404
    );
  }
  return c.json(monsters);
});

// 4. Get monsters by ailment
app.get("/api/monsters/ailment/:ailment", (c) => {
  const ailment = c.req.param("ailment");
  const monsters = monsterData.monsters.filter(
    (m: Monster) =>
      m.ailments &&
      m.ailments.some((a: string) => a.toLowerCase() === ailment.toLowerCase())
  );
  if (monsters.length === 0) {
    return c.json(
      { message: `No monsters found with ailment: ${ailment}` },
      404
    );
  }
  return c.json(monsters);
});

// 5. Get monsters by weakness
app.get("/api/monsters/weakness/:weakness", (c) => {
  const weakness = c.req.param("weakness");
  const monsters = monsterData.monsters.filter(
    (m: Monster) =>
      m.weakness &&
      m.weakness.some((w: string) => w.toLowerCase() === weakness.toLowerCase())
  );
  if (monsters.length === 0) {
    return c.json(
      { message: `No monsters found with weakness: ${weakness}` },
      404
    );
  }
  return c.json(monsters);
});

// 6. Pagination for the monster list
app.get("/api/monsters", (c) => {
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

// global error handler
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

// global custom error for not found
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
