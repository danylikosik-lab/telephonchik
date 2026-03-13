import express from "express";
import http from "http";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import { registerLobbyHandlers } from "./socket/handlers/lobbyHandlers.js";
import { registerGameHandlers } from "./socket/handlers/gameHandlers.js";
import { RoomManager } from "./core/RoomManager.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const roomManager = new RoomManager();

io.on("connection", (socket) => {
  registerLobbyHandlers(io, socket, roomManager);
  registerGameHandlers(io, socket, roomManager);
});

httpServer.listen(PORT, () => {
  console.log(`[server] Телефончик backend запущен на порту ${PORT}`);
});

