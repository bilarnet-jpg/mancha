export type MembershipPlan = 'free' | 'prata' | 'ouro' | 'diamante';
export type MembershipStatus = 'active' | 'expired' | 'cancelled' | 'pending';

export interface MembershipPlanConfig {
  id: MembershipPlan;
  name: string;
  emoji: string;
  price: number;
  period: 'mensal' | 'anual';
  color: string;
  gradient: string[];
  benefits: string[];
  discountStore: number;
  discountEvents: number;
  isPremium: boolean;
  isPopular: boolean;
}

export interface Membership {
  id: string;
  userId: string;
  plan: MembershipPlan;
  status: MembershipStatus;
  memberNumber: string;
  startDate: string;
  expiryDate: string;
  autoRenew: boolean;
  qrCode: string;
  level: number;
  xp: number;
  totalPaid: number;
  joinedAt: string;
}

export interface MembershipBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'loja' | 'eventos' | 'conteudo' | 'exclusivo' | 'parceiro';
  plans: MembershipPlan[];
  discountValue?: number;
  discountType?: 'percent' | 'fixed';
  isActive: boolean;
}

export interface PremiumContent {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'foto' | 'audio' | 'documento' | 'bastidores';
  thumbnail?: string;
  plans: MembershipPlan[];
  duration?: string;
  publishedAt: string;
  views: number;
  isNew: boolean;
}

export interface MembershipHistory {
  id: string;
  userId: string;
  type: 'pagamento' | 'evento' | 'compra' | 'beneficio' | 'conquista';
  title: string;
  description: string;
  value?: number;
  date: string;
  icon: string;
}

export const PLANS: MembershipPlanConfig[] = [
  {
    id: 'free',
    name: 'Mancha Free',
    emoji: '🌱',
    price: 0,
    period: 'mensal',
    color: '#A0A0A0',
    gradient: ['#1a1a1a', '#0a0a0a'],
    benefits: [
      'Acesso ao app completo',
      'Galeria da comunidade',
      'Notícias e comunicados',
      'Agenda de eventos',
    ],
    discountStore: 0,
    discountEvents: 0,
    isPremium: false,
    isPopular: false,
  },
  {
    id: 'prata',
    name: 'Mancha Prata',
    emoji: '🥈',
    price: 19.90,
    period: 'mensal',
    color: '#C0C0C0',
    gradient: ['#1a1a2e', '#0d0d1a'],
    benefits: [
      'Tudo do Mancha Free',
      '5% desconto na loja',
      'Pré-venda de ingressos',
      'Conteúdo exclusivo básico',
      'Carteirinha digital Prata',
      'Badge exclusivo no perfil',
    ],
    discountStore: 5,
    discountEvents: 5,
    isPremium: true,
    isPopular: false,
  },
  {
    id: 'ouro',
    name: 'Mancha Ouro',
    emoji: '🥇',
    price: 39.90,
    period: 'mensal',
    color: '#FFD700',
    gradient: ['#1a1000', '#0a0800'],
    benefits: [
      'Tudo do Mancha Prata',
      '10% desconto na loja',
      '10% desconto em eventos',
      'Pré-venda de fantasias',
      'Vídeos e bastidores exclusivos',
      'Carteirinha digital Ouro',
      'Acesso a eventos VIP',
      'Suporte prioritário',
    ],
    discountStore: 10,
    discountEvents: 10,
    isPremium: true,
    isPopular: true,
  },
  {
    id: 'diamante',
    name: 'Mancha Diamante',
    emoji: '💎',
    price: 79.90,
    period: 'mensal',
    color: '#818CF8',
    gradient: ['#0d0d2a', '#05050a'],
    benefits: [
      'Tudo do Mancha Ouro',
      '20% desconto na loja',
      '15% desconto em eventos',
      'Acesso ilimitado a conteúdo premium',
      'Carteirinha digital Diamante',
      'Experiências VIP exclusivas',
      'Meet & Greet com artistas',
      'Camarote em eventos especiais',
      'Acesso antecipado a lançamentos',
      'Presente exclusivo anual',
    ],
    discountStore: 20,
    discountEvents: 15,
    isPremium: true,
    isPopular: false,
  },
];

export const MOCK_MEMBERSHIP: Membership = {
  id: 'memb-001',
  userId: 'mock-user-1',
  plan: 'ouro',
  status: 'active',
  memberNumber: 'MV-2026-04721',
  startDate: '2026-01-01',
  expiryDate: '2026-12-31',
  autoRenew: true,
  qrCode: 'MANCHA-MV-2026-04721-QR',
  level: 3,
  xp: 420,
  totalPaid: 359.10,
  joinedAt: '2022-01-15',
};

