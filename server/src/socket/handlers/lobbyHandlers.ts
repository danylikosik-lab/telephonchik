import type { Server, Socket } from "socket.io";
import type { GameModeId, ModeSettingsMap, Room } from "../../types/game.js";
import { clampCommonSettings } from "../../config/gameModes.js";
import { RoomManager } from "../../core/RoomManager.js";

interface ClientProfilePayload {
  nickname: string;
  avatarColor: string;
}

interface CreateRoomPayload extends ClientProfilePayload {
  modeId: GameModeId;
  settings?: Partial<ModeSettingsMap[GameModeId]>;
}

interface JoinRoomPayload extends ClientProfilePayload {
  roomCode: string;
}

interface UpdateSettingsPayload<TMode extends GameModeId = GameModeId> {
  roomCode: string;
  modeId: TMode;
  settings: Partial<ModeSettingsMap[TMode]>;
}

export function registerLobbyHandlers(
  io: Server,
  socket: Socket,
  roomManager: RoomManager,
): void {
  socket.on("lobby:createRoom", (payload: CreateRoomPayload, callback: (room: Room | { error: string }) => void) => {
    try {
      const { nickname, avatarColor, modeId, settings } = payload;
      if (!nickname || !avatarColor) {
        callback({ error: "INVALID_PROFILE" });
        return;
      }
      const room = roomManager.createRoom(socket.id, modeId, { nickname, avatarColor }, settings);
      socket.join(room.code);
      io.to(room.code).emit("lobby:roomUpdated", room);
      callback(room);
    } catch (err) {
      console.error("[lobby:createRoom] error", err);
      callback({ error: "INTERNAL" });
    }
  });

  socket.on("lobby:getRoom", (payload: { roomCode: string }, callback: (room: Room | { error: string }) => void) => {
    try {
      const room = roomManager.getRoom(payload.roomCode);
      if (!room) {
        callback({ error: "ROOM_NOT_FOUND" });
        return;
      }
      callback(room);
    } catch (err) {
      console.error("[lobby:getRoom] error", err);
      callback({ error: "INTERNAL" });
    }
  });

  socket.on("lobby:joinRoom", (payload: JoinRoomPayload, callback: (room: Room | { error: string }) => void) => {
    try {
      const { nickname, avatarColor, roomCode } = payload;
      const room = roomManager.joinRoom(roomCode, socket.id, { nickname, avatarColor });
      if (!room) {
        callback({ error: "ROOM_NOT_FOUND" });
        return;
      }
      socket.join(room.code);
      io.to(room.code).emit("lobby:roomUpdated", room);
      callback(room);
    } catch (err) {
      console.error("[lobby:joinRoom] error", err);
      callback({ error: "INTERNAL" });
    }
  });

  socket.on(
    "lobby:updateSettings",
    (payload: UpdateSettingsPayload, callback: (room: Room | { error: string }) => void) => {
      try {
        const { roomCode, settings } = payload;
        const updated = roomManager.updateRoomSettings(roomCode, (room) => {
          const merged: any = {
            ...room.settings,
            ...settings,
          };
          const withCommon = clampCommonSettings(merged);
          room.settings = withCommon;
        });
        if (!updated) {
          callback({ error: "ROOM_NOT_FOUND" });
          return;
        }
        io.to(updated.code).emit("lobby:roomUpdated", updated);
        callback(updated);
      } catch (err) {
        console.error("[lobby:updateSettings] error", err);
        callback({ error: "INTERNAL" });
      }
    },
  );

  socket.on("disconnect", () => {
    roomManager.leaveRoom(socket.id);
  });
}

