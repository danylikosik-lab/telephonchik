import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import { registerLobbyHandlers } from "./socket/handlers/lobbyHandlers.js";
import { registerGameHandlers } from "./socket/handlers/gameHandlers.js";
import { RoomManager } from "./core/RoomManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Раздача собранного фронта (для Railway и продакшена)
const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/socket.io")) return next();
  res.sendFile(path.join(clientDist, "index.html"));
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

