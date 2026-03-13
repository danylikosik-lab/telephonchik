import type {
  AnimationSettings,
  BackgroundSettings,
  CoOpSettings,
  ComplementSettings,
  ExquisiteCorpseSettings,
  GameModeId,
  IcebreakerSettings,
  KnockOffSettings,
  MasterpieceSettings,
  MissingPieceSettings,
  ModeSettingsMap,
  NormalSettings,
  ScoreSettings,
  SecretSettings,
  SandwichSettings,
  SoloSettings,
  StorySettings,
} from "../types/game";

type Settings = ModeSettingsMap[GameModeId];

interface Props {
  modeId: GameModeId;
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
}

function NumberInput(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  const { label, value, min, max, step = 1, onChange } = props;
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-textSecondary">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-xl bg-background border border-white/10 px-2 py-1.5 text-xs text-textPrimary outline-none focus:ring-2 focus:ring-accent focus:border-accent"
      />
    </label>
  );
}

function ToggleInput(props: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const { label, value, onChange } = props;
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center justify-between w-full rounded-xl bg-background border border-white/10 px-3 py-2 text-xs text-textSecondary"
    >
      <span>{label}</span>
      <span
        className={`inline-flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${
          value ? "bg-accent" : "bg-white/10"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white transform transition-transform ${
            value ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

export function AdvancedSettingsPanel({ modeId, settings, onChange }: Props) {
  const base = settings as Settings;

  const handleBaseChange = (patch: Partial<Settings>) => {
    onChange(patch);
  };

  const renderModeSpecific = () => {
    switch (modeId) {
      case "normal":
        return null;
      case "knockoff": {
        const s = settings as KnockOffSettings;
        return (
          <>
            <NumberInput
              label="Начальное время (сек)"
              value={s.initialTimeSeconds}
              min={30}
              max={180}
              step={10}
              onChange={(v) => onChange({ initialTimeSeconds: v } as Partial<Settings>)}
            />
            <NumberInput
              label="Ускорение таймера (сек за раунд)"
              value={s.accelerationPerRoundSeconds}
              min={0}
              max={30}
              step={5}
              onChange={(v) =>
                onChange({ accelerationPerRoundSeconds: v } as Partial<Settings>)
              }
            />
            <NumberInput
              label="Количество копий"
              value={s.copiesCount}
              min={3}
              max={12}
              onChange={(v) => onChange({ copiesCount: v } as Partial<Settings>)}
            />
          </>
        );
      }
      case "animation": {
        const s = settings as AnimationSettings;
        return (
          <>
            <NumberInput
              label="Кадров на игрока"
              value={s.framesPerPlayer}
              min={2}
              max={20}
              onChange={(v) => onChange({ framesPerPlayer: v } as Partial<Settings>)}
            />
            <NumberInput
              label="Скорость воспроизведения"
              value={s.playbackSpeed}
              min={0.25}
              max={4}
              step={0.25}
              onChange={(v) => onChange({ playbackSpeed: v } as Partial<Settings>)}
            />
            <ToggleInput
              label="Зацикливание анимации"
              value={s.loop}
              onChange={(v) => onChange({ loop: v } as Partial<Settings>)}
            />
          </>
        );
      }
      case "icebreaker": {
        const s = settings as IcebreakerSettings;
        return (
          <ToggleInput
            label="Несколько вопросов (несколько раундов)"
            value={s.multiQuestion}
            onChange={(v) => onChange({ multiQuestion: v } as Partial<Settings>)}
          />
        );
      }
      case "exquisite_corpse": {
        const s = settings as ExquisiteCorpseSettings;
        return (
          <>
            <NumberInput
              label="Количество частей"
              value={s.partsCount}
              min={3}
              max={4}
              onChange={(v) => onChange({ partsCount: v as 3 | 4 } as Partial<Settings>)}
            />
            <ToggleInput
              label="Показывать линию соединения"
              value={s.showConnectionLine}
              onChange={(v) => onChange({ showConnectionLine: v } as Partial<Settings>)}
            />
          </>
        );
      }
      case "complement": {
        const s = settings as ComplementSettings;
        return (
          <NumberInput
            label="Сколько раз можно дополнять"
            value={s.maxComplements}
            min={1}
            max={5}
            onChange={(v) => onChange({ maxComplements: v } as Partial<Settings>)}
          />
        );
      }
      case "masterpiece": {
        const s = settings as MasterpieceSettings;
        return (
          <>
            <NumberInput
              label="Максимальное время (сек, 0 = без лимита)"
              value={s.maxTimeSeconds ?? 0}
              min={0}
              max={3600}
              step={30}
              onChange={(v) =>
                onChange({ maxTimeSeconds: v === 0 ? null : v } as Partial<Settings>)
              }
            />
          </>
        );
      }
      case "story": {
        const s = settings as StorySettings;
        return (
          <>
            <ToggleInput
              label="Озвучка бота включена"
              value={s.ttsEnabled}
              onChange={(v) => onChange({ ttsEnabled: v } as Partial<Settings>)}
            />
            <NumberInput
              label="Скорость речи"
              value={s.ttsRate}
              min={0.5}
              max={2}
              step={0.1}
              onChange={(v) => onChange({ ttsRate: v } as Partial<Settings>)}
            />
            <NumberInput
              label="Количество предложений"
              value={s.sentencesPerPrompt}
              min={1}
              max={5}
              onChange={(v) => onChange({ sentencesPerPrompt: v } as Partial<Settings>)}
            />
          </>
        );
      }
      case "missing_piece": {
        const s = settings as MissingPieceSettings;
        return (
          <NumberInput
            label="Сколько частей стирать за ход"
            value={s.erasePartsPerTurn}
            min={1}
            max={5}
            onChange={(v) => onChange({ erasePartsPerTurn: v } as Partial<Settings>)}
          />
        );
      }
      case "secret": {
        const s = settings as SecretSettings;
        return (
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-textSecondary">Степень скрытия</span>
            <select
              value={s.secrecyLevel}
              onChange={(e) =>
                onChange({ secrecyLevel: e.target.value as SecretSettings["secrecyLevel"] } as Partial<Settings>)
              }
              className="rounded-xl bg-background border border-white/10 px-2 py-1.5 text-xs text-textPrimary outline-none focus:ring-2 focus:ring-accent focus:border-accent"
            >
              <option value="full">Полностью</option>
              <option value="partial">Частично</option>
            </select>
          </label>
        );
      }
      case "coop": {
        const s = settings as CoOpSettings;
        return (
          <>
            <NumberInput
              label="Количество слоёв"
              value={s.layersCount}
              min={1}
              max={10}
              onChange={(v) => onChange({ layersCount: v } as Partial<Settings>)}
            />
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-textSecondary">Кто может стирать</span>
              <select
                value={s.eraserPermission}
                onChange={(e) =>
                  onChange({
                    eraserPermission: e.target.value as CoOpSettings["eraserPermission"],
                  } as Partial<Settings>)
                }
                className="rounded-xl bg-background border border-white/10 px-2 py-1.5 text-xs text-textPrimary outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              >
                <option value="all">Все</option>
                <option value="owner">Автор элемента</option>
                <option value="host">Только ведущий</option>
              </select>
            </label>
          </>
        );
      }
      case "score": {
        const s = settings as ScoreSettings;
        return (
          <>
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-textSecondary">Способ подсчёта очков</span>
              <select
                value={s.scoringMode}
                onChange={(e) =>
                  onChange({
                    scoringMode: e.target.value as ScoreSettings["scoringMode"],
                  } as Partial<Settings>)
                }
                className="rounded-xl bg-background border border-white/10 px-2 py-1.5 text-xs text-textPrimary outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              >
                <option value="likes">По лайкам</option>
                <option value="votes">По голосованию</option>
                <option value="custom">Своя система</option>
              </select>
            </label>
            <ToggleInput
              label="Включить голосование игроков"
              value={s.votingEnabled}
              onChange={(v) => onChange({ votingEnabled: v } as Partial<Settings>)}
            />
          </>
        );
      }
      case "sandwich": {
        const s = settings as SandwichSettings;
        return (
          <NumberInput
            label="Рисовальных ходов между текстами"
            value={s.drawingStepsBetweenTexts}
            min={1}
            max={5}
            onChange={(v) =>
              onChange({ drawingStepsBetweenTexts: v } as Partial<Settings>)
            }
          />
        );
      }
      case "background": {
        const s = settings as BackgroundSettings;
        return (
          <>
            <NumberInput
              label="Ходов на фон"
              value={s.backgroundTurns}
              min={1}
              max={5}
              onChange={(v) => onChange({ backgroundTurns: v } as Partial<Settings>)}
            />
            <NumberInput
              label="Кадров анимации"
              value={s.animationFrames}
              min={1}
              max={20}
              onChange={(v) => onChange({ animationFrames: v } as Partial<Settings>)}
            />
          </>
        );
      }
      case "solo": {
        const s = settings as SoloSettings;
        return (
          <>
            <NumberInput
              label="Количество кадров"
              value={s.frames}
              min={5}
              max={20}
              onChange={(v) => onChange({ frames: v } as Partial<Settings>)}
            />
            <ToggleInput
              label="Таймер только после половины"
              value={s.delayedTimer}
              onChange={(v) => onChange({ delayedTimer: v } as Partial<Settings>)}
            />
          </>
        );
      }
    }
  };

  return (
    <div className="mt-4 rounded-2xl bg-background/90 border border-white/10 p-3 sm:p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-textPrimary uppercase tracking-wide">
          Расширенные настройки
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <NumberInput
          label="Время на ход (сек)"
          value={base.turnTimeSeconds}
          min={30}
          max={180}
          step={10}
          onChange={(v) => handleBaseChange({ turnTimeSeconds: v })}
        />
        <NumberInput
          label="Количество раундов"
          value={base.rounds}
          min={1}
          max={10}
          onChange={(v) => handleBaseChange({ rounds: v })}
        />
        <NumberInput
          label="Максимум игроков"
          value={base.maxPlayers}
          min={3}
          max={12}
          onChange={(v) => handleBaseChange({ maxPlayers: v })}
        />
        <ToggleInput
          label="Скрывать предыдущие действия"
          value={base.hidePreviousActions}
          onChange={(v) => handleBaseChange({ hidePreviousActions: v })}
        />
        <ToggleInput
          label="Включить лайки"
          value={base.enableLikes}
          onChange={(v) => handleBaseChange({ enableLikes: v })}
        />
        <ToggleInput
          label="Автовоспроизведение анимации"
          value={base.autoPlayResults}
          onChange={(v) => handleBaseChange({ autoPlayResults: v })}
        />
      </div>
      <div className="border-t border-white/5 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {renderModeSpecific()}
      </div>
    </div>
  );
}

