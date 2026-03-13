import { getDefaultSettingsForMode } from "../config/gameModes.js";
import type { GameModeId, ModeSettingsMap, Player, Room } from "../types/game.js";
import { generateRoomCode } from "../utils/codeGenerator.js";

export class RoomManager {
  private rooms = new Map<string, Room>();

  createRoom(
    hostSocketId: string,
    modeId: GameModeId,
    hostProfile: Omit<Player, "id" | "isHost">,
    settingsOverride?: Partial<ModeSettingsMap[GameModeId]>,
  ): Room {
    const code = this.generateUniqueCode();
    const host: Player = {
      id: hostSocketId,
      nickname: hostProfile.nickname,
      avatarColor: hostProfile.avatarColor,
      isHost: true,
    };
    const settings = { ...getDefaultSettingsForMode(modeId), ...(settingsOverride ?? {}) } as ModeSettingsMap[GameModeId];

    const room: Room = {
      code,
      modeId,
      settings,
      players: [host],
      hostId: host.id,
      phase: "lobby",
    };

    this.rooms.set(code, room);
    return room;
  }

  getRoom(code: string): Room | undefined {
    return this.rooms.get(code.toUpperCase());
  }

  joinRoom(code: string, playerSocketId: string, profile: Omit<Player, "id" | "isHost">): Room | null {
    const room = this.getRoom(code);
    if (!room) return null;
    if (room.players.some((p) => p.id === playerSocketId)) {
      return room;
    }
    const player: Player = {
      id: playerSocketId,
      nickname: profile.nickname,
      avatarColor: profile.avatarColor,
      isHost: false,
    };
    room.players.push(player);
    return room;
  }

  leaveRoom(socketId: string): void {
    for (const room of this.rooms.values()) {
      const index = room.players.findIndex((p) => p.id === socketId);
      if (index !== -1) {
        room.players.splice(index, 1);
        if (room.players.length === 0) {
          this.rooms.delete(room.code);
          return;
        }
        if (room.hostId === socketId) {
          const newHost = room.players[0];
          newHost.isHost = true;
          room.hostId = newHost.id;
        }
        return;
      }
    }
  }

  updateRoomSettings(code: string, updater: (room: Room) => void): Room | null {
    const room = this.getRoom(code);
    if (!room) return null;
    updater(room);
    return room;
  }

  private generateUniqueCode(): string {
    let code = generateRoomCode();
    while (this.rooms.has(code)) {
      code = generateRoomCode();
    }
    return code;
  }
}

