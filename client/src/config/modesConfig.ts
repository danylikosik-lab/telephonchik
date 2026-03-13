import type {
  GameModeId,
  ModeSettingsMap,
  NormalSettings,
  KnockOffSettings,
  AnimationSettings,
  IcebreakerSettings,
  ExquisiteCorpseSettings,
  ComplementSettings,
  MasterpieceSettings,
  StorySettings,
  MissingPieceSettings,
  SecretSettings,
  CoOpSettings,
  ScoreSettings,
  SandwichSettings,
  BackgroundSettings,
  SoloSettings,
} from "../types/game";

export interface GameModeConfig<TSettings> {
  id: GameModeId;
  name: string;
  description: string;
  defaultSettings: TSettings;
}

const baseDefaults = {
  turnTimeSeconds: 60,
  rounds: 5,
  maxPlayers: 12,
  hidePreviousActions: false,
  enableLikes: true,
  autoPlayResults: true,
} as const;

export const allModesConfig: GameModeConfig<ModeSettingsMap[GameModeId]>[] = [
  {
    id: "normal",
    name: "Normal",
    description: "Классический текст → рисунок → текст.",
    defaultSettings: {
      ...baseDefaults,
    } as NormalSettings,
  },
  {
    id: "knockoff",
    name: "Knock-Off",
    description: "Копирование рисунков с ускоряющимся таймером.",
    defaultSettings: {
      ...baseDefaults,
      initialTimeSeconds: 80,
      accelerationPerRoundSeconds: 10,
      copiesCount: 5,
    } as KnockOffSettings,
  },
  {
    id: "animation",
    name: "Animation",
    description: "Покадровая анимация.",
    defaultSettings: {
      ...baseDefaults,
      framesPerPlayer: 6,
      playbackSpeed: 1,
      loop: true,
    } as AnimationSettings,
  },
  {
    id: "icebreaker",
    name: "Icebreaker",
    description: "Один вопрос и рисунки всех игроков.",
    defaultSettings: {
      ...baseDefaults,
      rounds: 1,
      hidePreviousActions: false,
      autoPlayResults: false,
      multiQuestion: false,
    } as IcebreakerSettings,
  },
  {
    id: "exquisite_corpse",
    name: "Exquisite Corpse",
    description: "Голова → тело → ноги (3–4 части).",
    defaultSettings: {
      ...baseDefaults,
      partsCount: 3,
      showConnectionLine: true,
    } as ExquisiteCorpseSettings,
  },
  {
    id: "complement",
    name: "Complement",
    description: "Дополнение чужого рисунка.",
    defaultSettings: {
      ...baseDefaults,
      maxComplements: 1,
    } as ComplementSettings,
  },
  {
    id: "masterpiece",
    name: "Masterpiece",
    description: "Один ход без таймера.",
    defaultSettings: {
      ...baseDefaults,
      turnTimeSeconds: 180,
      maxTimeSeconds: null,
    } as MasterpieceSettings,
  },
  {
    id: "story",
    name: "Story",
    description: "Только текст с озвучкой бота.",
    defaultSettings: {
      ...baseDefaults,
      ttsEnabled: true,
      ttsRate: 1,
      ttsVoice: null,
      sentencesPerPrompt: 2,
    } as StorySettings,
  },
  {
    id: "missing_piece",
    name: "Missing Piece",
    description: "Добавляешь часть и убираешь другую.",
    defaultSettings: {
      ...baseDefaults,
      erasePartsPerTurn: 1,
    } as MissingPieceSettings,
  },
  {
    id: "secret",
    name: "Secret",
    description: "Всё скрыто до конца.",
    defaultSettings: {
      ...baseDefaults,
      secrecyLevel: "full",
      hidePreviousActions: true,
    } as SecretSettings,
  },
  {
    id: "coop",
    name: "Co-op",
    description: "Общий холст.",
    defaultSettings: {
      ...baseDefaults,
      layersCount: 3,
      eraserPermission: "all",
    } as CoOpSettings,
  },
  {
    id: "score",
    name: "Score",
    description: "Система очков и голосование.",
    defaultSettings: {
      ...baseDefaults,
      scoringMode: "likes",
      votingEnabled: true,
    } as ScoreSettings,
  },
  {
    id: "sandwich",
    name: "Sandwich",
    description: "Текст → рисунки → текст.",
    defaultSettings: {
      ...baseDefaults,
      drawingStepsBetweenTexts: 2,
    } as SandwichSettings,
  },
  {
    id: "background",
    name: "Background",
    description: "Сначала фон, потом анимация на нём.",
    defaultSettings: {
      ...baseDefaults,
      backgroundTurns: 1,
      animationFrames: 4,
    } as BackgroundSettings,
  },
  {
    id: "solo",
    name: "Solo",
    description: "Одиночная анимация.",
    defaultSettings: {
      ...baseDefaults,
      frames: 10,
      delayedTimer: true,
    } as SoloSettings,
  },
];

export function getDefaultSettingsForMode<TId extends GameModeId>(
  id: TId,
): ModeSettingsMap[TId] {
  const mode = allModesConfig.find((m) => m.id === id);
  if (!mode) {
    throw new Error(`Unknown mode: ${id}`);
  }
  return mode.defaultSettings as ModeSettingsMap[TId];
}

