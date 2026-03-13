export type GameModeId =
  | "normal"
  | "knockoff"
  | "animation"
  | "icebreaker"
  | "exquisite_corpse"
  | "complement"
  | "masterpiece"
  | "story"
  | "missing_piece"
  | "secret"
  | "coop"
  | "score"
  | "sandwich"
  | "background"
  | "solo";

export interface BaseModeSettings {
  turnTimeSeconds: number;
  rounds: number;
  maxPlayers: number;
  hidePreviousActions: boolean;
  enableLikes: boolean;
  autoPlayResults: boolean;
}

export interface NormalSettings extends BaseModeSettings {}

export interface KnockOffSettings extends BaseModeSettings {
  initialTimeSeconds: number;
  accelerationPerRoundSeconds: number;
  copiesCount: number;
}

export interface AnimationSettings extends BaseModeSettings {
  framesPerPlayer: number;
  playbackSpeed: number;
  loop: boolean;
}

export interface IcebreakerSettings extends BaseModeSettings {
  multiQuestion: boolean;
}

export interface ExquisiteCorpseSettings extends BaseModeSettings {
  partsCount: 3 | 4;
  showConnectionLine: boolean;
}

export interface ComplementSettings extends BaseModeSettings {
  maxComplements: number;
}

export interface MasterpieceSettings extends BaseModeSettings {
  maxTimeSeconds: number | null;
}

export interface StorySettings extends BaseModeSettings {
  ttsEnabled: boolean;
  ttsRate: number;
  ttsVoice: string | null;
  sentencesPerPrompt: number;
}

export interface MissingPieceSettings extends BaseModeSettings {
  erasePartsPerTurn: number;
}

export interface SecretSettings extends BaseModeSettings {
  secrecyLevel: "full" | "partial";
}

export interface CoOpSettings extends BaseModeSettings {
  layersCount: number;
  eraserPermission: "all" | "owner" | "host";
}

export interface ScoreSettings extends BaseModeSettings {
  scoringMode: "likes" | "votes" | "custom";
  votingEnabled: boolean;
}

export interface SandwichSettings extends BaseModeSettings {
  drawingStepsBetweenTexts: number;
}

export interface BackgroundSettings extends BaseModeSettings {
  backgroundTurns: number;
  animationFrames: number;
}

export interface SoloSettings extends BaseModeSettings {
  frames: number;
  delayedTimer: boolean;
}

export type ModeSettingsMap = {
  normal: NormalSettings;
  knockoff: KnockOffSettings;
  animation: AnimationSettings;
  icebreaker: IcebreakerSettings;
  exquisite_corpse: ExquisiteCorpseSettings;
  complement: ComplementSettings;
  masterpiece: MasterpieceSettings;
  story: StorySettings;
  missing_piece: MissingPieceSettings;
  secret: SecretSettings;
  coop: CoOpSettings;
  score: ScoreSettings;
  sandwich: SandwichSettings;
  background: BackgroundSettings;
  solo: SoloSettings;
};

export interface Player {
  id: string;
  nickname: string;
  avatarColor: string;
  isHost: boolean;
}

export type RoomPhase = "lobby" | "in_game" | "results";

export interface Room<TMode extends GameModeId = GameModeId> {
  code: string;
  modeId: TMode;
  settings: ModeSettingsMap[TMode];
  players: Player[];
  hostId: string;
  phase: RoomPhase;
}

