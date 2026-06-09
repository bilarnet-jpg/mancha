export type AchievementRarity = 'comum' | 'raro' | 'épico' | 'lendário';
export type ParadeRole = 'componente' | 'destaque' | 'bateria' | 'comissao_frente' | 'direcao' | 'outro';

export interface UserParade {
  id: string;
  userId: string;
  year: number;
  enredo: string;
  ala: string;
  role: ParadeRole;
  notes?: string;
  photoURLs: string[];
  createdAt: string;
}

export interface UserCostume {
  id: string;
  userId: string;
  year: number;
  name: string;
  ala: string;
  description?: string;
  photoURLs: string[];
  curiosities?: string;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  xpReward: number;
  unlockedAt: string;
  category: 'participacao' | 'comunidade' | 'historia' | 'especial';
}

export interface UserMemory {
  id: string;
  userId: string;
  title: string;
  description: string;
  mediaURL?: string;
  relatedYear?: number;
  relatedEventId?: string;
  isFavorite: boolean;
  type: 'foto' | 'video' | 'samba' | 'evento' | 'historia';
  createdAt: string;
}

export interface FutureLetter {
  id: string;
  userId: string;
  title: string;
  content: string;
  openAt: Date;
  isOpened: boolean;
  theme: string;
  createdAt: string;
}

export interface UserPassport {
  userId: string;
  level: number;
  xp: number;
  totalXP: number;
  eventsAttended: number;
  paradesCount: number;
  photosApproved: number;
  likesReceived: number;
  yearJoined: number;
  achievements: string[];
  currentStreak: number;
  lastVisit: string;
}

export interface WrappedData {
  year: number;
  eventsAttended: number;
  photosShared: number;
  likesReceived: number;
  sambasPlayed: number;
  achievementsUnlocked: number;
  topCategory: string;
  firstEvent: string;
  totalXP: number;
}

export interface TimelineEntry {
  year: number;
  entries: TimelineItem[];
}

export interface TimelineItem {
  id: string;
  type: 'parade' | 'event' | 'achievement' | 'photo' | 'memory';
  title: string;
  description: string;
  emoji: string;
  date: string;
  data?: any;
}

// CONQUISTAS DISPONÍVEIS
export const ALL_ACHIEVEMENTS = [
  { key: 'primeira_participacao', title: 'Primeira Participação', description: 'Confirmou presença no primeiro evento', icon: '🥁', rarity: 'comum' as AchievementRarity, xpReward: 50, category: 'participacao' as const },
  { key: 'primeiro_desfile', title: 'Primeiro Desfile', description: 'Registrou seu primeiro desfile', icon: '🎭', rarity: 'raro' as AchievementRarity, xpReward: 150, category: 'participacao' as const },
  { key: 'primeira_foto', title: 'Primeira Foto Publicada', description: 'Teve a primeira foto aprovada', icon: '📸', rarity: 'comum' as AchievementRarity, xpReward: 75, category: 'comunidade' as const },
  { key: 'cinco_anos', title: '5 Anos de Mancha', description: 'Membro há 5 anos', icon: '🏅', rarity: 'épico' as AchievementRarity, xpReward: 300, category: 'especial' as const },
  { key: 'dez_anos', title: '10 Anos de Mancha', description: 'Membro há 10 anos', icon: '🏆', rarity: 'lendário' as AchievementRarity, xpReward: 1000, category: 'especial' as const },
  { key: 'guardiao', title: 'Guardião da História', description: 'Contribuiu com o acervo histórico', icon: '🛡️', rarity: 'épico' as AchievementRarity, xpReward: 250, category: 'historia' as const },
  { key: 'embaixador', title: 'Embaixador da Comunidade', description: 'Top 10 colaboradores', icon: '⭐', rarity: 'lendário' as AchievementRarity, xpReward: 500, category: 'comunidade' as const },
  { key: 'lenda', title: 'Lenda da Mancha', description: 'Desbloqueou todas as conquistas', icon: '👑', rarity: 'lendário' as AchievementRarity, xpReward: 2000, category: 'especial' as const },
];

export const RARITY_COLORS = {
  comum: '#A0A0A0',
  raro: '#4FC3F7',
  épico: '#9C27B0',
  lendário: '#FFD700',
};

export const LEVEL_NAMES = [
  { min: 0, max: 99, name: 'Novato', emoji: '🌱' },
  { min: 100, max: 299, name: 'Torcedor', emoji: '💚' },
  { min: 300, max: 699, name: 'Integrante', emoji: '🥁' },
  { min: 700, max: 1499, name: 'Veterano', emoji: '🎭' },
  { min: 1500, max: 2999, name: 'Guardião', emoji: '🛡️' },
  { min: 3000, max: 999999, name: 'Lenda da Mancha', emoji: '👑' },
];

