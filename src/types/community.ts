export type PostStatus = 'pending' | 'approved' | 'rejected' | 'archived';
export type PostCategory = 'carnaval' | 'ensaio' | 'show' | 'evento' | 'bastidores' | 'premiacao' | 'viagem' | 'comemoracao';
export type MediaType = 'photo' | 'video';
export type BadgeType = 'fotografo' | 'cinegrafista' | 'colaborador_ouro' | 'guardiao' | 'embaixador';

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  title: string;
  description: string;
  mediaType: MediaType;
  mediaURL: string;
  thumbnailURL?: string;
  category: PostCategory;
  relatedYear?: number;
  relatedEventId?: string;
  status: PostStatus;
  likes: string[];
  views: number;
  commentsCount: number;
  isFeatured: boolean;
  isOfficial: boolean;
  createdAt: string;
  approvedAt?: string;
}

export interface CommunityProfile {
  userId: string;
  displayName: string;
  photoURL?: string;
  city?: string;
  bio?: string;
  postsCount: number;
  likesReceived: number;
  badges: BadgeType[];
  joinedAt: string;
}

export interface CommunityBadge {
  key: BadgeType;
  title: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
}

export const CATEGORY_CONFIG: Record<PostCategory, { label: string; emoji: string; color: string }> = {
  carnaval: { label: 'Carnaval', emoji: '🎭', color: '#00FF85' },
  ensaio: { label: 'Ensaio', emoji: '🥁', color: '#4FC3F7' },
  show: { label: 'Show', emoji: '🎤', color: '#FF4081' },
  evento: { label: 'Evento', emoji: '🎉', color: '#FFD700' },
  bastidores: { label: 'Bastidores', emoji: '🎬', color: '#9C27B0' },
  premiacao: { label: 'Premiação', emoji: '🏆', color: '#FFD700' },
  viagem: { label: 'Viagem', emoji: '✈️', color: '#4FC3F7' },
  comemoracao: { label: 'Comemoração', emoji: '🥳', color: '#FF9800' },
};

export const BADGES: Record<BadgeType, CommunityBadge> = {
  fotografo: { key: 'fotografo', title: 'Fotógrafo Oficial', description: '5 fotos aprovadas', icon: '📸', color: '#00FF85', requirement: '5 fotos aprovadas' },
  cinegrafista: { key: 'cinegrafista', title: 'Cinegrafista da Mancha', description: '3 vídeos aprovados', icon: '🎥', color: '#4FC3F7', requirement: '3 vídeos aprovados' },
  colaborador_ouro: { key: 'colaborador_ouro', title: 'Colaborador Ouro', description: '20 contribuições aprovadas', icon: '🏅', color: '#FFD700', requirement: '20 contribuições' },
  guardiao: { key: 'guardiao', title: 'Guardião da História', description: 'Contribuiu para o acervo histórico', icon: '🛡️', color: '#9C27B0', requirement: 'Acervo histórico' },
  embaixador: { key: 'embaixador', title: 'Embaixador da Comunidade', description: 'Top 10 colaboradores', icon: '⭐', color: '#FF9800', requirement: 'Top 10' },
};

