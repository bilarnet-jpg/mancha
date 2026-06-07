export type EventCategory = 'carnaval' | 'ensaio' | 'show' | 'evento' | 'reuniao' | 'workshop';
export type TicketType = 'gratuito' | 'pago' | 'vip' | 'camarote' | 'premium' | 'fantasia';
export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'expired';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  bannerURL?: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  address: string;
  city: string;
  mapsURL?: string;
  capacity?: number;
  confirmedCount: number;
  isFeatured: boolean;
  isFree: boolean;
  isPremiumOnly: boolean;
  isRecurring: boolean;
  status: 'active' | 'cancelled' | 'sold_out' | 'finished';
  ticketTypes: TicketType[];
  createdAt: string;
}

export interface TicketTypeConfig {
  id: string;
  eventId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold: number;
  type: TicketType;
  deadline?: string;
  lot: number;
  benefits?: string[];
  isActive: boolean;
}

export interface Order {
  id: string;
  userId: string;
  eventId: string;
  ticketTypeId: string;
  ticketTypeName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'pix' | 'free';
  pixCode?: string;
  pixQRCode?: string;
  pixExpiry?: string;
  tickets: Ticket[];
  createdAt: string;
  paidAt?: string;
}

export interface Ticket {
  id: string;
  orderId: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  ticketType: TicketType;
  ticketTypeName: string;
  holderName: string;
  qrCode: string;
  code: string;
  status: 'active' | 'used' | 'cancelled' | 'expired';
  checkedInAt?: string;
  checkedInBy?: string;
  createdAt: string;
}

export interface PIXTransaction {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  pixKey: string;
  pixCode: string;
  qrCodeImage?: string;
  status: PaymentStatus;
  provider: 'mercadopago' | 'pagbank' | 'asaas' | 'manual';
  expiresAt: string;
  paidAt?: string;
  createdAt: string;
}

// Mock data
export const MOCK_EVENTS: Event[] = [
  {
    id: 'evt-1',
    title: 'Ensaio Técnico — Mancha Verde',
    description: 'Ensaio técnico oficial da Mancha Verde para o Carnaval 2026. Toda a bateria, alas e destaques reunidos para o grande treino antes do desfile.',
    category: 'ensaio',
    date: '2026-01-15',
    time: '20:00',
    endTime: '23:00',
    location: 'Quadra da Mancha Verde',
    address: 'Rua Cantareira, 520 — Limão',
    city: 'São Paulo',
    mapsURL: 'https://maps.google.com',
    capacity: 3000,
    confirmedCount: 847,
    isFeatured: true,
    isFree: false,
    isPremiumOnly: false,
    isRecurring: true,
    status: 'active',
    ticketTypes: ['pago', 'vip'],
    createdAt: '2025-12-01',
  },
  {
    id: 'evt-2',
    title: 'Show de Lançamento do Samba 2026',
    description: 'A grande festa oficial de lançamento do samba-enredo da Mancha Verde para o Carnaval 2026. Uma noite histórica com shows, revelações e muita energia.',
    category: 'show',
    date: '2026-01-22',
    time: '19:00',
    endTime: '02:00',
    location: 'Sambódromo do Anhembi',
    address: 'Av. Olavo Fontoura, 1209',
    city: 'São Paulo',
    capacity: 10000,
    confirmedCount: 4230,
    isFeatured: true,
    isFree: false,
    isPremiumOnly: false,
    isRecurring: false,
    status: 'active',
    ticketTypes: ['pago', 'vip', 'camarote'],
    createdAt: '2025-12-01',
  },
  {
    id: 'evt-3',
    title: 'Reunião Geral de Membros',
    description: 'Reunião oficial para todos os membros da Mancha Verde. Pauta: planejamento do Carnaval 2026, eleições e novidades.',
    category: 'reuniao',
    date: '2026-01-10',
    time: '15:00',
    location: 'Sede da Mancha Verde',
    address: 'Rua Cantareira, 520',
    city: 'São Paulo',
    confirmedCount: 156,
    isFeatured: false,
    isFree: true,
    isPremiumOnly: false,
    isRecurring: false,
    status: 'active',
    ticketTypes: ['gratuito'],
    createdAt: '2025-12-01',
  },
  {
    id: 'evt-4',
    title: 'Desfile Oficial — Carnaval 2026',
    description: 'O grande desfile oficial da Mancha Verde no Carnaval de São Paulo 2026. O espetáculo mais esperado do ano!',
    category: 'carnaval',
    date: '2026-02-28',
    time: '23:00',
    location: 'Sambódromo do Anhembi',
    address: 'Av. Olavo Fontoura, 1209',
    city: 'São Paulo',
    capacity: 30000,
    confirmedCount: 12800,
    isFeatured: true,
    isFree: false,
    isPremiumOnly: false,
    isRecurring: false,
    status: 'active',
    ticketTypes: ['pago', 'vip', 'camarote', 'fantasia'],
    createdAt: '2025-12-01',
  },
];

export const MOCK_TICKET_TYPES: TicketTypeConfig[] = [
  {
    id: 'tt-1', eventId: 'evt-1',
    name: 'Entrada Geral', description: 'Acesso à área geral do ensaio',
    price: 35, quantity: 2000, sold: 847, type: 'pago', lot: 1, isActive: true,
  },
  {
    id: 'tt-2', eventId: 'evt-1',
    name: 'VIP', description: 'Área VIP com open bar e vista privilegiada',
    price: 120, quantity: 200, sold: 87, type: 'vip', lot: 1,
    benefits: ['Open bar', 'Área exclusiva', 'Meet & greet'], isActive: true,
  },
  {
    id: 'tt-3', eventId: 'evt-2',
    name: 'Pista', description: 'Acesso à pista do show',
    price: 80, quantity: 6000, sold: 3100, type: 'pago', lot: 2, isActive: true,
  },
  {
    id: 'tt-4', eventId: 'evt-2',
    name: 'Camarote Premium', description: 'Camarote com serviço completo',
    price: 350, quantity: 500, sold: 280, type: 'camarote', lot: 1,
    benefits: ['Serviço de garçom', 'Open food', 'Open bar premium', 'Vista panorâmica'], isActive: true,
  },
  {
    id: 'tt-5', eventId: 'evt-3',
    name: 'Entrada Gratuita', description: 'Entrada gratuita para membros',
    price: 0, quantity: 500, sold: 156, type: 'gratuito', lot: 1, isActive: true,
  },
];

export const CATEGORY_CONFIG: Record<EventCategory, { label: string; emoji: string; color: string }> = {
  carnaval: { label: 'Carnaval', emoji: '🎭', color: '#00FF85' },
  ensaio: { label: 'Ensaio', emoji: '🥁', color: '#4FC3F7' },
  show: { label: 'Show', emoji: '🎤', color: '#FF4081' },
  evento: { label: 'Evento', emoji: '🎉', color: '#FFD700' },
  reuniao: { label: 'Reunião', emoji: '🤝', color: '#A0A0A0' },
  workshop: { label: 'Workshop', emoji: '🎓', color: '#9C27B0' },
};