export const getLevelInfo = (xp: number) => {
  return LEVEL_NAMES.find(l => xp >= l.min && xp <= l.max) ?? LEVEL_NAMES[0];
};

// MOCK DATA
export const MOCK_PASSPORT: UserPassport = {
  userId: 'mock-user-1',
  level: 3,
  xp: 420,
  totalXP: 420,
  eventsAttended: 7,
  paradesCount: 2,
  photosApproved: 4,
  likesReceived: 67,
  yearJoined: 2022,
  achievements: ['primeira_participacao', 'primeiro_desfile', 'primeira_foto'],
  currentStreak: 5,
  lastVisit: new Date().toISOString(),
};

export const MOCK_PARADES: UserParade[] = [
  {
    id: 'parade-1',
    userId: 'mock-user-1',
    year: 2025,
    enredo: 'Do Verde que Sangra, Nasce a Chama',
    ala: 'Ala das Deusas',
    role: 'componente',
    notes: 'Meu segundo desfile! Emoção indescritível.',
    photoURLs: [],
    createdAt: '2025-03-02T00:00:00Z',
  },
  {
    id: 'parade-2',
    userId: 'mock-user-1',
    year: 2023,
    enredo: 'Verde Eterno: O Samba Que o Coração Guarda',
    ala: 'Ala dos Novos Guerreiros',
    role: 'componente',
    notes: 'Meu primeiro desfile! Nunca vou esquecer.',
    photoURLs: [],
    createdAt: '2023-02-19T00:00:00Z',
  },
];

export const MOCK_ACHIEVEMENTS: UserAchievement[] = [
  { id: 'ua-1', key: 'primeira_participacao', title: 'Primeira Participação', description: 'Confirmou presença no primeiro evento', icon: '🥁', rarity: 'comum', xpReward: 50, unlockedAt: '2022-01-15T00:00:00Z', category: 'participacao' },
  { id: 'ua-2', key: 'primeiro_desfile', title: 'Primeiro Desfile', description: 'Registrou seu primeiro desfile', icon: '🎭', rarity: 'raro', xpReward: 150, unlockedAt: '2023-02-19T00:00:00Z', category: 'participacao' },
  { id: 'ua-3', key: 'primeira_foto', title: 'Primeira Foto Publicada', description: 'Teve a primeira foto aprovada', icon: '📸', rarity: 'comum', xpReward: 75, unlockedAt: '2023-03-01T00:00:00Z', category: 'comunidade' },
];

export const MOCK_TIMELINE: TimelineEntry[] = [
  {
    year: 2025,
    entries: [
      { id: 't1', type: 'parade', title: 'Desfile Carnaval 2025', description: 'Ala das Deusas — "Do Verde que Sangra"', emoji: '🎭', date: '2025-03-02', data: MOCK_PARADES[0] },
      { id: 't2', type: 'event', title: 'Show de Lançamento 2025', description: 'Sambódromo do Anhembi', emoji: '🎤', date: '2025-01-20', data: null },
      { id: 't3', type: 'achievement', title: 'Conquista desbloqueada', description: 'Primeira Foto Publicada 📸', emoji: '🏅', date: '2025-03-01', data: null },
    ],
  },
  {
    year: 2023,
    entries: [
      { id: 't4', type: 'parade', title: 'Desfile Carnaval 2023 — TRICAMPEONATO!', description: 'Ala dos Novos Guerreiros', emoji: '🏆', date: '2023-02-19', data: MOCK_PARADES[1] },
      { id: 't5', type: 'achievement', title: 'Conquista desbloqueada', description: 'Primeiro Desfile 🎭', emoji: '🥁', date: '2023-02-19', data: null },
    ],
  },
  {
    year: 2022,
    entries: [
      { id: 't6', type: 'event', title: 'Primeiro ensaio na Quadra', description: 'O início de tudo!', emoji: '🥁', date: '2022-01-15', data: null },
      { id: 't7', type: 'achievement', title: 'Conquista desbloqueada', description: 'Primeira Participação 🥁', emoji: '🏅', date: '2022-01-15', data: null },
    ],
  },
];

export const MOCK_WRAPPED: WrappedData = {
  year: 2025,
  eventsAttended: 5,
  photosShared: 3,
  likesReceived: 47,
  sambasPlayed: 28,
  achievementsUnlocked: 1,
  topCategory: 'Carnaval',
  firstEvent: 'Ensaio Técnico de Janeiro',
  totalXP: 175,
};
