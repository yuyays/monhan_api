import { assertEquals } from "jsr:@std/assert";
import { Monster, MonsterSchema } from "../../type.ts";
import { app } from "../../app.ts";

// Deno.test("GET / - Welcome message", async () => {
//   const res = await app.request("/");
//   assertEquals(res.status, 200);
//   assertEquals(await res.text(), "Welcome to Monster Hunter API");
// });

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

Deno.test("Monsters pagination endpoint", async (t) => {
  await t.step("default pagination (limit=20, offset=0)", async () => {
    const res = await app.request("/api/monsters");
    const data = await res.json();

    assertEquals(res.status, 200);
    assertEquals(data.results.length, 20);
    assertEquals(data.previous, null);
    assertEquals(data.next, "/api/monsters?limit=20&offset=20");
  });

  await t.step("custom limit", async () => {
    const res = await app.request("/api/monsters?limit=5");
    const data = await res.json();

    assertEquals(res.status, 200);
    assertEquals(data.results.length, 5);
    assertEquals(data.previous, null);
    assertEquals(data.next, "/api/monsters?limit=5&offset=5");
  });

  await t.step("custom offset", async () => {
    const res = await app.request("/api/monsters?offset=5");
    const data = await res.json();

    assertEquals(res.status, 200);
    assertEquals(data.results.length, 20);
    assertEquals(data.previous, "/api/monsters?limit=20&offset=0");
    assertEquals(data.next, "/api/monsters?limit=20&offset=25");
  });

  await t.step("both limit and offset", async () => {
    const res = await app.request("/api/monsters?limit=10&offset=20");
    const data = await res.json();

    assertEquals(res.status, 200);
    assertEquals(data.results.length, 10);
    assertEquals(data.previous, "/api/monsters?limit=10&offset=10");
    assertEquals(data.next, "/api/monsters?limit=10&offset=30");
  });

  await t.step("offset beyond total count", async () => {
    const res = await app.request("/api/monsters?offset=1000");
    const data = await res.json();

    assertEquals(res.status, 200);
    assertEquals(data.results.length, 0);
    assertEquals(data.next, null);
  });
});
