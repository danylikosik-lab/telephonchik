import type { Server, Socket } from "socket.io";
import type { Room, Player } from "../types/game.js";
import { RoomManager } from "./RoomManager.js";

export type GamePhase = "idle" | "collect_prompts" | "draw" | "guess" | "results";

interface NormalTurn {
  fromPlayerId: string;
  toPlayerId: string;
  step: "prompt" | "draw" | "guess";
  payload?: string;
}

interface RoomGameState {
  phase: GamePhase;
  mode: Room["modeId"];
  round: number;
  turns: NormalTurn[];
  timerEndsAt: number | null;
}

export class GameEngine {
  private io: Server;
  private roomManager: RoomManager;
  private state = new Map<string, RoomGameState>();

  constructor(io: Server, roomManager: RoomManager) {
    this.io = io;
    this.roomManager = roomManager;
  }

  startStory(roomCode: string): void {
    const room = this.roomManager.getRoom(roomCode);
    if (!room) return;
    const players = room.players;
    if (players.length < 3) return;

    const now = Date.now();
    const turns: NormalTurn[] = players.map((p, index) => {
      const to = players[(index + 1) % players.length]!;
      return {
        fromPlayerId: p.id,
        toPlayerId: to.id,
        step: "prompt",
      };
    });

    const game: RoomGameState = {
      phase: "collect_prompts",
      mode: room.modeId,
      round: 1,
      turns,
      timerEndsAt: now + room.settings.turnTimeSeconds * 1000,
    };

    this.state.set(room.code, game);
    room.phase = "in_game";
    this.broadcastGameState(room);
  }

  submitStoryStep(roomCode: string, playerId: string, payload: string): void {
    const room = this.roomManager.getRoom(roomCode);
    const game = room ? this.state.get(room.code) : undefined;
    if (!room || !game) return;

    const turn = game.turns.find((t) => t.fromPlayerId === playerId && !t.payload);
    if (!turn) return;
    turn.payload = payload;

    if (game.turns.every((t) => t.payload)) {
      game.phase = "results";
      game.timerEndsAt = null;
      room.phase = "results";
      this.broadcastGameState(room);
    } else {
      this.broadcastGameState(room);
    }
  }

  startAnimation(roomCode: string): void {
    const room = this.roomManager.getRoom(roomCode);
    if (!room) return;
    const players = room.players;
    if (players.length < 1) return;

    const now = Date.now();
    const turns: NormalTurn[] = players.map((p) => ({
      fromPlayerId: p.id,
      toPlayerId: p.id,
      step: "draw",
    }));

    const game: RoomGameState = {
      phase: "draw",
      mode: room.modeId,
      round: 1,
      turns,
      timerEndsAt: now + room.settings.turnTimeSeconds * 1000,
    };

    this.state.set(room.code, game);
    room.phase = "in_game";
    this.broadcastGameState(room);
  }

  submitAnimationStep(roomCode: string, playerId: string, payload: string): void {
    const room = this.roomManager.getRoom(roomCode);
    const game = room ? this.state.get(room.code) : undefined;
    if (!room || !game) return;

    const turn = game.turns.find((t) => t.fromPlayerId === playerId && !t.payload);
    if (!turn) return;
    turn.payload = payload;

    if (game.turns.every((t) => t.payload)) {
      const framesPerPlayer =
        typeof (room.settings as any).framesPerPlayer === "number"
          ? (room.settings as any).framesPerPlayer
          : 1;
      if (game.round < framesPerPlayer) {
        game.round += 1;
        game.turns = game.turns.map((t) => ({
          ...t,
          payload: undefined,
        }));
        game.timerEndsAt = Date.now() + room.settings.turnTimeSeconds * 1000;
      } else {
        game.phase = "results";
        game.timerEndsAt = null;
        room.phase = "results";
      }
      this.broadcastGameState(room);
    } else {
      this.broadcastGameState(room);
    }
  }

  startNormal(roomCode: string): void {
    const room = this.roomManager.getRoom(roomCode);
    if (!room) return;
    const players = room.players;
    if (players.length < 3) return;

    const now = Date.now();
    const turns: NormalTurn[] = players.map((p, index) => {
      const to = players[(index + 1) % players.length]!;
      return {
        fromPlayerId: p.id,
        toPlayerId: to.id,
        step: "prompt",
      };
    });

    const game: RoomGameState = {
      phase: "collect_prompts",
      mode: room.modeId,
      round: 1,
      turns,
      timerEndsAt: now + room.settings.turnTimeSeconds * 1000,
    };

    this.state.set(room.code, game);
    room.phase = "in_game";

    this.broadcastGameState(room);
  }

  submitNormalStep(roomCode: string, playerId: string, payload: string): void {
    const room = this.roomManager.getRoom(roomCode);
    const game = room ? this.state.get(room.code) : undefined;
    if (!room || !game) return;

    const turn = game.turns.find((t) => t.fromPlayerId === playerId && !t.payload);
    if (!turn) return;
    turn.payload = payload;

    if (game.turns.every((t) => t.payload)) {
      this.advanceNormal(room, game);
    } else {
      this.broadcastGameState(room);
    }
  }

  private advanceNormal(room: Room, game: RoomGameState): void {
    const players = room.players;
    if (game.phase === "collect_prompts") {
      game.phase = "draw";
      game.turns = this.rotateTurns(game.turns, players, "draw");
    } else if (game.phase === "draw") {
      game.phase = "guess";
      game.turns = this.rotateTurns(game.turns, players, "guess");
    } else if (game.phase === "guess") {
      game.phase = "results";
      room.phase = "results";
    }

    if (game.phase !== "results") {
      game.timerEndsAt = Date.now() + room.settings.turnTimeSeconds * 1000;
    } else {
      game.timerEndsAt = null;
    }

    this.broadcastGameState(room);
  }

  private rotateTurns(turns: NormalTurn[], players: Player[], nextStep: NormalTurn["step"]): NormalTurn[] {
    return turns.map((t) => {
      const from = players.find((p) => p.id === t.toPlayerId) ?? players[0]!;
      const toIndex = (players.findIndex((p) => p.id === from.id) + 1) % players.length;
      const to = players[toIndex]!;
      return {
        fromPlayerId: from.id,
        toPlayerId: to.id,
        step: nextStep,
      };
    });
  }

  getState(roomCode: string): RoomGameState | undefined {
    return this.state.get(roomCode);
  }

  private broadcastGameState(room: Room): void {
    const game = this.state.get(room.code);
    this.io.to(room.code).emit("game:state", {
      room,
      game,
    });
  }
}

