import { getCosmosClient } from "../shared/cosmosClient.js";

export default async function (context: any) {
  context.log("CleanupRecords function started");

  const client = await getCosmosClient();
  const db = client.db("appdb");

  const retentionDays = Number(process.env.RETENTION_DAYS || 30);
  const cutoffDate = new Date(
    Date.now() - retentionDays * 24 * 60 * 60 * 1000
  );

  const result = await db
    .collection("records")
    .deleteMany({
      status: { $in: ["resolved", "closed"] },
      updatedAt: { $lt: cutoffDate }
    });

  context.log(`Deleted ${result.deletedCount} resolved incidents older than ${retentionDays} days`);
}
