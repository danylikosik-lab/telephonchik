import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSocket } from "../lib/socket";
import type { Player, Room } from "../types/game";
import { allModesConfig } from "../config/modesConfig";
import { AdvancedSettingsPanel } from "../components/AdvancedSettingsPanel";

export function LobbyPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    if (code) {
      socket.emit("lobby:getRoom", { roomCode: code }, (response: Room | { error: string }) => {
        if ("error" in response) return;
        setRoom(response);
      });
    }
    const handleUpdated = (updated: Room) => {
      setRoom(updated);
    };
    socket.on("lobby:roomUpdated", handleUpdated);
    return () => {
      socket.off("lobby:roomUpdated", handleUpdated);
    };
  }, [code]);

  if (!code) {
    return null;
  }

  const players: Player[] = room?.players ?? [];
  const currentModeConfig = useMemo(
    () => allModesConfig.find((m) => m.id === room?.modeId),
    [room?.modeId],
  );

  const handleSettingsChange = (patch: Partial<Room["settings"]>) => {
    if (!room) return;
    const socket = getSocket();
    socket.emit(
      "lobby:updateSettings",
      {
        roomCode: room.code,
        modeId: room.modeId,
        settings: patch,
      },
      (updated: Room | { error: string }) => {
        if ("error" in updated) return;
        setRoom(updated);
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-3xl rounded-3xl bg-backgroundSoft/80 shadow-card border border-white/5 p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold text-textPrimary">Лобби</h2>
            <p className="text-xs text-textSecondary">
              Код комнаты:{" "}
              <span className="font-mono tracking-[0.3em] text-accent">
                {code.toUpperCase()}
              </span>
            </p>
            {currentModeConfig && (
              <p className="mt-1 text-[11px] text-textSecondary">
                Режим:{" "}
                <span className="font-semibold text-textPrimary">
                  {currentModeConfig.name}
                </span>{" "}
                — {currentModeConfig.description}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(`/game/${code}`)}
              className="rounded-2xl bg-accent px-3 py-1.5 text-xs font-semibold text-textPrimary shadow-card hover:bg-accentSoft transition-colors"
            >
              В игру
            </button>
            <button
              type="button"
              onClick={() => navigate("/menu")}
              className="rounded-2xl bg-background border border-white/10 px-3 py-1.5 text-xs font-semibold text-textSecondary hover:border-accentSoft transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-background/80 border border-white/10 p-3 sm:p-4">
          <h3 className="text-xs font-semibold text-textSecondary uppercase mb-2">
            Игроки
          </h3>
          <div className="flex flex-wrap gap-2">
            {players.map((player: Player) => (
              <div
                key={player.id}
                className="flex items-center gap-2 rounded-2xl bg-backgroundSoft border border-white/5 px-3 py-2 text-xs"
              >
                <div
                  className="w-7 h-7 rounded-full border-2 border-accent bg-background"
                  style={{ backgroundColor: player.avatarColor }}
                />
                <div className="flex flex-col">
                  <span className="text-textPrimary font-medium">
                    {player.nickname}
                  </span>
                  {player.isHost && (
                    <span className="text-[10px] uppercase text-accentStrong">
                      Ведущий
                    </span>
                  )}
                </div>
              </div>
            ))}
            {players.length === 0 && (
              <div className="text-xs text-textSecondary">
                Ожидание игроков...
              </div>
            )}
          </div>
        </div>

        {room && (
          <div className="rounded-2xl bg-background/80 border border-white/10 p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-textSecondary">
                <div>
                  Время на ход:{" "}
                  <span className="text-textPrimary font-semibold">
                    {room.settings.turnTimeSeconds} сек
                  </span>
                </div>
                <div>
                  Раундов:{" "}
                  <span className="text-textPrimary font-semibold">
                    {room.settings.rounds}
                  </span>
                  {"  ·  "}
                  Игроков:{" "}
                  <span className="text-textPrimary font-semibold">
                    до {room.settings.maxPlayers}
                  </span>
                </div>
              </div>
              {room.players.some((p) => p.id === room.hostId) && (
                <button
                  type="button"
                  onClick={() => setShowAdvanced((v) => !v)}
                  className="rounded-xl bg-background border border-accent/40 px-3 py-1.5 text-[11px] font-semibold text-accent hover:border-accentSoft transition-colors"
                >
                  {showAdvanced ? "Скрыть настройки" : "Расширенные настройки"}
                </button>
              )}
            </div>
            {showAdvanced && (
              <AdvancedSettingsPanel
                modeId={room.modeId}
                settings={room.settings as any}
                onChange={handleSettingsChange as any}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

