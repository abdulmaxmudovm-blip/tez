export type Theme = 'dark' | 'light' | 'sepia' | 'cyberpunk';
export type TestLanguage = 'uz' | 'en' | 'ru';
export type TestMode = 'time' | 'words';

export interface UserProfile {
  username: string;
  avatar: string; // emoji or graphic
  bio: string;
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  testsCompleted: number;
  unlockedBadges: string[]; // Badge IDs
}

export interface AppSettings {
  language: TestLanguage;
  mode: TestMode;
  duration: number; // in seconds (15, 30, 60, 120)
  wordCount: number; // 10, 25, 50, 100
  soundEnabled: boolean;
  liveStatsEnabled: boolean;
  keyboardLayoutEnabled: boolean;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  theme: Theme;
  fontFamily: string; // one of the 15 fonts
  soundType: 'mechanical' | 'retro' | 'pop' | 'beep';
}

export interface TestResult {
  id: string;
  username: string;
  avatar: string;
  wpm: number;
  accuracy: number;
  rawWpm: number;
  correctChars: number;
  incorrectChars: number;
  date: string;
  language: TestLanguage;
  duration: number;
  mode: TestMode;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon identifier
  color: string; // Tailwind class
  unlocked: boolean;
  unlockedAt?: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  wpm: number;
  accuracy: number;
  language: TestLanguage;
  mode: TestMode;
}
