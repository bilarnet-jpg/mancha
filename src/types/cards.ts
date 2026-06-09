export type CardCategory = 'aniversario' | 'carnaval' | 'data_especial' | 'homenagem' | 'evento' | 'certificado';
export type CardStatus = 'draft' | 'sent' | 'scheduled' | 'delivered';
export type CertificateType = 'participacao' | 'destaque' | 'guardiao' | 'embaixador' | 'colaborador';

export interface CardTemplate {
  id: string;
  category: CardCategory;
  name: string;
  description: string;
  emoji: string;
  gradient: string[];
  accentColor: string;
  isPremium: boolean;
  tags: string[];
}

export interface Card {
  id: string;
  userId: string;
  templateId: string;
  category: CardCategory;
  recipientName: string;
  recipientEmail?: string;
  message: string;
  senderName: string;
  scheduledAt?: string;
  sentAt?: string;
  status: CardStatus;
  isPublic: boolean;
  shareURL?: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  recipientName: string;
  type: CertificateType;
  title: string;
  description: string;
  eventName?: string;
  issuedAt: string;
  validationCode: string;
  isOfficial: boolean;
  issuerName: string;
}

export interface PublicTribute {
  id: string;
  userId: string;
  userName: string;
  recipientName: string;
  message: string;
  category: CardCategory;
  emoji: string;
  likes: string[];
  createdAt: string;
  isOfficial: boolean;
}

export interface SpecialDate {
  id: string;
  userId: string;
  name: string;
  personName: string;
  date: string;
  type: 'aniversario' | 'data_especial';
  reminderDays: number;
  isActive: boolean;
}

export const CARD_CATEGORY_CONFIG: Record<CardCategory, { label: string; emoji: string; color: string; description: string }> = {
  aniversario: { label: 'Aniversário', emoji: '🎂', color: '#FF4081', description: 'Celebre mais um ano de vida!' },
  carnaval: { label: 'Carnaval', emoji: '🎭', color: '#00FF85', description: 'Energia e samba pra todo o Brasil!' },
  data_especial: { label: 'Data Especial', emoji: '🎉', color: '#FFD700', description: 'Momentos que ficam para sempre' },
  homenagem: { label: 'Homenagem', emoji: '❤️', color: '#9C27B0', description: 'Gratidão e reconhecimento' },
  evento: { label: 'Evento', emoji: '🎤', color: '#4FC3F7', description: 'Convites e celebrações' },
  certificado: { label: 'Certificado', emoji: '🏅', color: '#FFD700', description: 'Reconhecimento oficial' },
};

export const CERTIFICATE_CONFIG: Record<CertificateType, { title: string; description: string; icon: string; color: string }> = {
  participacao: { title: 'Certificado de Participação', description: 'Participou oficialmente do evento', icon: '🏅', color: '#00FF85' },
  destaque: { title: 'Destaque da Comunidade', description: 'Reconhecido como destaque da comunidade Mancha Verde', icon: '⭐', color: '#FFD700' },
  guardiao: { title: 'Guardião da História', description: 'Contribuiu para a preservação da memória da Mancha Verde', icon: '🛡️', color: '#9C27B0' },
  embaixador: { title: 'Embaixador da Mancha', description: 'Representa com orgulho os valores da Mancha Verde', icon: '👑', color: '#FFD700' },
  colaborador: { title: 'Colaborador Oficial', description: 'Colaborador reconhecido pela comunidade Mancha Carnaval', icon: '🤝', color: '#4FC3F7' },
};

