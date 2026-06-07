import { supabase } from './supabase';
import { Event, Order, Ticket, MOCK_EVENTS, MOCK_TICKET_TYPES } from '../types/events';

const USE_MOCK = true;

const generateCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();
const generateQR = (code: string) => `MANCHA-${code}-${Date.now()}`;

export const eventsService = {
  getAll: async (): Promise<Event[]> => {
    if (USE_MOCK) return MOCK_EVENTS;
    const { data } = await supabase.from('mancha_events').select('*').order('date', { ascending: true });
    return data ?? [];
  },

  getFeatured: async (): Promise<Event[]> => {
    if (USE_MOCK) return MOCK_EVENTS.filter(e => e.isFeatured);
    const { data } = await supabase.from('mancha_events').select('*').eq('is_featured', true).limit(5);
    return data ?? [];
  },

  getById: async (id: string): Promise<Event | null> => {
    if (USE_MOCK) return MOCK_EVENTS.find(e => e.id === id) ?? null;
    const { data } = await supabase.from('mancha_events').select('*').eq('id', id).single();
    return data;
  },

  getTicketTypes: async (eventId: string) => {
    if (USE_MOCK) return MOCK_TICKET_TYPES.filter(t => t.eventId === eventId);
    const { data } = await supabase.from('mancha_ticket_types').select('*').eq('event_id', eventId).eq('is_active', true);
    return data ?? [];
  },

  createFreeOrder: async (userId: string, eventId: string, ticketTypeId: string, holderName: string): Promise<Order> => {
    const event = MOCK_EVENTS.find(e => e.id === eventId)!;
    const ticketType = MOCK_TICKET_TYPES.find(t => t.id === ticketTypeId)!;
    const code = generateCode();
    const ticket: Ticket = {
      id: `ticket-${Date.now()}`,
      orderId: `order-${Date.now()}`,
      userId,
      eventId,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
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
      eventTitle: event.title,
      eventDate: event.date,
      eventLocation: event.location,
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

    if (!USE_MOCK) {
      await supabase.from('mancha_orders').insert(order);
      await supabase.from('mancha_tickets').insert(ticket);
    }

    return order;
  },

  createPixOrder: async (userId: string, eventId: string, ticketTypeId: string, holderName: string): Promise<Order> => {
    const event = MOCK_EVENTS.find(e => e.id === eventId)!;
    const ticketType = MOCK_TICKET_TYPES.find(t => t.id === ticketTypeId)!;

    // PIX simulado — substituir por Mercado Pago / Asaas em produção
    const pixCode = `00020126580014BR.GOV.BCB.PIX0136mancha-carnaval@pix.com.br5204000053039865802BR5925MANCHA CARNAVAL EVENTOS6009SAO PAULO62290525MANCHA${Date.now()}6304ABCD`;

    const order: Order = {
      id: `order-${Date.now()}`,
      userId,
      eventId,
      ticketTypeId,
      ticketTypeName: ticketType.name,
      eventTitle: event.title,
      eventDate: event.date,
      eventLocation: event.location,
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

    if (!USE_MOCK) {
      await supabase.from('mancha_orders').insert(order);
    }

    return order;
  },

  getUserTickets: async (userId: string): Promise<Ticket[]> => {
    if (USE_MOCK) return [];
    const { data } = await supabase.from('mancha_tickets').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    return data ?? [];
  },

  getUserOrders: async (userId: string): Promise<Order[]> => {
    if (USE_MOCK) return [];
    const { data } = await supabase.from('mancha_orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    return data ?? [];
  },
};
