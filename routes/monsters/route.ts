import { Hono } from "hono";
import type { Monster, MonsterData } from "../../lib/type.ts";

//this is pure Hono instace for route. checkout routes.ts for OpenAPIHono use.
export const setupRoutes = (app: Hono, monsterData: MonsterData) => {
  app
    .get("/", (c) => c.text("Welcome to Monster Hunter API"))
    .get("/api/monsters/:name", (c) => {
      const name = c.req.param("name");
      const monster = monsterData.monsters.find(
        (m: Monster) => m.name.toLowerCase() === name.toLowerCase()
      );
      return monster ? c.json(monster) : c.notFound();
    })

    .get("/api/types", (c) => {
      const types = [
        ...new Set(monsterData.monsters.map((m: Monster) => m.type)),
      ];
      return c.json(types);
    })

    .get("/api/monsters/type/:type", (c) => {
      const type = c.req.param("type");
      const monsters = monsterData.monsters.filter(
        (m: Monster) => m.type.toLowerCase() === type.toLowerCase()
      );
      return monsters.length > 0
        ? c.json(monsters)
        : c.json({ message: `No monsters found with type: ${type}` }, 404);
    })

    .get("/api/monsters/element/:element", (c) => {
      const element = c.req.param("element");
      const monsters = monsterData.monsters.filter((m: Monster) =>
        m.elements?.some((e) => e.toLowerCase() === element.toLowerCase())
      );
      return monsters.length > 0
        ? c.json(monsters)
        : c.json(
            { message: `No monsters found with element: ${element}` },
            404
          );
    })

    .get("/api/monsters/ailment/:ailment", (c) => {
      const ailment = c.req.param("ailment");
      const monsters = monsterData.monsters.filter((m: Monster) =>
        m.ailments?.some((a) => a.toLowerCase() === ailment.toLowerCase())
      );
      return monsters.length > 0
        ? c.json(monsters)
        : c.json(
            { message: `No monsters found with ailment: ${ailment}` },
            404
          );
    })

    .get("/api/monsters/weakness/:weakness", (c) => {
      const weakness = c.req.param("weakness");
      const monsters = monsterData.monsters.filter((m: Monster) =>
        m.weakness?.some((w) => w.toLowerCase() === weakness.toLowerCase())
      );
      return monsters.length > 0
        ? c.json(monsters)
        : c.json(
            { message: `No monsters found with weakness: ${weakness}` },
            404
          );
    })

    .get("/api/monsters", (c) => {
      const limit = parseInt(c.req.query("limit") || "20");
      const offset = parseInt(c.req.query("offset") || "0");
      const paginatedMonsters = monsterData.monsters.slice(
        offset,
        offset + limit
      );
      const totalMonsters = monsterData.monsters.length;

      return c.json({
        count: totalMonsters,
        next:
          offset + limit < totalMonsters
            ? `/api/monsters?limit=${limit}&offset=${offset + limit}`
            : null,
        previous:
          offset > 0
            ? `/api/monsters?limit=${limit}&offset=${Math.max(
                0,
                offset - limit
              )}`
            : null,
        results: paginatedMonsters,
      });
    })
    .get("/api/monsters/:name/icon", (c) => {
      const name = c.req.param("name");
      const monster = monsterData.monsters.find(
        (m: Monster) => m.name.toLowerCase() === name.toLowerCase()
      );
      if (monster && monster.games && monster.games[0].image) {
        const iconPath = `/static/monster-hunter-DB-master/icons/${monster.games[0].image}`;
        console.log("Icon path:", iconPath);
        return c.redirect(iconPath);
      }
      console.log("Monster or image not found for:", name);
      return c.notFound();
    });
};
