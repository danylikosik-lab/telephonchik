import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSocket } from "../lib/socket";
import type { Room, StorySettings } from "../types/game";
import { DrawingBoard } from "../components/canvas/DrawingBoard";
import { allModesConfig } from "../config/modesConfig";
import { speakRussian } from "../lib/speech";

interface GameStatePayload {
  room: Room;
  game: {
    phase: "idle" | "collect_prompts" | "draw" | "guess" | "results";
    round: number;
    timerEndsAt: number | null;
  } | null;
}

export function GamePage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [payload, setPayload] = useState<GameStatePayload | null>(null);
  const [input, setInput] = useState("");
  const [drawingDataUrl, setDrawingDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const socket = getSocket();
    const handleState = (data: GameStatePayload) => {
      setPayload(data);
    };
    socket.on("game:state", handleState);
    return () => {
      socket.off("game:state", handleState);
    };
  }, []);

  const room = payload?.room;
  const game = payload?.game;

  const currentMode = useMemo(
    () => (room ? allModesConfig.find((m) => m.id === room.modeId) : undefined),
    [room],
  );

  const phaseLabel = useMemo(() => {
    if (!room) return "Ожидание начала игры...";

    if (room.modeId === "story") {
      if (game?.phase === "collect_prompts") return "Напишите часть истории";
      if (game?.phase === "results") return "Прослушивание историй";
      return "История";
    }

    if (room.modeId === "animation") {
      if (game?.phase === "draw") return "Нарисуйте кадр анимации";
      if (game?.phase === "results") return "Просмотр анимации";
      return "Анимация";
    }

    switch (game?.phase) {
      case "collect_prompts":
        return "Придумайте забавную фразу";
      case "draw":
        return "Нарисуйте, что вам досталось";
      case "guess":
        return "Опишите, что вы видите";
      case "results":
        return "Результаты";
      default:
        return "Ожидание начала игры...";
    }
  }, [game?.phase, room]);

  const secondsLeft = useMemo(() => {
    if (!game?.timerEndsAt) return null;
    const diff = Math.max(0, Math.round((game.timerEndsAt - Date.now()) / 1000));
    return diff;
  }, [game?.timerEndsAt, payload]);

  const handleSubmit = () => {
    if (!code) return;
    const isDrawingPhase = game?.phase === "draw";
    const content =
      isDrawingPhase && drawingDataUrl
        ? JSON.stringify({ type: "drawing", dataUrl: drawingDataUrl })
        : input.trim()
        ? JSON.stringify({ type: "text", text: input.trim() })
        : "";
    if (!content) return;

    const socket = getSocket();
    socket.emit(
      "game:submitStep",
      { roomCode: code, content },
      () => {
        setInput("");
        if (isDrawingPhase) {
          setDrawingDataUrl(null);
        }
        if (room?.modeId === "story" && !isDrawingPhase && input.trim()) {
          const storySettings = room.settings as unknown as StorySettings;
          void speakRussian(input.trim(), {
            enabled: storySettings.ttsEnabled,
            rate: storySettings.ttsRate,
            voiceName: storySettings.ttsVoice,
          });
        }
      },
    );
  };

  const handleStart = () => {
    if (!code) return;
    const socket = getSocket();
    socket.emit("game:start", { roomCode: code }, () => {});
  };

  if (!code) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-4xl rounded-3xl bg-backgroundSoft/80 shadow-card border border-white/5 p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-textPrimary">
              Игра — {currentMode?.name ?? "Unknown"}
            </h2>
            <p className="text-xs text-textSecondary">
              Комната {code.toUpperCase()} · Раунд {game?.round ?? 1}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/room/${code}`)}
            className="rounded-2xl bg-background border border-white/10 px-3 py-1.5 text-xs font-semibold text-textSecondary hover:border-accentSoft transition-colors"
          >
            В лобби
          </button>
        </div>

        <div className="rounded-2xl bg-background/90 border border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-textPrimary">{phaseLabel}</div>
            {secondsLeft !== null && (
              <div className="text-xs text-textSecondary">
                Осталось{" "}
                <span className="font-mono text-accent">{secondsLeft}</span> сек
              </div>
            )}
          </div>

          {game?.phase === "collect_prompts" && (
            <div className="space-y-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
                maxLength={120}
                className="w-full rounded-2xl bg-background border border-white/10 px-3 py-2 text-sm text-textPrimary outline-none focus:ring-2 focus:ring-accent focus:border-accent resize-none"
                placeholder="Напишите забавную/странную фразу..."
              />
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center justify-center rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-textPrimary shadow-card hover:bg-accentSoft transition-colors"
              >
                Отправить фразу
              </button>
            </div>
          )}

          {game?.phase === "draw" && (
            <div className="space-y-3">
              <DrawingBoard onExport={(dataUrl) => setDrawingDataUrl(dataUrl)} />
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center justify-center rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-textPrimary shadow-card hover:bg-accentSoft transition-colors"
              >
                Отправить рисунок
              </button>
            </div>
          )}

          {game?.phase === "guess" && (
            <div className="space-y-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
                maxLength={120}
                className="w-full rounded-2xl bg-background border border-white/10 px-3 py-2 text-sm text-textPrimary outline-none focus:ring-2 focus:ring-accent focus:border-accent resize-none"
                placeholder="Опишите, что вы видите на рисунке."
              />
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center justify-center rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-textPrimary shadow-card hover:bg-accentSoft transition-colors"
              >
                Отправить
              </button>
            </div>
          )}

          {!game && (
            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center justify-center rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-textPrimary shadow-card hover:bg-accentSoft transition-colors"
            >
              Начать игру (Normal)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

