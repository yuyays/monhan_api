import { assertEquals } from "jsr:@std/assert";

import { createRouter } from "../../lib/create-app.ts";
import { setupQuestsRoutes } from "./handlers.ts";

const mockQuestData = {
  quests: [
    {
      _id: {
        $oid: "5313279a31807935cec2e31a",
      },
      name: "Now That's What I Call Great!",
      client: "Enthusiastic Commentator",
      description: "Welcome to the Arena, folks!",
      map: "Arena",
      isKey: true,
      questType: "Hub",
      game: "Monster Hunter Rise",
      difficulty: "MR2",
      objective: "Hunt all target monsters",
      targets: ["Great Izuchi", "Great Baggi", "Great Wroggi"],
    },
    {
      _id: {
        $oid: "608fc50ddc2d8ce1017b005e",
      },
      name: "Fungal Frustrations",
      client: "Mushroom Restaurant Owner",
      description:
        "I've been dreaming of opening my own restaurant, but I spent so much time experimenting with the menu that I ran out of ingredients! I'll never be able to open if I don't get some more. Think you can help me out?",
      map: "Shrine Ruins",
      isKey: true,
      questType: "Village",
      game: "Monster Hunter Rise",
      difficulty: "1",
      objective: "Deliver 8 Unique Mushrooms",
      targets: [],
    },
  ],
};

Deno.test("Quest Routes", async (t) => {
  const app = createRouter();
  setupQuestsRoutes(app, mockQuestData);

  await t.step("GET /api/quests/{id} - should return quest by id", async () => {
    const res = await app.request("/api/quests/5313279a31807935cec2e31a");
    assertEquals(res.status, 200);
    const data = await res.json();
    assertEquals(data._id.$oid, "5313279a31807935cec2e31a");
    assertEquals(data.name, "Now That's What I Call Great!");
  });

  await t.step(
    "GET /api/quests/{id} - should return 404 for non-existent quest",
    async () => {
      const res = await app.request("/api/quests/nonexistentid");
      assertEquals(res.status, 404);
      const data = await res.json();
      assertEquals(data.message, "Quest not found with id: nonexistentid");
    }
  );

  await t.step(
    "GET /api/quests - should return paginated results",
    async () => {
      const res = await app.request("/api/quests");
      assertEquals(res.status, 200);
      const data = await res.json();
      assertEquals(data.count, 2);
      assertEquals(data.results.length, 2);
      assertEquals(data.next, null);
      assertEquals(data.previous, null);
    }
  );

  await t.step("GET /api/quests with pagination params", async () => {
    const res = await app.request("/api/quests?limit=1&offset=0");
    assertEquals(res.status, 200);
    const data = await res.json();
    assertEquals(data.count, 2);
    assertEquals(data.results.length, 1);
    assertEquals(data.next, "/api/quests?limit=1&offset=1");
    assertEquals(data.previous, null);
    assertEquals(data.results[0]._id.$oid, "5313279a31807935cec2e31a");
  });

  await t.step("GET /api/quests with offset", async () => {
    const res = await app.request("/api/quests?limit=1&offset=1");
    assertEquals(res.status, 200);
    const data = await res.json();
    assertEquals(data.count, 2);
    assertEquals(data.results.length, 1);
    assertEquals(data.next, null);
    assertEquals(data.previous, "/api/quests?limit=1&offset=0");
    assertEquals(data.results[0]._id.$oid, "608fc50ddc2d8ce1017b005e");
  });

  await t.step("GET /api/quests with offset beyond total", async () => {
    const res = await app.request("/api/quests?offset=100");
    assertEquals(res.status, 200);
    const data = await res.json();
    assertEquals(data.count, 2);
    assertEquals(data.results.length, 0);
    assertEquals(data.next, null);
    assertEquals(data.previous, "/api/quests?limit=20&offset=80");
  });
});

