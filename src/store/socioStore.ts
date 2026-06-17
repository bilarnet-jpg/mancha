import { create } from 'zustand';
import {
  Membership, MembershipPlan, PremiumContent,
  MOCK_MEMBERSHIP, MOCK_BENEFITS, MOCK_PREMIUM_CONTENT,
  MOCK_HISTORY, PLANS, MembershipBenefit, MembershipHistory,
} from '../types/socio';

interface SocioStore {
  membership: Membership;
  benefits: MembershipBenefit[];
  premiumContent: PremiumContent[];
  history: MembershipHistory[];
  isLoading: boolean;

  loadData: (userId: string) => void;
  upgradePlan: (plan: MembershipPlan) => void;
  getActiveBenefits: () => MembershipBenefit[];
  getAvailableContent: () => PremiumContent[];
  getPlanConfig: () => typeof PLANS[0];
  getDaysUntilExpiry: () => number;
  getMemberSince: () => string;
  canAccessContent: (contentPlans: MembershipPlan[]) => boolean;
  getStoreDiscount: () => number;
  getEventsDiscount: () => number;
}

export const useSocioStore = create<SocioStore>((set, get) => ({
  membership: MOCK_MEMBERSHIP,
  benefits: MOCK_BENEFITS,
  premiumContent: MOCK_PREMIUM_CONTENT,
  history: MOCK_HISTORY,
  isLoading: false,

  loadData: (userId) => {
    set({ membership: { ...MOCK_MEMBERSHIP, userId } });
  },

  upgradePlan: (plan) => {
    set(s => ({ membership: { ...s.membership, plan } }));
  },

  getActiveBenefits: () => {
    const { benefits, membership } = get();
    return benefits.filter(b => b.isActive && b.plans.includes(membership.plan));
  },

  getAvailableContent: () => {
    const { premiumContent, membership } = get();
    return premiumContent.filter(c => c.plans.includes(membership.plan));
  },

  getPlanConfig: () => {
    const { membership } = get();
    return PLANS.find(p => p.id === membership.plan) ?? PLANS[0];
  },

  getDaysUntilExpiry: () => {
    const { membership } = get();
    const expiry = new Date(membership.expiryDate);
    const now = new Date();
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  },

  getMemberSince: () => {
    const { membership } = get();
    const joined = new Date(membership.joinedAt);
    return joined.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  },

  canAccessContent: (contentPlans) => {
    const { membership } = get();
    return contentPlans.includes(membership.plan);
  },

  getStoreDiscount: () => {
    const plan = get().getPlanConfig();
    return plan.discountStore;
  },

  getEventsDiscount: () => {
    const plan = get().getPlanConfig();
    return plan.discountEvents;
  },
}));
