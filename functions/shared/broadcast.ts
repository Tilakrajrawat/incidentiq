export async function broadcast(event: string, data: unknown): Promise<void> {
  const endpoint = process.env.REALTIME_BROADCAST_URL;

  if (!endpoint) {
    return;
  }

  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-realtime-key": process.env.REALTIME_EVENT_KEY || ""
      },
      body: JSON.stringify({ event, data })
    });
  } catch {
    // best-effort event forwarding
  }
}
