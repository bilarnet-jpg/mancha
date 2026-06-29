import { create } from 'zustand';
import { supabase } from '../services/supabase';

interface User {
  id: string;
  email: string;
  displayName: string;
  isPremium: boolean;
  isAdmin: boolean;
  coins: number;
  level: number;
  xp: number;
  memberNumber?: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  initAuth: () => () => void;
  checkMembership: (userId: string) => Promise<boolean>;
}

const parseError = (message: string): string => {
  if (message.includes('Invalid login')) return 'E-mail ou senha inválidos.';
  if (message.includes('already registered')) return 'E-mail já cadastrado.';
  if (message.includes('Password should be')) return 'Senha fraca (mínimo 6 caracteres).';
  return 'Erro inesperado. Tente novamente.';
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { set({ error: parseError(error.message), isLoading: false }); return; }
    set({
      user: {
        id: data.user.id,
        email: data.user.email!,
        displayName: data.user.user_metadata?.display_name ?? 'Torcedor',
        isPremium: data.user.email === 'francobilar@gmail.com' || data.user.email?.includes('admin'),
        isAdmin: data.user.email === 'francobilar@gmail.com' || data.user.email?.includes('admin'),
        coins: 50, level: 1, xp: 0,
      },
      isAuthenticated: true, isLoading: false,
    });
  },

  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { display_name: name } },
    });
    if (error) { set({ error: parseError(error.message), isLoading: false }); return; }
    set({
      user: {
        id: data.user!.id,
        email,
        displayName: name,
        isPremium: false, isAdmin: false, coins: 50, level: 1, xp: 0,
        memberNumber: `MV-${Math.floor(10000 + Math.random() * 90000)}`,
      },
      isAuthenticated: true, isLoading: false,
    });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  resetPassword: async (email) => {
    set({ isLoading: true });
    await supabase.auth.resetPasswordForEmail(email);
    set({ isLoading: false });
  },

  clearError: () => set({ error: null }),

  checkMembership: async (userId: string) => {
    try {
      const { supabase } = await import('../services/supabase');
      const now = new Date().toISOString();
      const { data } = await supabase
        .from('memberships')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .gt('expires_at', now)
        .maybeSingle();
      const isPremium = !!data;
      const currentUser = useAuthStore.getState().user;
      if (currentUser && currentUser.isPremium !== isPremium) {
        useAuthStore.setState({ user: { ...currentUser, isPremium } });
      }
      // Atualizar socioStore com o plano correto
      if (isPremium) {
        const { useSocioStore } = await import('./socioStore');
        useSocioStore.getState().upgradePlan('mancha-verde-eu-sou' as any);
      }
      return isPremium;
    } catch (e) {
      console.log('checkMembership error:', e);
      return false;
    }
  },

  initAuth: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email!,
            displayName: session.user.user_metadata?.display_name ?? 'Torcedor',
            isPremium: false, isAdmin: false, coins: 50, level: 1, xp: 0,
          },
          isAuthenticated: true, isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email!,
            displayName: session.user.user_metadata?.display_name ?? 'Torcedor',
            isPremium: false, isAdmin: false, coins: 50, level: 1, xp: 0,
          },
          isAuthenticated: true, isLoading: false,
        });
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => subscription.unsubscribe();
  },
}));
