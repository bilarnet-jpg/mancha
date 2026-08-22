import { create } from 'zustand';
import {
  Card, Certificate, PublicTribute, SpecialDate, CardTemplate,
  MOCK_TEMPLATES, MOCK_TRIBUTES, CertificateType, CardCategory,
  CERTIFICATE_CONFIG,
} from '../types/cards';

interface CardsStore {
  templates: CardTemplate[];
  myCards: Card[];
  myCertificates: Certificate[];
  tributes: PublicTribute[];
  specialDates: SpecialDate[];
  selectedTemplate: CardTemplate | null;
  activeCategory: CardCategory | 'all';
  isLoading: boolean;

  loadTemplates: () => void;
  loadTributes: () => void;
  selectTemplate: (id: string) => void;
  setCategory: (cat: CardCategory | 'all') => void;

  createCard: (data: {
    userId: string;
    templateId: string;
    category: CardCategory;
    recipientName: string;
    recipientEmail?: string;
    message: string;
    senderName: string;
    isPublic: boolean;
    scheduledAt?: string;
  }) => Card;

  issueCertificate: (data: {
    userId: string;
    recipientName: string;
    type: CertificateType;
    eventName?: string;
    issuerName: string;
  }) => Certificate;

  addTribute: (tribute: Omit<PublicTribute, 'id' | 'likes' | 'createdAt'>) => void;
  toggleTributeLike: (tributeId: string, userId: string) => void;

  addSpecialDate: (date: Omit<SpecialDate, 'id'>) => void;
  removeSpecialDate: (id: string) => void;

  getFilteredTemplates: () => CardTemplate[];
  getUpcomingDates: () => SpecialDate[];
}

const generateValidationCode = () =>
  `MV-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString(36).toUpperCase().slice(-4)}`;

export const useCardsStore = create<CardsStore>((set, get) => ({
  templates: [],
  myCards: [],
  myCertificates: [],
  tributes: [],
  specialDates: [],
  selectedTemplate: null,
  activeCategory: 'all',
  isLoading: false,

  loadTemplates: async () => {
    set({ templates: MOCK_TEMPLATES });
    try {
      const { supabase } = await import('../services/supabase');
      const { data } = await supabase.from('card_templates').select('*').eq('is_active', true).order('created_at', { ascending: false });
      const realTemplates: CardTemplate[] = (data ?? []).map((row: any) => ({
        id: row.id,
        category: row.category,
        name: row.name,
        description: row.description,
        emoji: '💌',
        gradient: ['#134227', '#0A1F14'],
        accentColor: '#00FF85',
        isPremium: row.is_premium,
        tags: [],
        imageUrl: row.image_url,
      }));
      set(s => ({ templates: [...realTemplates, ...s.templates] }));
    } catch (e) {
      console.log('loadTemplates supabase error:', e);
    }
  },
  loadTributes: () => set({ tributes: MOCK_TRIBUTES }),

  selectTemplate: (id) => {
    const { templates } = get();
    const tpl = templates.find(t => t.id === id) ?? MOCK_TEMPLATES.find(t => t.id === id) ?? null;
    set({ selectedTemplate: tpl });
  },

  setCategory: (cat) => set({ activeCategory: cat }),

  createCard: (data) => {
    const card: Card = {
      ...data,
      id: `card-${Date.now()}`,
      status: data.scheduledAt ? 'scheduled' : 'sent',
      shareURL: `manchacarnaval.app/card/${Date.now()}`,
      createdAt: new Date().toISOString(),
      sentAt: data.scheduledAt ? undefined : new Date().toISOString(),
    };
    set(s => ({ myCards: [card, ...s.myCards] }));

    // Salvar no Supabase e disparar email real
    (async () => {
      try {
        const { supabase } = await import('../services/supabase');
        const { templates } = get();
        const tpl = templates.find(t => t.id === data.templateId);

        await supabase.from('sent_cards').insert({
          user_id: data.userId,
          template_id: data.templateId,
          template_name: tpl?.name ?? '',
          template_image_url: tpl?.imageUrl ?? null,
          category: data.category,
          recipient_name: data.recipientName,
          recipient_email: data.recipientEmail ?? null,
          message: data.message,
          sender_name: data.senderName,
          is_public: data.isPublic,
        });

        if (data.recipientEmail) {
          const { data: userData } = await supabase.auth.getUser();
          await supabase.functions.invoke('send-card-email', {
            body: {
              recipientName: data.recipientName,
              recipientEmail: data.recipientEmail,
              senderName: data.senderName,
              senderEmail: userData?.user?.email,
              message: data.message,
              templateName: tpl?.name ?? '',
              templateImageUrl: tpl?.imageUrl ?? null,
            },
          });
        }
      } catch (e) {
        console.log('createCard supabase/email error:', e);
      }
    })();

    return card;
  },

  issueCertificate: (data) => {
    const cfg = CERTIFICATE_CONFIG[data.type];
    const cert: Certificate = {
      id: `cert-${Date.now()}`,
      userId: data.userId,
      recipientName: data.recipientName,
      type: data.type,
      title: cfg.title,
      description: cfg.description,
      eventName: data.eventName,
      issuedAt: new Date().toISOString(),
      validationCode: generateValidationCode(),
      isOfficial: true,
      issuerName: data.issuerName,
    };
    set(s => ({ myCertificates: [cert, ...s.myCertificates] }));
    return cert;
  },

  addTribute: (tribute) => {
    const newTribute: PublicTribute = {
      ...tribute,
      id: `tr-${Date.now()}`,
      likes: [],
      createdAt: new Date().toISOString(),
    };
    set(s => ({ tributes: [newTribute, ...s.tributes] }));
  },

  toggleTributeLike: (tributeId, userId) => {
    set(s => ({
      tributes: s.tributes.map(t => {
        if (t.id !== tributeId) return t;
        const liked = t.likes.includes(userId);
        return { ...t, likes: liked ? t.likes.filter(u => u !== userId) : [...t.likes, userId] };
      }),
    }));
  },

  addSpecialDate: (date) => {
    const newDate: SpecialDate = { ...date, id: `date-${Date.now()}` };
    set(s => ({ specialDates: [newDate, ...s.specialDates] }));
  },

  removeSpecialDate: (id) => {
    set(s => ({ specialDates: s.specialDates.filter(d => d.id !== id) }));
  },

  getFilteredTemplates: () => {
    const { templates, activeCategory } = get();
    if (activeCategory === 'all') return templates;
    return templates.filter(t => t.category === activeCategory);
  },

  getUpcomingDates: () => {
    const { specialDates } = get();
    const now = new Date();
    return specialDates
      .filter(d => d.isActive)
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        dateA.setFullYear(now.getFullYear());
        dateB.setFullYear(now.getFullYear());
        return dateA.getTime() - dateB.getTime();
      });
  },
}));
