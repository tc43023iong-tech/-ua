
export enum GameMode {
  MENU = 'MENU',
  RIVER = 'RIVER',
  COOKING = 'COOKING',
  TWISTERS = 'TWISTERS'
}

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  WON = 'WON',
  GAME_OVER = 'GAME_OVER'
}

export type PinyinRhyme = 'ua' | 'uo' | 'uai' | 'uei' | 'uan' | 'uen' | 'uang' | 'ueng';

export const TARGET_RHYMES: PinyinRhyme[] = ['ua', 'uo', 'uai', 'uei', 'uan', 'uen', 'uang', 'ueng'];

export enum QuestionType {
  MATCHING = 'MATCHING',
  FILL_BLANK = 'FILL_BLANK',
  TWISTER = 'TWISTER'
}

export interface Question {
  id: string;
  type: QuestionType;
  rhyme: PinyinRhyme;
  promptText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  itemImage?: string; // For cooking mode
}

export interface Level {
  id: number;
  question: Question;
  isCompleted: boolean;
}

export interface TongueTwister {
  id: number;
  text: string;
  focusRhyme: PinyinRhyme;
  translation: string;
}
