export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  WON = 'WON',
  GAME_OVER = 'GAME_OVER'
}

export type PinyinRhyme = 'ua' | 'uo' | 'uai' | 'uei' | 'uan' | 'uen' | 'uang' | 'ueng';

export const TARGET_RHYMES: PinyinRhyme[] = ['ua', 'uo', 'uai', 'uei', 'uan', 'uen', 'uang', 'ueng'];

export enum QuestionType {
  MATCHING = 'MATCHING',   // See character/word, pick pinyin
  FILL_BLANK = 'FILL_BLANK' // See incomplete pinyin, pick rhyme
}

export interface Question {
  id: string;
  type: QuestionType;
  rhyme: PinyinRhyme;
  promptText: string; // The character or question text
  audioText?: string; // Text to be spoken by TTS (optional for feedback now)
  options: string[]; // 3-4 options
  correctAnswer: string;
  explanation?: string;
}

export interface Level {
  id: number;
  question: Question;
  isCompleted: boolean;
}