Deno.test("Quest Filter Routes", async (t) => {
  const app = createRouter();
  setupQuestsRoutes(app, mockQuestData);

  await t.step(
    "GET /api/quests/filter - should return all quests when no filters",
    async () => {
      const res = await app.request("/api/quests/filter");
      assertEquals(res.status, 200);
      const data = await res.json();
      assertEquals(data.length, 2);
    }
  );

  await t.step(
    "GET /api/quests/filter - should filter by game case-insensitive",
    async () => {
      const res = await app.request(
        "/api/quests/filter?game=monster hunter RISE"
      );
      assertEquals(res.status, 200);
      const data = await res.json();
      assertEquals(data.length, 2);
    }
  );

  await t.step(
    "GET /api/quests/filter - should handle non-existent game",
    async () => {
      const res = await app.request("/api/quests/filter?game=NonExistent");
      assertEquals(res.status, 200);
      const data = await res.json();
      assertEquals(data.length, 0);
    }
  );

  await t.step(
    "GET /api/quests/filter - should filter by questType",
    async () => {
      const res = await app.request("/api/quests/filter?questType=Hub");
      assertEquals(res.status, 200);
      const data = await res.json();
      assertEquals(data.length, 1);
      assertEquals(data[0].name, "Now That's What I Call Great!");
    }
  );

  await t.step("GET /api/quests/filter - should filter by isKey", async () => {
    const res = await app.request("/api/quests/filter?isKey=true");
    assertEquals(res.status, 200);
    const data = await res.json();
    assertEquals(data.length, 2);
  });

  await t.step(
    "GET /api/quests/filter - should handle empty targets array",
    async () => {
      const res = await app.request("/api/quests/filter?targets=Great Izuchi");
      assertEquals(res.status, 200);
      const data = await res.json();
      assertEquals(data.length, 1);
    }
  );

  await t.step(
    "GET /api/quests/filter - should handle AND operation for targets",
    async () => {
      const res = await app.request(
        "/api/quests/filter?targets=Great Izuchi,Great Baggi&targets_operator=and"
      );
      assertEquals(res.status, 200);
      const data = await res.json();
      assertEquals(data.length, 1);
      assertEquals(data[0].name, "Now That's What I Call Great!");
    }
  );

  await t.step(
    "GET /api/quests/filter - should handle OR operation for targets",
    async () => {
      const res = await app.request(
        "/api/quests/filter?targets=Great Izuchi,NonExistent&targets_operator=or"
      );
      assertEquals(res.status, 200);
      const data = await res.json();
      assertEquals(data.length, 1);
    }
  );

  await t.step(
    "GET /api/quests/filter - should combine multiple filters",
    async () => {
      const res = await app.request(
        "/api/quests/filter?questType=Hub&isKey=true&map=Arena"
      );
      assertEquals(res.status, 200);
      const data = await res.json();
      assertEquals(data.length, 1);
      assertEquals(data[0].name, "Now That's What I Call Great!");
    }
  );

  await t.step(
    "GET /api/quests/filter - should handle case where no quests match all filters",
    async () => {
      const res = await app.request(
        "/api/quests/filter?questType=Hub&map=Shrine Ruins"
      );
      assertEquals(res.status, 200);
      const data = await res.json();
      assertEquals(data.length, 0);
    }
  );

  await t.step(
    "GET /api/quests/filter - should handle invalid isKey value",
    async () => {
      const res = await app.request("/api/quests/filter?isKey=invalid");
      assertEquals(res.status, 200);
      const data = await res.json();
      assertEquals(data.length, 0);
    }
  );

  await t.step(
    "GET /api/quests/filter - should handle difficulty filter",
    async () => {
      const res = await app.request("/api/quests/filter?difficulty=MR2");
      assertEquals(res.status, 200);
      const data = await res.json();
      assertEquals(data.length, 1);
      assertEquals(data[0].difficulty, "MR2");
    }
  );
});
