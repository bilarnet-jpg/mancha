import { create } from 'zustand';
import { supabase } from '../services/supabase';
import {
  UserPassport, UserParade, UserAchievement, UserMemory,
  FutureLetter, TimelineEntry, TimelineItem, WrappedData,
  ALL_ACHIEVEMENTS,
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

  loadData: (userId: string) => Promise<void>;
  addParade: (parade: Omit<UserParade, 'id' | 'createdAt'>) => Promise<void>;
  removeParade: (id: string) => Promise<void>;
  addMemory: (memory: Omit<UserMemory, 'id' | 'createdAt'>) => Promise<void>;
  toggleFavoriteMemory: (id: string) => Promise<void>;
  addLetter: (letter: Omit<FutureLetter, 'id' | 'isOpened' | 'createdAt'>) => Promise<void>;
  loadWrapped: (year: number) => void;
  getProgressToNextLevel: () => number;
  getLockedAchievements: () => typeof ALL_ACHIEVEMENTS;
}

const XP_PER_PARADE = 100;
const emptyPassport = (userId: string): UserPassport => ({
  userId, level: 1, xp: 0, totalXP: 0, eventsAttended: 0, paradesCount: 0,
  photosApproved: 0, likesReceived: 0, yearJoined: new Date().getFullYear(),
  achievements: [], currentStreak: 0, lastVisit: new Date().toISOString(),
});