export const MOCK_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    userId: 'user-official',
    userName: 'Mancha Verde Oficial',
    title: 'Desfile 2023 — Tricampeonato!',
    description: 'A noite histórica do tricampeonato. Que emoção indescritível! 🏆🐍',
    mediaType: 'photo',
    mediaURL: '',
    category: 'carnaval',
    relatedYear: 2023,
    status: 'approved',
    likes: ['user1', 'user2', 'user3', 'user4', 'user5'],
    views: 4820,
    commentsCount: 47,
    isFeatured: true,
    isOfficial: true,
    createdAt: '2023-02-20T03:00:00Z',
  },
  {
    id: 'post-2',
    userId: 'user-roberto',
    userName: 'Roberto Alves',
    title: 'Ensaio técnico — janeiro 2026',
    description: 'Que ensaio incrível! A bateria está arrasando para o carnaval 2026 🥁🔥',
    mediaType: 'photo',
    mediaURL: '',
    category: 'ensaio',
    relatedYear: 2026,
    status: 'approved',
    likes: ['user1', 'user2'],
    views: 892,
    commentsCount: 12,
    isFeatured: false,
    isOfficial: false,
    createdAt: '2026-01-10T20:00:00Z',
  },
  {
    id: 'post-3',
    userId: 'user-ana',
    userName: 'Ana Cristina',
    title: 'Bastidores do Show de Lançamento',
    description: 'Tudo pronto para o grande show! Nervos à flor da pele 😍🎤',
    mediaType: 'photo',
    mediaURL: '',
    category: 'bastidores',
    status: 'approved',
    likes: ['user1', 'user2', 'user3'],
    views: 1240,
    commentsCount: 23,
    isFeatured: true,
    isOfficial: false,
    createdAt: '2026-01-08T19:00:00Z',
  },
  {
    id: 'post-4',
    userId: 'user-marcos',
    userName: 'Marcos Silva',
    title: 'Fantasia da Ala das Deusas 2025',
    description: 'Orgulho de desfilar pela Mancha! A fantasia ficou incrível 🎭✨',
    mediaType: 'photo',
    mediaURL: '',
    category: 'carnaval',
    relatedYear: 2025,
    status: 'approved',
    likes: ['user1'],
    views: 654,
    commentsCount: 8,
    isFeatured: false,
    isOfficial: false,
    createdAt: '2025-03-05T10:00:00Z',
  },
  {
    id: 'post-5',
    userId: 'user-oficial2',
    userName: 'Mancha Verde Oficial',
    title: 'Premiação — Melhor Bateria 2025',
    description: 'Mais um troféu para a nossa história! Josi Morais é o melhor! 🏆🥁',
    mediaType: 'photo',
    mediaURL: '',
    category: 'premiacao',
    relatedYear: 2025,
    status: 'approved',
    likes: ['u1','u2','u3','u4','u5','u6','u7','u8'],
    views: 6500,
    commentsCount: 89,
    isFeatured: true,
    isOfficial: true,
    createdAt: '2025-03-06T02:00:00Z',
  },
  {
    id: 'post-6',
    userId: 'user-julia',
    userName: 'Julia Ferreira',
    title: 'Meu primeiro desfile! 😭💚',
    description: 'Jamais vou esquecer essa noite. Chorei do início ao fim. Amo a Mancha!',
    mediaType: 'photo',
    mediaURL: '',
    category: 'carnaval',
    status: 'approved',
    likes: ['u1','u2','u3','u4'],
    views: 1890,
    commentsCount: 34,
    isFeatured: false,
    isOfficial: false,
    createdAt: '2025-03-02T23:00:00Z',
  },
];

export const MOCK_RANKING: CommunityProfile[] = [
  { userId: 'user-roberto', displayName: 'Roberto Alves', city: 'São Paulo', postsCount: 23, likesReceived: 456, badges: ['fotografo', 'colaborador_ouro'], joinedAt: '2020-01-01' },
  { userId: 'user-ana', displayName: 'Ana Cristina', city: 'Guarulhos', postsCount: 18, likesReceived: 312, badges: ['fotografo', 'cinegrafista'], joinedAt: '2021-03-15' },
  { userId: 'user-marcos', displayName: 'Marcos Silva', city: 'São Paulo', postsCount: 15, likesReceived: 278, badges: ['fotografo'], joinedAt: '2019-06-20' },
  { userId: 'user-julia', displayName: 'Julia Ferreira', city: 'Santo André', postsCount: 12, likesReceived: 198, badges: ['fotografo'], joinedAt: '2022-01-10' },
  { userId: 'user-pedro', displayName: 'Pedro Santos', city: 'São Paulo', postsCount: 9, likesReceived: 145, badges: [], joinedAt: '2023-05-01' },
];
