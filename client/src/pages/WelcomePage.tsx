import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadProfile, saveProfile } from "../lib/storage";

export function WelcomePage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [color, setColor] = useState("#ffdf40");

  useEffect(() => {
    const profile = loadProfile();
    if (profile.nickname) {
      setNickname(profile.nickname);
      setColor(profile.avatarColor);
    }
  }, []);

  const canContinue = nickname.trim().length >= 2;

  const handleContinue = () => {
    if (!canContinue) return;
    saveProfile(nickname.trim(), color);
    navigate("/menu");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-accent blur-3xl rounded-full" />
        <div className="absolute -bottom-40 right-0 w-96 h-96 bg-accentSoft blur-3xl rounded-full" />
      </div>
      <div className="relative w-full max-w-md rounded-3xl bg-backgroundSoft/90 shadow-card border border-white/10 p-6 sm:p-8 text-center backdrop-blur">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-background/80 text-[11px] text-textSecondary mb-4">
          <span className="w-2 h-2 rounded-full bg-accentStrong animate-pulse" />
          <span>Онлайн-игра по мотивам Gartic Phone</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-textPrimary mb-2 tracking-tight">
          Телефончик
        </h1>
        <p className="text-textSecondary mb-6 text-sm">
          Рисуйте, придумывайте истории и смейтесь с друзьями в одном лобби.
        </p>
        <div className="flex flex-col gap-4 items-stretch">
          <div className="text-left">
            <label className="block text-xs font-medium text-textSecondary mb-1">
              Никнейм
            </label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Как тебя звать?"
              maxLength={16}
              className="w-full rounded-xl bg-background border border-white/10 px-3 py-2 text-sm text-textPrimary outline-none focus:ring-2 focus:ring-accent focus:border-accent"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="text-left flex-1">
              <label className="block text-xs font-medium text-textSecondary mb-1">
                Цвет аватарки
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 rounded-xl bg-transparent border border-white/10 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-accent bg-background">
              <div
                className="w-10 h-10 rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
          </div>
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className="mt-2 inline-flex items-center justify-center rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-textPrimary shadow-card disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accentSoft transition-colors"
          >
            Продолжить
          </button>
        </div>
      </div>
    </div>
  );
}

