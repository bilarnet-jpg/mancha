import { create } from 'zustand';
import {
  UserPassport, UserParade, UserAchievement, UserMemory,
  FutureLetter, TimelineEntry, WrappedData,
  MOCK_PASSPORT, MOCK_PARADES, MOCK_ACHIEVEMENTS, MOCK_TIMELINE, MOCK_WRAPPED,
  ALL_ACHIEVEMENTS, getLevelInfo,
} from '../types/historia';

interface HistoriaStore {
  passport: UserPassport;
  parades: UserParade[];
  achievements: UserAchievement[];
  memories: UserMemory[];
  letters: FutureLetter[];
  timeline: TimelineEntry[];
  wrapped: WrappedData | null;
  isLoading: boolean;

  loadData: (userId: string) => void;
  addParade: (parade: Omit<UserParade, 'id' | 'createdAt'>) => void;
  removeParade: (id: string) => void;
  addMemory: (memory: Omit<UserMemory, 'id' | 'createdAt'>) => void;
  toggleFavoriteMemory: (id: string) => void;
  addLetter: (letter: Omit<FutureLetter, 'id' | 'isOpened' | 'createdAt'>) => void;
  loadWrapped: (year: number) => void;
  getProgressToNextLevel: () => number;
  getLockedAchievements: () => typeof ALL_ACHIEVEMENTS;
}

export const useHistoriaStore = create<HistoriaStore>((set, get) => ({
  passport: MOCK_PASSPORT,
  parades: MOCK_PARADES,
  achievements: MOCK_ACHIEVEMENTS,
  memories: [],
  letters: [],
  timeline: MOCK_TIMELINE,
  wrapped: null,
  isLoading: false,

  loadData: (userId) => {
    set({
      passport: { ...MOCK_PASSPORT, userId },
      parades: MOCK_PARADES,
      achievements: MOCK_ACHIEVEMENTS,
      timeline: MOCK_TIMELINE,
    });
  },

  addParade: (paradeData) => {
    const newParade: UserParade = {
      ...paradeData,
      id: `parade-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set(s => ({
      parades: [newParade, ...s.parades],
      passport: { ...s.passport, paradesCount: s.passport.paradesCount + 1, xp: s.passport.xp + 100 },
    }));
  },

  removeParade: (id) => {
    set(s => ({ parades: s.parades.filter(p => p.id !== id) }));
  },

  addMemory: (memoryData) => {
    const newMemory: UserMemory = {
      ...memoryData,
      id: `memory-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set(s => ({ memories: [newMemory, ...s.memories] }));
  },

  toggleFavoriteMemory: (id) => {
    set(s => ({
      memories: s.memories.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m),
    }));
  },

  addLetter: (letterData) => {
    const newLetter: FutureLetter = {
      ...letterData,
      id: `letter-${Date.now()}`,
      isOpened: false,
      createdAt: new Date().toISOString(),
    };
    set(s => ({ letters: [newLetter, ...s.letters] }));
  },

  loadWrapped: (year) => {
    set({ wrapped: { ...MOCK_WRAPPED, year } });
  },

  getProgressToNextLevel: () => {
    const { passport } = get();
    const { LEVEL_NAMES } = require('../types/historia');
    const current = LEVEL_NAMES.find((l: any) => passport.xp >= l.min && passport.xp <= l.max);
    if (!current) return 100;
    if (current.max === 999999) return 100;
    const range = current.max - current.min;
    const progress = passport.xp - current.min;
    return Math.round((progress / range) * 100);
  },

  getLockedAchievements: () => {
    const { achievements } = get();
    const unlockedKeys = achievements.map(a => a.key);
    return ALL_ACHIEVEMENTS.filter(a => !unlockedKeys.includes(a.key));
  },
}));
