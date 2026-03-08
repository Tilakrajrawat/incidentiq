import { getCosmosClient } from "../shared/cosmosClient.js";
import { broadcast } from "../shared/broadcast.js";

export default async function (context: any) {
  context.log("Auto-escalation function started");

  const client = await getCosmosClient();
  const db = client.db(process.env.COSMOS_DB_NAME || "appdb");

  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  const collection = db.collection("records");
  const toEscalate = await collection
    .find({
      severity: "critical",
      status: "open",
      escalated: { $ne: true },
      createdAt: { $lt: fifteenMinutesAgo }
    })
    .toArray();

  const result = await collection.updateMany(
    {
      severity: "critical",
      status: "open",
      escalated: { $ne: true },
      createdAt: { $lt: fifteenMinutesAgo }
    },
    {
      $set: {
        escalated: true,
        metadata: {
          escalationReason: "Critical incident remained unacknowledged for over 15 minutes",
          escalatedAt: new Date().toISOString()
        }
      }
    }
  );

  await Promise.all(toEscalate.map((incident) => broadcast("incident_escalated", incident)));

  context.log(`Auto-escalated ${result.modifiedCount} critical incidents`);
}
