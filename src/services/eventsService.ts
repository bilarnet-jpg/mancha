import { supabase } from './supabase';
import { Event, Order, Ticket, MOCK_TICKET_TYPES } from '../types/events';

const USE_MOCK = false;

const generateCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();
const generateQR = (code: string) => `MANCHA-${code}-${Date.now()}`;

// Converte snake_case do banco para camelCase usado no app
const mapEvent = (row: any): Event => ({
  id: row.id,
  title: row.title,
  description: row.description,
  category: row.category,
  bannerURL: row.banner_url,
  date: row.date,
  time: row.time,
  endTime: row.end_time,
  location: row.location,
  address: row.address,
  city: row.city,
  mapsURL: row.maps_url,
  capacity: row.capacity,
  confirmedCount: row.confirmed_count ?? 0,
  isFeatured: row.is_featured ?? false,
  isFree: row.is_free ?? true,
  isPremiumOnly: row.is_premium_only ?? false,
  isRecurring: row.is_recurring ?? false,
  status: row.status ?? 'active',
  ticketTypes: row.ticket_types ?? [],
  createdAt: row.created_at,
});

export const eventsService = {
  getAll: async (): Promise<Event[]> => {
    const { data, error } = await supabase.from('mancha_events').select('*').order('date', { ascending: true });
    if (error) { console.log('getAll events error:', error); return []; }
    return (data ?? []).map(mapEvent);
  },

  getFeatured: async (): Promise<Event[]> => {
    const { data, error } = await supabase.from('mancha_events').select('*').eq('is_featured', true).order('date', { ascending: true }).limit(5);
    if (error) { console.log('getFeatured events error:', error); return []; }
    return (data ?? []).map(mapEvent);
  },

  getById: async (id: string): Promise<Event | null> => {
    const { data, error } = await supabase.from('mancha_events').select('*').eq('id', id).single();
    if (error) { console.log('getById event error:', error); return null; }
    return data ? mapEvent(data) : null;
  },

  getTicketTypes: async (eventId: string) => {
    if (USE_MOCK) return MOCK_TICKET_TYPES.filter(t => t.eventId === eventId);
    const { data } = await supabase.from('mancha_ticket_types').select('*').eq('event_id', eventId).eq('is_active', true);
    return data ?? [];
  },

  createFreeOrder: async (userId: string, eventId: string, ticketTypeId: string, holderName: string): Promise<Order> => {
    const event = await eventsService.getById(eventId);
    const ticketType = MOCK_TICKET_TYPES.find(t => t.id === ticketTypeId)!;
    const code = generateCode();
    const ticket: Ticket = {
      id: `ticket-${Date.now()}`,
      orderId: `order-${Date.now()}`,
      userId,
      eventId,
      eventTitle: event?.title ?? '',
      eventDate: event?.date ?? '',
      eventTime: event?.time ?? '',
      eventLocation: event?.location ?? '',
      ticketType: ticketType.type,
      ticketTypeName: ticketType.name,
      holderName,
      qrCode: generateQR(code),
      code,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    const order: Order = {
      id: ticket.orderId,
      userId,
      eventId,
      ticketTypeId,
      ticketTypeName: ticketType.name,
      eventTitle: event?.title ?? '',
      eventDate: event?.date ?? '',
      eventLocation: event?.location ?? '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      status: 'paid',
      paymentStatus: 'paid',
      paymentMethod: 'free',
      tickets: [ticket],
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    };

    return order;
  },

  createPixOrder: async (userId: string, eventId: string, ticketTypeId: string, holderName: string): Promise<Order> => {
    const event = await eventsService.getById(eventId);
    const ticketType = MOCK_TICKET_TYPES.find(t => t.id === ticketTypeId)!;

    const pixCode = `00020126580014BR.GOV.BCB.PIX0136mancha-carnaval@pix.com.br5204000053039865802BR5925MANCHA CARNAVAL EVENTOS6009SAO PAULO62290525MANCHA${Date.now()}6304ABCD`;

    const order: Order = {
      id: `order-${Date.now()}`,
      userId,
      eventId,
      ticketTypeId,
      ticketTypeName: ticketType.name,
      eventTitle: event?.title ?? '',
      eventDate: event?.date ?? '',
      eventLocation: event?.location ?? '',
      quantity: 1,
      unitPrice: ticketType.price,
      totalPrice: ticketType.price,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'pix',
      pixCode,
      pixExpiry: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      tickets: [],
      createdAt: new Date().toISOString(),
    };

    return order;
  },

  getUserTickets: async (userId: string): Promise<Ticket[]> => {
    const { data } = await supabase.from('mancha_tickets').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    return data ?? [];
  },

  getUserOrders: async (userId: string): Promise<Order[]> => {
    const { data } = await supabase.from('mancha_orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    return data ?? [];
  },
};