export const MOCK_BENEFITS: MembershipBenefit[] = [
  { id: 'b1', title: '10% na Loja Oficial', description: 'Desconto em todos os produtos da loja', icon: '🛍️', category: 'loja', plans: ['ouro', 'diamante'], discountValue: 10, discountType: 'percent', isActive: true },
  { id: 'b2', title: 'Pré-venda de Ingressos', description: 'Acesso 48h antes da abertura geral', icon: '🎟️', category: 'eventos', plans: ['prata', 'ouro', 'diamante'], isActive: true },
  { id: 'b3', title: 'Pré-venda de Fantasias', description: 'Reserve sua fantasia antes do público', icon: '🎭', category: 'eventos', plans: ['ouro', 'diamante'], isActive: true },
  { id: 'b4', title: 'Bastidores Exclusivos', description: 'Vídeos e fotos dos bastidores', icon: '🎬', category: 'conteudo', plans: ['ouro', 'diamante'], isActive: true },
  { id: 'b5', title: 'Camarote VIP', description: 'Acesso ao camarote em eventos especiais', icon: '🥂', category: 'exclusivo', plans: ['diamante'], isActive: true },
  { id: 'b6', title: 'Meet & Greet', description: 'Encontro com artistas e carnavalescos', icon: '🤝', category: 'exclusivo', plans: ['diamante'], isActive: true },
  { id: 'b7', title: '20% na Loja Oficial', description: 'O maior desconto disponível', icon: '💎', category: 'loja', plans: ['diamante'], discountValue: 20, discountType: 'percent', isActive: true },
  { id: 'b8', title: 'Badge Exclusivo', description: 'Badge especial no seu perfil', icon: '🏅', category: 'exclusivo', plans: ['prata', 'ouro', 'diamante'], isActive: true },
];

export const MOCK_PREMIUM_CONTENT: PremiumContent[] = [
  { id: 'pc1', title: 'Bastidores do Desfile 2025', description: 'Tudo o que aconteceu antes do grande desfile. Uma história emocionante!', type: 'video', plans: ['ouro', 'diamante'], duration: '18min', publishedAt: '2025-03-10T10:00:00Z', views: 2840, isNew: false },
  { id: 'pc2', title: 'Entrevista com o Carnavalesco', description: 'O carnavalesco conta todos os segredos do enredo vencedor de 2025', type: 'video', plans: ['ouro', 'diamante'], duration: '32min', publishedAt: '2025-04-01T10:00:00Z', views: 1920, isNew: false },
  { id: 'pc3', title: 'Galeria Exclusiva — Tricampeonato', description: 'Mais de 200 fotos exclusivas do histórico tricampeonato de 2023', type: 'foto', plans: ['prata', 'ouro', 'diamante'], publishedAt: '2026-01-10T10:00:00Z', views: 4500, isNew: true },
  { id: 'pc4', title: 'Documentário: 30 Anos de Mancha', description: 'A história completa da Mancha Verde em um documentário emocionante', type: 'video', plans: ['diamante'], duration: '1h 20min', publishedAt: '2025-12-01T10:00:00Z', views: 890, isNew: false },
  { id: 'pc5', title: 'Samba-enredo — Versão Estendida', description: 'A versão completa e sem cortes do samba-enredo 2026', type: 'audio', plans: ['prata', 'ouro', 'diamante'], duration: '12min', publishedAt: '2026-01-15T10:00:00Z', views: 3200, isNew: true },
];

export const MOCK_HISTORY: MembershipHistory[] = [
  { id: 'h1', userId: 'mock-user-1', type: 'pagamento', title: 'Assinatura Mancha Ouro', description: 'Renovação automática — Janeiro 2026', value: 39.90, date: '2026-01-01T10:00:00Z', icon: '💳' },
  { id: 'h2', userId: 'mock-user-1', type: 'beneficio', title: 'Desconto aplicado na Loja', description: '10% em Camisa Oficial Mancha Verde 2025', value: -8.99, date: '2025-12-15T14:00:00Z', icon: '🛍️' },
  { id: 'h3', userId: 'mock-user-1', type: 'evento', title: 'Pré-venda utilizada', description: 'Ingresso VIP — Show de Lançamento 2026', date: '2025-12-10T09:00:00Z', icon: '🎟️' },
  { id: 'h4', userId: 'mock-user-1', type: 'pagamento', title: 'Assinatura Mancha Ouro', description: 'Renovação automática — Dezembro 2025', value: 39.90, date: '2025-12-01T10:00:00Z', icon: '💳' },
];
