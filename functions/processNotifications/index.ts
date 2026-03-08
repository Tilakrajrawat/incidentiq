import { getCosmosClient } from "../shared/cosmosClient.js";

type TimerContext = {
  log: (...args: unknown[]) => void;
};

export default async function (context: TimerContext) {
  context.log("AutoEscalation function started");

  const client = await getCosmosClient();
  const db = client.db(process.env.COSMOS_DB_NAME || "appdb");
  const collectionName = process.env.INCIDENT_COLLECTION || "records";

  const escalationMinutes = Number(process.env.AUTO_ESCALATION_MINUTES || 15);
  const cutoffDate = new Date(Date.now() - escalationMinutes * 60 * 1000);

  const result = await db.collection(collectionName).updateMany(
    {
      createdAt: { $lt: cutoffDate },
      $or: [
        { "metadata.severity": "CRITICAL", "metadata.status": "OPEN" },
        { "metadata.severity": "Critical", "metadata.status": "Open" }
      ]
    },
    {
      $set: {
        "metadata.status": "IN_PROGRESS",
        "metadata.escalatedAt": new Date(),
        updatedAt: new Date()
      }
    }
  );

  context.log(`Auto-escalated ${result.modifiedCount} records`);
}
