import { db } from "../../db/index.ts";
import { endemicLife } from "../../db/schema.ts";

interface EndemicLifeJson {
  name: string;
  game: {
    game: string;
    info: string;
    image: string;
  }[];
}

async function uploadEndemicLife() {
  try {
    console.time("Upload duration");

    const rawData = await Deno.readTextFile(
      "./static/monster-hunter-DB-master/endemicLife.json"
    );

    const data = JSON.parse(rawData);

    if (!data.endemicLife || !Array.isArray(data.endemicLife)) {
      throw new Error("Invalid data structure: expected endemicLife array");
    }

    console.log(`Found ${data.endemicLife.length} endemic life to upload`);

    const batchSize = 50;
    for (let i = 0; i < data.endemicLife.length; i += batchSize) {
      const batch = data.endemicLife
        .slice(i, i + batchSize)
        .map((endemic: EndemicLifeJson) => ({
          name: endemic.name,
          game: endemic.game,
        }));

      await db.insert(endemicLife).values(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}`);
    }

    console.timeEnd("Upload duration");
    console.log("Upload completed successfully");
  } catch (error) {
    console.error("Error uploading endemic life:", error);
  }
}

uploadEndemicLife();
