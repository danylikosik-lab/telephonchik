import {
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
} from "../types/game.js";
import {
  MAX_PLAYERS,
  MAX_ROUNDS,
  MAX_TURN_TIME,
  MIN_PLAYERS,
  MIN_ROUNDS,
  MIN_TURN_TIME,
} from "./constants.js";

export interface GameModeConfig<TSettings> {
  id: GameModeId;
  name: string;
  description: string;
  defaultSettings: TSettings;
}

const baseDefaults = {
  turnTimeSeconds: 60,
  rounds: 5,
  maxPlayers: MAX_PLAYERS,
  hidePreviousActions: false,
  enableLikes: true,
  autoPlayResults: true,
} as const;

export const normalMode: GameModeConfig<NormalSettings> = {
  id: "normal",
  name: "Normal",
  description: "Классический текст → рисунок → текст.",
  defaultSettings: {
    ...baseDefaults,
  },
};

export const knockOffMode: GameModeConfig<KnockOffSettings> = {
  id: "knockoff",
  name: "Knock-Off",
  description: "Копирование рисунка с ускоряющимся таймером.",
  defaultSettings: {
    ...baseDefaults,
    initialTimeSeconds: 80,
    accelerationPerRoundSeconds: 10,
    copiesCount: 5,
  },
};

export const animationMode: GameModeConfig<AnimationSettings> = {
  id: "animation",
  name: "Animation",
  description: "Покадровая анимация.",
  defaultSettings: {
    ...baseDefaults,
    framesPerPlayer: 6,
    playbackSpeed: 1,
    loop: true,
  },
};

export const icebreakerMode: GameModeConfig<IcebreakerSettings> = {
  id: "icebreaker",
  name: "Icebreaker",
  description: "Один вопрос и рисунки всех игроков.",
  defaultSettings: {
    ...baseDefaults,
    rounds: 1,
    hidePreviousActions: false,
    autoPlayResults: false,
    multiQuestion: false,
  },
};

export const exquisiteCorpseMode: GameModeConfig<ExquisiteCorpseSettings> = {
  id: "exquisite_corpse",
  name: "Exquisite Corpse",
  description: "Голова → тело → ноги (3–4 части).",
  defaultSettings: {
    ...baseDefaults,
    partsCount: 3,
    showConnectionLine: true,
  },
};

export const complementMode: GameModeConfig<ComplementSettings> = {
  id: "complement",
  name: "Complement",
  description: "Дополнение чужого рисунка.",
  defaultSettings: {
    ...baseDefaults,
    maxComplements: 1,
  },
};

export const masterpieceMode: GameModeConfig<MasterpieceSettings> = {
  id: "masterpiece",
  name: "Masterpiece",
  description: "Один ход без таймера.",
  defaultSettings: {
    ...baseDefaults,
    turnTimeSeconds: MAX_TURN_TIME,
    maxTimeSeconds: null,
  },
};

export const storyMode: GameModeConfig<StorySettings> = {
  id: "story",
  name: "Story",
  description: "Только текст с озвучкой бота.",
  defaultSettings: {
    ...baseDefaults,
    ttsEnabled: true,
    ttsRate: 1,
    ttsVoice: null,
    sentencesPerPrompt: 2,
  },
};

export const missingPieceMode: GameModeConfig<MissingPieceSettings> = {
  id: "missing_piece",
  name: "Missing Piece",
  description: "Добавляешь часть и убираешь другую.",
  defaultSettings: {
    ...baseDefaults,
    erasePartsPerTurn: 1,
  },
};

export const secretMode: GameModeConfig<SecretSettings> = {
  id: "secret",
  name: "Secret",
  description: "Всё скрыто до конца.",
  defaultSettings: {
    ...baseDefaults,
    secrecyLevel: "full",
    hidePreviousActions: true,
  },
};

export const coopMode: GameModeConfig<CoOpSettings> = {
  id: "coop",
  name: "Co-op",
  description: "Совместный холст.",
  defaultSettings: {
    ...baseDefaults,
    layersCount: 3,
    eraserPermission: "all",
  },
};

export const scoreMode: GameModeConfig<ScoreSettings> = {
  id: "score",
  name: "Score",
  description: "Система очков и голосование.",
  defaultSettings: {
    ...baseDefaults,
    scoringMode: "likes",
    votingEnabled: true,
  },
};

export const sandwichMode: GameModeConfig<SandwichSettings> = {
  id: "sandwich",
  name: "Sandwich",
  description: "Текст → рисунки → текст.",
  defaultSettings: {
    ...baseDefaults,
    drawingStepsBetweenTexts: 2,
  },
};

export const backgroundMode: GameModeConfig<BackgroundSettings> = {
  id: "background",
  name: "Background",
  description: "Фон + анимация поверх.",
  defaultSettings: {
    ...baseDefaults,
    backgroundTurns: 1,
    animationFrames: 4,
  },
};

export const soloMode: GameModeConfig<SoloSettings> = {
  id: "solo",
  name: "Solo",
  description: "Одиночная анимация.",
  defaultSettings: {
    ...baseDefaults,
    frames: 10,
    delayedTimer: true,
  },
};

export const allGameModes: GameModeConfig<ModeSettingsMap[GameModeId]>[] = [
  normalMode as GameModeConfig<ModeSettingsMap[GameModeId]>,
  knockOffMode as GameModeConfig<ModeSettingsMap[GameModeId]>,
  animationMode as GameModeConfig<ModeSettingsMap[GameModeId]>,
  icebreakerMode as GameModeConfig<ModeSettingsMap[GameModeId]>,
  exquisiteCorpseMode as GameModeConfig<ModeSettingsMap[GameModeId]>,
  complementMode as GameModeConfig<ModeSettingsMap[GameModeId]>,
  masterpieceMode as GameModeConfig<ModeSettingsMap[GameModeId]>,
  storyMode as GameModeConfig<ModeSettingsMap[GameModeId]>,
  missingPieceMode as GameModeConfig<ModeSettingsMap[GameModeId]>,
  secretMode as GameModeConfig<ModeSettingsMap[GameModeId]>,
  coopMode as GameModeConfig<ModeSettingsMap[GameModeId]>,
  scoreMode as GameModeConfig<ModeSettingsMap[GameModeId]>,
  sandwichMode as GameModeConfig<ModeSettingsMap[GameModeId]>,
  backgroundMode as GameModeConfig<ModeSettingsMap[GameModeId]>,
  soloMode as GameModeConfig<ModeSettingsMap[GameModeId]>,
];

export function getDefaultSettingsForMode<TId extends GameModeId>(
  id: TId,
): ModeSettingsMap[TId] {
  const mode = allGameModes.find((m) => m.id === id);
  if (!mode) {
    throw new Error(`Unknown game mode: ${id}`);
  }
  return mode.defaultSettings as ModeSettingsMap[TId];
}

export function clampCommonSettings<T extends { turnTimeSeconds: number; rounds: number; maxPlayers: number }>(
  settings: T,
): T {
  const clamped: T = { ...settings };
  clamped.turnTimeSeconds = Math.min(
    MAX_TURN_TIME,
    Math.max(MIN_TURN_TIME, Math.round(clamped.turnTimeSeconds / 10) * 10),
  );
  clamped.rounds = Math.min(
    MAX_ROUNDS,
    Math.max(MIN_ROUNDS, Math.round(clamped.rounds)),
  );
  clamped.maxPlayers = Math.min(
    MAX_PLAYERS,
    Math.max(MIN_PLAYERS, Math.round(clamped.maxPlayers)),
  );
  return clamped;
}

