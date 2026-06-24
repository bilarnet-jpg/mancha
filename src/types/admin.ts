export type AdminRole = 'super_admin' | 'financeiro' | 'conteudo' | 'moderacao' | 'comercial';

export interface AdminUser {
  id: string;
  displayName: string;
  email: string;
  role: AdminRole;
  isBlocked: boolean;
  createdAt: string;
  lastLogin?: string;
  xp: number;
  isPremium: boolean;
}

export interface AdminStats {
  totalUsers: number;
  newUsersToday: number;
  activeUsers: number;
  totalRevenue: number;
  revenueToday: number;
  pendingOrders: number;
  pendingPosts: number;
  alaShowRequests: number;
  socioAtivos: number;
  eventosAtivos: number;
}

export interface AdminOrder {
  id: string;
  userId: string;
  userName: string;
  type: 'loja' | 'ingresso' | 'socio';
  description: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  createdAt: string;
}

export interface AdminPost {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: string;
  mediaType: 'photo' | 'video';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reportCount: number;
}

export interface AdminAlaShowRequest {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  evento: string;
  data: string;
  convidados?: string;
  mensagem?: string;
  status: 'novo' | 'em_contato' | 'fechado' | 'cancelado';
  createdAt: string;
}

export const MOCK_ADMIN_STATS: AdminStats = {
  totalUsers: 1247,
  newUsersToday: 23,
  activeUsers: 389,
  totalRevenue: 48750,
  revenueToday: 1230,
  pendingOrders: 8,
  pendingPosts: 14,
  alaShowRequests: 3,
  socioAtivos: 234,
  eventosAtivos: 4,
};

export const MOCK_ADMIN_USERS: AdminUser[] = [
  { id: 'u1', displayName: 'Franco Bilar', email: 'franco@feelink.me', role: 'super_admin', isBlocked: false, createdAt: '2024-01-01', xp: 2500, isPremium: true },
  { id: 'u2', displayName: 'Roberto Alves', email: 'roberto@mancha.com', role: 'conteudo', isBlocked: false, createdAt: '2024-03-15', xp: 1200, isPremium: true },
  { id: 'u3', displayName: 'Ana Cristina', email: 'ana@mancha.com', role: 'moderacao', isBlocked: false, createdAt: '2024-06-20', xp: 890, isPremium: false },
  { id: 'u4', displayName: 'Marcos Silva', email: 'marcos@gmail.com', role: 'financeiro', isBlocked: false, createdAt: '2024-08-10', xp: 450, isPremium: true },
  { id: 'u5', displayName: 'Julia Ferreira', email: 'julia@gmail.com', role: 'comercial', isBlocked: false, createdAt: '2025-01-05', xp: 320, isPremium: false },
  { id: 'u6', displayName: 'Pedro Santos', email: 'pedro@gmail.com', role: 'moderacao', isBlocked: true, createdAt: '2025-02-14', xp: 120, isPremium: false },
];

export const MOCK_ADMIN_ORDERS: AdminOrder[] = [
  { id: 'ord-1', userId: 'u2', userName: 'Roberto Alves', type: 'socio', description: 'Plano Sócio Ouro — Mensal', amount: 49.90, status: 'paid', createdAt: '2026-06-19T08:00:00Z' },
  { id: 'ord-2', userId: 'u3', userName: 'Ana Cristina', type: 'ingresso', description: 'Ingresso Ensaio Técnico', amount: 35.00, status: 'paid', createdAt: '2026-06-19T07:30:00Z' },
  { id: 'ord-3', userId: 'u4', userName: 'Marcos Silva', type: 'loja', description: 'Camiseta Oficial 2026 (G)', amount: 89.90, status: 'pending', createdAt: '2026-06-19T06:00:00Z' },
  { id: 'ord-4', userId: 'u5', userName: 'Julia Ferreira', type: 'socio', description: 'Plano Sócio Prata — Mensal', amount: 29.90, status: 'paid', createdAt: '2026-06-18T22:00:00Z' },
  { id: 'ord-5', userId: 'u6', userName: 'Pedro Santos', type: 'loja', description: 'Boné Oficial Mancha Verde', amount: 59.90, status: 'cancelled', createdAt: '2026-06-18T20:00:00Z' },
];

export const MOCK_ADMIN_POSTS: AdminPost[] = [
  { id: 'p1', userId: 'u2', userName: 'Roberto Alves', title: 'Ensaio de janeiro incrível!', description: 'A bateria está arrasando...', category: 'ensaio', mediaType: 'photo', status: 'pending', createdAt: '2026-06-19T09:00:00Z', reportCount: 0 },
  { id: 'p2', userId: 'u3', userName: 'Ana Cristina', title: 'Fantasia nova 2027', description: 'Olha que linda ficou...', category: 'carnaval', mediaType: 'photo', status: 'pending', createdAt: '2026-06-19T08:30:00Z', reportCount: 0 },
  { id: 'p3', userId: 'u5', userName: 'Julia Ferreira', title: 'Meu primeiro desfile 😭', description: 'Jamais vou esquecer...', category: 'carnaval', mediaType: 'video', status: 'pending', createdAt: '2026-06-19T07:00:00Z', reportCount: 2 },
  { id: 'p4', userId: 'u6', userName: 'Pedro Santos', title: 'Conteúdo impróprio', description: 'Texto ofensivo aqui...', category: 'evento', mediaType: 'photo', status: 'pending', createdAt: '2026-06-18T23:00:00Z', reportCount: 5 },
];

export const MOCK_ALA_SHOW_REQUESTS: AdminAlaShowRequest[] = [
  { id: 'ala-1', nome: 'Carlos Mendes', email: 'carlos@techcorp.com', telefone: '(11) 99999-1111', empresa: 'TechCorp Brasil', evento: 'Festa de fim de ano corporativa', data: '15/12/2026', convidados: '300', mensagem: 'Queremos uma apresentação de 30 minutos com passistas e bateria.', status: 'novo', createdAt: '2026-06-19T10:00:00Z' },
  { id: 'ala-2', nome: 'Beatriz Lima', email: 'bia@eventos.com', telefone: '(11) 98888-2222', empresa: 'Eventos Premium SP', evento: 'Casamento temático carnaval', data: '20/03/2027', convidados: '150', status: 'em_contato', createdAt: '2026-06-18T15:00:00Z' },
  { id: 'ala-3', nome: 'Rodrigo Costa', email: 'rodrigo@festival.com', telefone: '(11) 97777-3333', empresa: 'Festival de Verão', evento: 'Show de abertura do festival', data: '10/01/2027', convidados: '2000', mensagem: 'Grande evento, precisamos do elenco completo.', status: 'novo', createdAt: '2026-06-17T12:00:00Z' },
];
