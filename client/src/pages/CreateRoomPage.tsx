import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../lib/socket";
import { loadProfile } from "../lib/storage";
import {
  allModesConfig,
  getDefaultSettingsForMode,
} from "../config/modesConfig";
import type { GameModeId, ModeSettingsMap, Room } from "../types/game";
import { ModeCard } from "../components/ModeCard";
import { AdvancedSettingsPanel } from "../components/AdvancedSettingsPanel";

export function CreateRoomPage() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<GameModeId>("normal");
  const [settingsByMode, setSettingsByMode] = useState<
    Partial<{ [K in GameModeId]: ModeSettingsMap[K] }>
  >({});
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setSettingsByMode((prev) => {
      if (prev[selectedMode]) return prev;
      return {
        ...prev,
        [selectedMode]: getDefaultSettingsForMode(selectedMode),
      };
    });
  }, [selectedMode]);

  const currentSettings = useMemo(
    () =>
      (settingsByMode[selectedMode] ??
        getDefaultSettingsForMode(selectedMode)) as ModeSettingsMap[GameModeId],
    [selectedMode, settingsByMode],
  );

  const handleSettingsChange = (patch: Partial<ModeSettingsMap[GameModeId]>) => {
    setSettingsByMode((prev) => ({
      ...prev,
      [selectedMode]: {
        ...(prev[selectedMode] ?? getDefaultSettingsForMode(selectedMode)),
        ...patch,
      } as ModeSettingsMap[GameModeId],
    }));
  };

  const handleCreate = () => {
    if (isCreating) return;
    setIsCreating(true);
    const { nickname, avatarColor } = loadProfile();
    const socket = getSocket();
    socket.emit(
      "lobby:createRoom",
      {
        nickname,
        avatarColor,
        modeId: selectedMode,
        settings: currentSettings,
      },
      (response: Room | { error: string }) => {
        if ("error" in response) {
          setIsCreating(false);
          return;
        }
        navigate(`/room/${response.code}`);
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-4xl rounded-3xl bg-backgroundSoft/80 shadow-card border border-white/5 p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold text-textPrimary">
              Создание комнаты
            </h2>
            <p className="text-xs text-textSecondary">
              Выберите режим, а затем откройте расширенные настройки, чтобы
              настроить игру под себя.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[260px] overflow-y-auto pr-1">
          {allModesConfig.map((mode) => (
            <ModeCard
              key={mode.id}
              id={mode.id}
              title={mode.name}
              description={mode.description}
              selected={selectedMode === mode.id}
              onSelect={() => setSelectedMode(mode.id)}
            />
          ))}
        </div>

        <AdvancedSettingsPanel
          modeId={selectedMode}
          settings={currentSettings}
          onChange={handleSettingsChange}
        />

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="w-full sm:w-auto rounded-2xl bg-background border border-white/10 px-4 py-2.5 text-sm font-semibold text-textSecondary hover:border-accentSoft transition-colors"
          >
            Назад
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={isCreating}
            className="w-full sm:w-auto rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-textPrimary shadow-card hover:bg-accentSoft disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Создать комнату
          </button>
        </div>
      </div>
    </div>
  );
}