export const useHistoriaStore = create<HistoriaStore>((set, get) => ({
  passport: emptyPassport('mock'),
  parades: [],
  achievements: [],
  memories: [],
  letters: [],
  timeline: [],
  wrapped: null,
  isLoading: false,

  loadData: async (userId) => {
    set({ isLoading: true });
    try {
      const { data: paradesData } = await supabase.from('user_parades').select('*').eq('user_id', userId).order('year', { ascending: false });
      const parades: UserParade[] = (paradesData ?? []).map((p: any) => ({
        id: p.id, userId: p.user_id, year: p.year, enredo: p.enredo, ala: p.ala,
        role: p.role, notes: p.notes, photoURLs: p.photo_urls ?? [], createdAt: p.created_at,
      }));

      const { data: achData } = await supabase.from('user_achievements').select('*').eq('user_id', userId);
      const achievements: UserAchievement[] = (achData ?? []).map((a: any) => {
        const def = ALL_ACHIEVEMENTS.find(d => d.key === a.key);
        return {
          id: a.id, key: a.key, title: def?.title ?? a.key, description: def?.description ?? '',
          icon: def?.icon ?? '🏅', rarity: def?.rarity ?? 'comum', xpReward: def?.xpReward ?? 0,
          unlockedAt: a.unlocked_at, category: def?.category ?? 'especial',
        };
      });

      const { data: memoriesData } = await supabase.from('user_memories').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      const memories: UserMemory[] = (memoriesData ?? []).map((m: any) => ({
        id: m.id, userId: m.user_id, title: m.title, description: m.description,
        mediaURL: m.media_url, relatedYear: m.related_year, isFavorite: m.is_favorite,
        type: m.type, createdAt: m.created_at,
      }));

      const { data: lettersData } = await supabase.from('future_letters').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      const letters: FutureLetter[] = (lettersData ?? []).map((l: any) => ({
        id: l.id, userId: l.user_id, title: l.title, content: l.content,
        openAt: new Date(l.open_at), isOpened: l.is_opened, theme: l.theme, createdAt: l.created_at,
      }));

      const totalXP = parades.length * XP_PER_PARADE + achievements.reduce((sum, a) => sum + a.xpReward, 0);
      const passport: UserPassport = {
        userId, level: 1, xp: totalXP, totalXP,
        eventsAttended: 0, paradesCount: parades.length, photosApproved: 0, likesReceived: 0,
        yearJoined: parades.length > 0 ? Math.min(...parades.map(p => p.year)) : new Date().getFullYear(),
        achievements: achievements.map(a => a.key), currentStreak: 0, lastVisit: new Date().toISOString(),
      };

      const timelineMap: Record<number, TimelineItem[]> = {};
      parades.forEach(p => {
        if (!timelineMap[p.year]) timelineMap[p.year] = [];
        timelineMap[p.year].push({ id: p.id, type: 'parade', title: `Desfile Carnaval ${p.year}`, description: `${p.ala} — "${p.enredo}"`, emoji: '🎭', date: p.createdAt, data: p });
      });
      achievements.forEach(a => {
        const year = new Date(a.unlockedAt).getFullYear();
        if (!timelineMap[year]) timelineMap[year] = [];
        timelineMap[year].push({ id: a.id, type: 'achievement', title: 'Conquista desbloqueada', description: `${a.title} ${a.icon}`, emoji: '🏅', date: a.unlockedAt, data: null });
      });
      const timeline: TimelineEntry[] = Object.keys(timelineMap)
        .map(y => parseInt(y, 10))
        .sort((a, b) => b - a)
        .map(year => ({ year, entries: timelineMap[year].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) }));

      set({ passport, parades, achievements, memories, letters, timeline, isLoading: false });
    } catch (e) {
      console.log('historiaStore loadData error:', e);
      set({ isLoading: false });
    }
  },

  addParade: async (paradeData) => {
    const { error } = await supabase.from('user_parades').insert({
      user_id: paradeData.userId, year: paradeData.year, enredo: paradeData.enredo,
      ala: paradeData.ala, role: paradeData.role, notes: paradeData.notes ?? null,
      photo_urls: paradeData.photoURLs ?? [],
    });
    if (error) { console.log('addParade error:', error); throw error; }

    if (get().parades.length === 0) {
      await supabase.from('user_achievements').insert({ user_id: paradeData.userId, key: 'primeiro_desfile' }).select().then(() => {});
    }

    await get().loadData(paradeData.userId);
  },

  removeParade: async (id) => {
    const { parades } = get();
    const parade = parades.find(p => p.id === id);
    await supabase.from('user_parades').delete().eq('id', id);
    if (parade) await get().loadData(parade.userId);
  },

  addMemory: async (memoryData) => {
    const { error } = await supabase.from('user_memories').insert({
      user_id: memoryData.userId, title: memoryData.title, description: memoryData.description,
      media_url: memoryData.mediaURL ?? null, related_year: memoryData.relatedYear ?? null,
      is_favorite: memoryData.isFavorite ?? false, type: memoryData.type,
    });
    if (error) { console.log('addMemory error:', error); throw error; }
    await get().loadData(memoryData.userId);
  },

  toggleFavoriteMemory: async (id) => {
    const { memories } = get();
    const memory = memories.find(m => m.id === id);
    if (!memory) return;
    await supabase.from('user_memories').update({ is_favorite: !memory.isFavorite }).eq('id', id);
    set(s => ({ memories: s.memories.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m) }));
  },

  addLetter: async (letterData) => {
    const { error } = await supabase.from('future_letters').insert({
      user_id: letterData.userId, title: letterData.title, content: letterData.content,
      open_at: letterData.openAt.toISOString(), theme: letterData.theme,
    });
    if (error) { console.log('addLetter error:', error); throw error; }
    await get().loadData(letterData.userId);
  },

  loadWrapped: (year) => {
    const { parades, memories, achievements } = get();
    const yearParades = parades.filter(p => p.year === year);
    set({
      wrapped: {
        year,
        eventsAttended: yearParades.length,
        photosShared: memories.filter(m => m.relatedYear === year && m.type === 'foto').length,
        likesReceived: 0,
        sambasPlayed: 0,
        achievementsUnlocked: achievements.filter(a => new Date(a.unlockedAt).getFullYear() === year).length,
        topCategory: 'Carnaval',
        firstEvent: yearParades[yearParades.length - 1]?.enredo ?? '—',
        totalXP: get().passport.xp,
      },
    });
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
