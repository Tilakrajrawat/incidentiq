import { getCosmosClient } from "../shared/cosmosClient.js";

type TimerContext = {
  log: (...args: unknown[]) => void;
};

export default async function (context: TimerContext) {
  context.log("CleanupRecords function started");

  const client = await getCosmosClient();
  const db = client.db(process.env.COSMOS_DB_NAME || "appdb");
  const collectionName = process.env.INCIDENT_COLLECTION || "records";

  const retentionDays = Number(process.env.RETENTION_DAYS || 30);
  const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

  const result = await db.collection(collectionName).deleteMany({
    $or: [
      {
        "metadata.status": { $in: ["CLOSED", "RESOLVED", "Closed", "Resolved"] },
        updatedAt: { $lt: cutoffDate }
      },
      {
        createdAt: { $lt: cutoffDate }
      }
    ]
  });

  context.log(`Deleted ${result.deletedCount} old records`);
}
