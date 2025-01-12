import { assertEquals } from "jsr:@std/assert";
import { createRouter } from "../../lib/create-app.ts";
import { setupEndemicLifeRoutes } from "./handlers.ts";

const mockEndemicLifeData = {
  endemicLife: [
    {
      name: "Shepherd Hare",
      game: [
        {
          game: "Monster Hunter World",
          info: "Test info",
          image: "test-image.png",
        },
      ],
    },
    {
      name: "Pilot Hare",
      game: [
        {
          game: "Monster Hunter World",
          info: "Ooh, this is a rare one! It's warm to the touch, like a little ball of sunshine! I bet this little guy just LOVES picnics!",
          image: "MHW-Pilot_Hare_Icon.png",
        },
      ],
    },
  ],
};

Deno.test("Endemic Life Routes", async (t) => {
  const app = createRouter();
  setupEndemicLifeRoutes(app, mockEndemicLifeData);

  await t.step(
    "GET /api/endemic-life/{name} - should return endemic life by name",
    async () => {
      const res = await app.request("/api/endemic-life/Shepherd Hare");
      assertEquals(res.status, 200);
      const data = await res.json();
      assertEquals(data.name, "Shepherd Hare");
    }
  );

  await t.step(
    "GET /api/endemic-life/{name} - should return 404 for non-existent endemic life",
    async () => {
      const res = await app.request("/api/endemic-life/NonExistent");
      assertEquals(res.status, 404);
      const data = await res.json();
      assertEquals(data.message, "Endemic life not found: NonExistent");
    }
  );

  await t.step(
    "GET /api/endemic-life - should return paginated results",
    async () => {
      const res = await app.request("/api/endemic-life");
      assertEquals(res.status, 200);
      const data = await res.json();
      assertEquals(data.count, 2);
      assertEquals(data.results.length, 2);
      assertEquals(data.next, null);
      assertEquals(data.previous, null);
    }
  );

  await t.step("GET /api/endemic-life with pagination params", async () => {
    const res = await app.request("/api/endemic-life?limit=1&offset=0");
    assertEquals(res.status, 200);
    const data = await res.json();
    assertEquals(data.count, 2);
    assertEquals(data.results.length, 1);
    assertEquals(data.next, "/api/endemic-life?limit=1&offset=1");
    assertEquals(data.previous, null);
  });

  await t.step("GET /api/endemic-life with offset", async () => {
    const res = await app.request("/api/endemic-life?limit=1&offset=1");
    assertEquals(res.status, 200);
    const data = await res.json();
    assertEquals(data.count, 2);
    assertEquals(data.results.length, 1);
    assertEquals(data.next, null);
    assertEquals(data.previous, "/api/endemic-life?limit=1&offset=0");
  });
});
