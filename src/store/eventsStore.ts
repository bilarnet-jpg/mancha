import { create } from 'zustand';
import { Event, Order, Ticket } from '../types/events';
import { eventsService } from '../services/eventsService';

interface EventsStore {
  events: Event[];
  featuredEvents: Event[];
  selectedEvent: Event | null;
  myTickets: Ticket[];
  myOrders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  activeCategory: string;

  loadEvents: () => Promise<void>;
  loadFeatured: () => Promise<void>;
  selectEvent: (id: string) => Promise<void>;
  setCategory: (cat: string) => void;
  buyFreeTicket: (userId: string, eventId: string, ticketTypeId: string, name: string) => Promise<Order>;
  buyPixTicket: (userId: string, eventId: string, ticketTypeId: string, name: string) => Promise<Order>;
  loadMyTickets: (userId: string) => Promise<void>;
  setCurrentOrder: (order: Order | null) => void;
  getFilteredEvents: () => Event[];
}

export const useEventsStore = create<EventsStore>((set, get) => ({
  events: [],
  featuredEvents: [],
  selectedEvent: null,
  myTickets: [],
  myOrders: [],
  currentOrder: null,
  isLoading: false,
  activeCategory: 'all',

  loadEvents: async () => {
    set({ isLoading: true });
    const data = await eventsService.getAll();
    set({ events: data, isLoading: false });
  },

  loadFeatured: async () => {
    const data = await eventsService.getFeatured();
    set({ featuredEvents: data });
  },

  selectEvent: async (id) => {
    set({ isLoading: true });
    const event = await eventsService.getById(id);
    set({ selectedEvent: event, isLoading: false });
  },

  setCategory: (cat) => set({ activeCategory: cat }),

  buyFreeTicket: async (userId, eventId, ticketTypeId, name) => {
    set({ isLoading: true });
    const order = await eventsService.createFreeOrder(userId, eventId, ticketTypeId, name);
    set({ currentOrder: order, isLoading: false });
    return order;
  },

  buyPixTicket: async (userId, eventId, ticketTypeId, name) => {
    set({ isLoading: true });
    const order = await eventsService.createPixOrder(userId, eventId, ticketTypeId, name);
    set({ currentOrder: order, isLoading: false });
    return order;
  },

  loadMyTickets: async (userId) => {
    const tickets = await eventsService.getUserTickets(userId);
    const orders = await eventsService.getUserOrders(userId);
    set({ myTickets: tickets, myOrders: orders });
  },

  setCurrentOrder: (order) => set({ currentOrder: order }),

  getFilteredEvents: () => {
    const { events, activeCategory } = get();
    if (activeCategory === 'all') return events;
    return events.filter(e => e.category === activeCategory);
  },
}));
