import { assertEquals } from "jsr:@std/assert";
import { Monster, MonsterSchema } from "./type.ts";
import { app } from "./main.ts";

Deno.test("GET / - Welcome message", async () => {
  const res = await app.request("/");
  assertEquals(res.status, 200);
  assertEquals(await res.text(), "Welcome to Monster Hunter API");
});

Deno.test("GET /api/monsters/:name - Get monster by name", async () => {
  const res = await app.request("/api/monsters/Rathalos");
  assertEquals(res.status, 200);
  const monster = await res.json();
  MonsterSchema.parse(monster); // Validate the response against your Zod schema
  assertEquals(monster.name, "Rathalos");
});

Deno.test("GET /api/types - List all monster types", async () => {
  const res = await app.request("/api/types");
  assertEquals(res.status, 200);
  const types = await res.json();
  assertEquals(Array.isArray(types), true);
});

Deno.test("GET /api/monsters/type/:type - Get monsters by type", async () => {
  const res = await app.request("/api/monsters/type/Flying Wyvern");
  assertEquals(res.status, 200);
  const monsters = await res.json();
  assertEquals(Array.isArray(monsters), true);
  monsters.forEach((monster: Monster) => MonsterSchema.parse(monster));
});

Deno.test(
  "GET /api/monsters/element/:element - Get monsters by element",
  async () => {
    const res = await app.request("/api/monsters/element/Fire");
    assertEquals(res.status, 200);
    const monsters = await res.json();
    assertEquals(Array.isArray(monsters), true);
    monsters.forEach((monster: Monster) => MonsterSchema.parse(monster));
  }
);

Deno.test(
  "GET /api/monsters/ailment/:ailment - Get monsters by ailment",
  async () => {
    const res = await app.request("/api/monsters/ailment/Poison");
    assertEquals(res.status, 200);
    const monsters = await res.json();
    assertEquals(Array.isArray(monsters), true);
    monsters.forEach((monster: Monster) => MonsterSchema.parse(monster));
  }
);

Deno.test(
  "GET /api/monsters/weakness/:weakness - Get monsters by weakness",
  async () => {
    const res = await app.request("/api/monsters/weakness/Dragon");
    assertEquals(res.status, 200);
    const monsters = await res.json();
    assertEquals(Array.isArray(monsters), true);
    monsters.forEach((monster: Monster) => MonsterSchema.parse(monster));
  }
);

Deno.test("GET /api/monsters - Pagination", async () => {
  const res = await app.request("/api/monsters?page=1&limit=10");
  assertEquals(res.status, 200);
  const data = await res.json();
  assertEquals(data.monsters.length, 10);
  assertEquals(typeof data.currentPage, "number");
  assertEquals(typeof data.totalPages, "number");
  assertEquals(typeof data.totalMonsters, "number");
});

Deno.test("GET /api/search/monsters - Search monsters by name", async () => {
  const res = await app.request("/api/search/monsters?name=Rath");
  assertEquals(res.status, 200);
  const monsters = await res.json();
  assertEquals(Array.isArray(monsters), true);
  monsters.forEach((monster: Monster) => {
    MonsterSchema.parse(monster);
    assertEquals(monster.name.toLowerCase().includes("rath"), true);
  });
});