export const MOCK_TEMPLATES: CardTemplate[] = [
  { id: 'tpl-1', category: 'aniversario', name: 'Feliz Aniversário Verde', description: 'Celebração com energia da Mancha', emoji: '🎂', gradient: ['#1a0d2e', '#0d3d1a'], accentColor: '#FF4081', isPremium: false, tags: ['aniversario', 'celebracao'] },
  { id: 'tpl-2', category: 'aniversario', name: 'Axé no Novo Ciclo', description: 'Energia e samba no aniversário', emoji: '🥁', gradient: ['#0d3d1a', '#051a0a'], accentColor: '#00FF85', isPremium: false, tags: ['aniversario', 'samba'] },
  { id: 'tpl-3', category: 'carnaval', name: 'Boa Sorte no Desfile', description: 'Energia positiva para o desfile', emoji: '🎭', gradient: ['#0d3d1a', '#1a5c2a'], accentColor: '#00FF85', isPremium: false, tags: ['carnaval', 'desfile'] },
  { id: 'tpl-4', category: 'carnaval', name: 'Parabéns pelo Desfile', description: 'Celebre a conquista no Anhembi', emoji: '🏆', gradient: ['#1a1000', '#0a0800'], accentColor: '#FFD700', isPremium: false, tags: ['carnaval', 'conquista'] },
  { id: 'tpl-5', category: 'data_especial', name: 'Feliz Natal Mancha', description: 'Natal com espírito verde', emoji: '🎄', gradient: ['#0d3d1a', '#1a0d00'], accentColor: '#FFD700', isPremium: false, tags: ['natal', 'festas'] },
  { id: 'tpl-6', category: 'data_especial', name: 'Feliz Ano Novo', description: 'Que venha 2026 com muito samba!', emoji: '🎆', gradient: ['#0d0d2a', '#1a0d2e'], accentColor: '#818CF8', isPremium: false, tags: ['ano_novo', 'festas'] },
  { id: 'tpl-7', category: 'homenagem', name: 'Gratidão Especial', description: 'Para quem faz a diferença', emoji: '❤️', gradient: ['#1a0533', '#0d021a'], accentColor: '#9C27B0', isPremium: false, tags: ['homenagem', 'gratidao'] },
  { id: 'tpl-8', category: 'homenagem', name: 'Destaque da Comunidade', description: 'Reconhecimento merecido', emoji: '🏅', gradient: ['#1a1000', '#0a0800'], accentColor: '#FFD700', isPremium: true, tags: ['homenagem', 'destaque'] },
  { id: 'tpl-9', category: 'evento', name: 'Convite para Ensaio', description: 'Venha sambar com a gente!', emoji: '🥁', gradient: ['#0d1a33', '#051020'], accentColor: '#4FC3F7', isPremium: false, tags: ['evento', 'ensaio'] },
  { id: 'tpl-10', category: 'evento', name: 'Convite VIP', description: 'Experiência exclusiva te aguarda', emoji: '⭐', gradient: ['#1a1000', '#0a0800'], accentColor: '#FFD700', isPremium: true, tags: ['evento', 'vip'] },
];

export const MOCK_TRIBUTES: PublicTribute[] = [
  { id: 'tr-1', userId: 'user-official', userName: 'Mancha Verde Oficial', recipientName: 'Toda a Família Verde', message: 'Gratidão a cada integrante que faz a Mancha ser o que é. Vocês são nossa força! 💚🐍', category: 'homenagem', emoji: '❤️', likes: ['u1','u2','u3','u4','u5'], createdAt: '2026-01-05T10:00:00Z', isOfficial: true },
  { id: 'tr-2', userId: 'user-roberto', userName: 'Roberto Alves', recipientName: 'Josi Morais — Mestre da Bateria', message: 'O melhor mestre de bateria do Brasil! Obrigado por tudo que você representa! 🥁👑', category: 'homenagem', emoji: '🥁', likes: ['u1','u2','u3'], createdAt: '2026-01-03T15:00:00Z', isOfficial: false },
  { id: 'tr-3', userId: 'user-ana', userName: 'Ana Cristina', recipientName: 'Bateria da Mancha Verde', message: 'A melhor bateria do mundo! Cada ensaio é uma emoção diferente! 🥁🔥', category: 'carnaval', emoji: '🎭', likes: ['u1','u2'], createdAt: '2025-12-28T20:00:00Z', isOfficial: false },
];
