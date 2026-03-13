import type { GameModeId } from "../types/game";

interface ModeCardProps {
  id: GameModeId;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

export function ModeCard({ id, title, description, selected, onSelect }: ModeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col items-start gap-1 rounded-2xl border px-3 py-2.5 text-left text-xs sm:text-sm transition-colors ${
        selected
          ? "border-accent bg-accent/20 shadow-card"
          : "border-white/10 bg-background/80 hover:border-accentSoft"
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <span className="font-semibold text-textPrimary">{title}</span>
        <span className="text-[10px] uppercase text-textSecondary">{id}</span>
      </div>
      <p className="text-[11px] text-textSecondary">{description}</p>
    </button>
  );
}

