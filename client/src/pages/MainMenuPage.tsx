import { useNavigate } from "react-router-dom";
import { loadProfile } from "../lib/storage";

export function MainMenuPage() {
  const navigate = useNavigate();
  const { nickname, avatarColor } = loadProfile();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-md rounded-3xl bg-backgroundSoft/90 shadow-card border border-white/10 p-6 sm:p-8 text-center space-y-6 backdrop-blur">
        <div className="flex items-center gap-3 justify-center">
          <div
            className="w-12 h-12 rounded-full border-4 border-accent bg-background"
            style={{ backgroundColor: avatarColor || "#ffdf40" }}
          />
          <div className="text-left">
            <div className="text-xs text-textSecondary">Игрок</div>
            <div className="text-lg font-semibold text-textPrimary">
              {nickname || "Гость"}
            </div>
          </div>
        </div>
        <p className="text-xs text-textSecondary">
          Создайте комнату и отправьте друзьям код или подключитесь к уже созданной.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/create")}
            className="w-full rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-textPrimary shadow-card hover:bg-accentSoft transition-colors"
          >
            Создать комнату
          </button>
          <button
            onClick={() => navigate("/join")}
            className="w-full rounded-2xl bg-background border border-white/10 px-4 py-3 text-sm font-semibold text-textPrimary hover:border-accentSoft transition-colors"
          >
            Присоединиться по коду
          </button>
        </div>
      </div>
    </div>
  );
}

