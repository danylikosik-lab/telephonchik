import type { Server, Socket } from "socket.io";
import { RoomManager } from "../../core/RoomManager.js";
import { GameEngine } from "../../core/GameEngine.js";

export function registerGameHandlers(
  io: Server,
  socket: Socket,
  roomManager: RoomManager,
): void {
  const engine = new GameEngine(io, roomManager);

  socket.on("game:start", (payload: { roomCode: string }, callback: (res: { ok: boolean }) => void) => {
    const room = roomManager.getRoom(payload.roomCode);
    if (!room) {
      callback({ ok: false });
      return;
    }
    if (room.hostId !== socket.id) {
      callback({ ok: false });
      return;
    }

    if (room.modeId === "normal") {
      engine.startNormal(room.code);
      callback({ ok: true });
    } else if (room.modeId === "story") {
      engine.startStory(room.code);
      callback({ ok: true });
    } else if (room.modeId === "animation") {
      engine.startAnimation(room.code);
      callback({ ok: true });
    } else {
      callback({ ok: false });
    }
  });

  socket.on(
    "game:submitStep",
    (payload: { roomCode: string; content: string }, callback: (res: { ok: boolean }) => void) => {
      const room = roomManager.getRoom(payload.roomCode);
      if (!room) {
        callback({ ok: false });
        return;
      }
      if (room.modeId === "normal") {
        engine.submitNormalStep(room.code, socket.id, payload.content);
        callback({ ok: true });
      } else if (room.modeId === "story") {
        engine.submitStoryStep(room.code, socket.id, payload.content);
        callback({ ok: true });
      } else if (room.modeId === "animation") {
        engine.submitAnimationStep(room.code, socket.id, payload.content);
        callback({ ok: true });
      } else {
        callback({ ok: false });
      }
    },
  );
}

