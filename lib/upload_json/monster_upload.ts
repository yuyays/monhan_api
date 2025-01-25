import { db } from "../../db/index.ts";
import { monsters } from "../../db/schema.ts";

interface MonsterJson {
  _id: {
    $oid: string;
  };
  name: string;
  type: string;
  isLarge: boolean;
  elements?: string[];
  ailments?: string[];
  weakness?: string[];
  games: {
    game: string;
    image: string;
    info?: string;
    danger?: string;
  }[];
}

async function uploadMonsters() {
  try {
    console.time("Upload duration");

    const rawData = await Deno.readTextFile(
      "./static/monster-hunter-DB-master/monsters.json"
    );

    const data = JSON.parse(rawData);

    console.log(`Found ${data.monsters.length} monsters to upload`);

    const batchSize = 50;
    for (let i = 0; i < data.monsters.length; i += batchSize) {
      const batch = data.monsters
        .slice(i, i + batchSize)
        .map((monster: MonsterJson) => ({
          monsterId: monster._id.$oid,
          name: monster.name,
          type: monster.type,
          isLarge: monster.isLarge,
          elements: monster.elements,
          ailments: monster.ailments,
          weakness: monster.weakness,
          games: monster.games,
        }));

      await db.insert(monsters).values(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}`);
    }

    console.timeEnd("Upload duration");
    console.log("Upload completed successfully");
  } catch (error) {
    console.error("Error uploading monsters:", error);
  }
}

uploadMonsters();
