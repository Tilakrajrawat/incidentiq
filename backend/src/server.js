import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initWebSocketServer } from "./websocket/wsServer.js";

const port = process.env.PORT || 4000;

const startServer = async () => {
    try {
        await connectDB();

        const server = http.createServer(app);
        initWebSocketServer(server);

        server.listen(port, () => {
            console.log(`Backend API listening on port ${port} (ENV=${process.env.NODE_ENV})`);
        });
    } catch (error) {
        console.error("Server failed to start due to critical error:", error.message);
        process.exit(1);
    }
}

startServer();
