/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenMode = 'main_menu' | 'level_select' | 'playing' | 'badges';

export type StageType = 'analyze' | 'apply' | 'reflect';

export interface LevelInfo {
  id: number;
  title: string;
  codename: string;
  description: string;
  topic: string;
  badgeId: string;
  icon: string;
  accentColor: string;
}

export interface LevelProgress {
  score: number;
  stars: number;
  completed: boolean;
  bestTimeSeconds: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  criteria: string;
}

export interface ReflectionQuestion {
  id: string;
  prompt: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface SoundConfig {
  sfxEnabled: boolean;
  ttsEnabled: boolean;
  ttsRate: number; // 0.8 - 1.2
  volume: number; // 0 - 1
}
