import { db } from "../../db/index.ts";
import { quests } from "../../db/schema.ts";

interface QuestJson {
  _id: {
    $oid: string;
  };
  name: string;
  client?: string;
  description?: string;
  map: string;
  isKey: boolean;
  questType: string;
  game: string;
  difficulty: string;
  objective: string;
  targets: string[];
}

async function uploadQuests() {
  try {
    console.time("Upload duration");

    const rawData = await Deno.readTextFile(
      "./static/monster-hunter-DB-master/quests.json"
    );

    const data = JSON.parse(rawData);

    console.log(`Found ${data.quests.length} quests to upload`);

    const batchSize = 50;
    for (let i = 0; i < data.quests.length; i += batchSize) {
      const batch = data.quests
        .slice(i, i + batchSize)
        .map((quest: QuestJson) => ({
          quest_id: quest._id.$oid,
          name: quest.name,
          client: quest.client ?? "", // Handle optional fields with nullish coalescing
          description: quest.description ?? "",
          map: quest.map,
          isKey: quest.isKey,
          questType: quest.questType,
          game: quest.game,
          difficulty: quest.difficulty,
          objective: quest.objective,
          targets: quest.targets,
        }));

      await db.insert(quests).values(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}`);
    }

    console.timeEnd("Upload duration");
    console.log("Upload completed successfully");
  } catch (error) {
    console.error("Error uploading quests:", error);
  }
}

uploadQuests();
