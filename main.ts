import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { Monster } from "./type.ts";

const app = new Hono();

// Serve static files
app.use("/static/*", serveStatic({ root: "./" }));
// Load monster data
const monsterData = JSON.parse(
  await Deno.readTextFile("./static/monster-hunter-DB/monsters.json")
);

// API routes
app.get("/", (c) => c.text("Welcome to Monster Hunter API"));

app.get("/api/monsters", (c) => c.json(monsterData.monsters));

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

app.get("/api/monsters/:name/icon", (c) => {
  const name = c.req.param("name");
  const monster: Monster = monsterData.monsters.find(
    (m: Monster) => m.name.toLowerCase() === name.toLowerCase()
  );
  console.log(monster, monster.games, monster.games[0].image);

  if (monster && monster.games && monster.games[0].image) {
    const iconPath = `/static/monster-hunter-DB/icons/${monster.games[0].image}`;
    console.log("Icon path:", iconPath);
    return c.redirect(iconPath);
  }
  console.log("Monster or image not found for:", name);
  return c.notFound();
});

Deno.serve(app.fetch);
