export type GameMode = "1v1" | "team";
export type TeamType = "none" | "hijau" | "oranye";
export type RoomState = "waiting" | "in_progress" | "finished";
export type OptionKey = "A" | "B" | "C" | "D";

export interface Option {
  key: OptionKey;
  text: string;
}

export interface Question {
  id: string;
  module_id: number;
  question_text: string;
  options: Option[];
  correct_option: OptionKey;
  time_limit_seconds: number;
  explanation: string;
}

export interface PlayerAnswer {
  question_id: string;
  selected_key: OptionKey;
  is_correct: boolean;
  points_earned: number;
  answered_at: string;
  response_time_ms: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  team: TeamType;
  score: number;
  streak: number;
  max_streak: number;
  answers: PlayerAnswer[];
  is_ready: boolean;
}

export interface Room {
  code: string;
  mode: GameMode;
  module_id: number;
  module_name: string;
  state: RoomState;
  questions: Question[];
  current_question_idx: number;
  question_start_time: string;
  players: Record<string, Player>;
  created_at: string;
  finished_at?: string;
}

export interface ModuleInfo {
  id: number;
  title: string;
  description: string;
  icon: string;
  pillar: string;
}

export interface AnswerResultPayload {
  player_id: string;
  selected_option: OptionKey;
  is_correct: boolean;
  points_earned: number;
  streak: number;
  green_score?: number;
  orange_score?: number;
}

export interface GameOverPayload {
  winner_team?: TeamType;
  green_score: number;
  orange_score: number;
  leaderboard: Player[];
}
