import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadProfile } from "../lib/storage";
import { getSocket } from "../lib/socket";
import type { Room } from "../types/game";

export function JoinRoomPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleJoin = () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== 5) {
      setError("Код должен содержать 5 символов A-Z или 0-9");
      return;
    }
    const { nickname, avatarColor } = loadProfile();
    const socket = getSocket();
    socket.emit(
      "lobby:joinRoom",
      { nickname, avatarColor, roomCode: trimmed },
      (response: Room | { error: string }) => {
        if ("error" in response) {
          if (response.error === "ROOM_NOT_FOUND") {
            setError("Комната не найдена.");
          } else {
            setError("Ошибка подключения к комнате.");
          }
          return;
        }
        navigate(`/room/${response.code}`);
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-backgroundSoft/80 shadow-card border border-white/5 p-6 sm:p-8 text-center space-y-4">
        <h2 className="text-xl font-semibold text-textPrimary">Ввод кода комнаты</h2>
        <p className="text-xs text-textSecondary">
          Введите 5-значный код, который прислал вам ведущий.
        </p>
        <input
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase())
          }
          maxLength={5}
          className="mt-3 w-full text-center tracking-[0.5em] text-lg rounded-2xl bg-background border border-white/10 px-4 py-3 text-textPrimary outline-none focus:ring-2 focus:ring-accent focus:border-accent"
        />
        {error && <div className="text-xs text-danger">{error}</div>}
        <button
          onClick={handleJoin}
          className="w-full rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-textPrimary shadow-card hover:bg-accentSoft transition-colors"
        >
          Присоединиться
        </button>
      </div>
    </div>
  );
}

