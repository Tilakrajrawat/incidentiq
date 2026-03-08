import { useEffect, useState } from "react";
import { subscribeConnection, unsubscribeConnection } from "../lib/websocket";

export default function WebSocketIndicator() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    subscribeConnection(setConnected);
    return () => unsubscribeConnection(setConnected);
  }, []);

  return (
    <div className="ws-indicator" title={connected ? "Realtime connected" : "Realtime disconnected"}>
      <span className={`ws-dot ${connected ? "ws-online" : "ws-offline"}`} />
      <small>{connected ? "Realtime connected" : "Realtime disconnected"}</small>
    </div>
  );
}
