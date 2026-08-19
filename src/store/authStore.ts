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
  register: (email: string, password: string, name: string) => Promise<{ needsEmailConfirmation: boolean } | void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  initAuth: () => () => void;
  checkAdminStatus: (userId: string) => Promise<boolean>;
  checkMembership: (userId: string) => Promise<boolean>;
}

const parseError = (message: string): string => {
  if (message.includes('Invalid login')) return 'E-mail ou senha inválidos.';
  if (message.includes('already registered')) return 'E-mail já cadastrado.';
  if (message.includes('Password should be')) return 'Senha fraca (mínimo 6 caracteres).';
  if (message.includes('Email not confirmed')) return 'Confirme seu email antes de entrar. Verifique sua caixa de entrada.';
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
        isPremium: true, // TEMP: app 100% free durante revisão da Apple/Google
        isAdmin: false, // será atualizado por checkAdminStatus logo em seguida
        coins: 50, level: 1, xp: 0,
      },
      isAuthenticated: true, isLoading: false,
    });
    useAuthStore.getState().checkAdminStatus(data.user.id);
    // Criar/atualizar perfil no Supabase
    try {
      const { supabase: sb } = await import('../services/supabase');
      await sb.from('user_profiles').upsert({
        id: data.user.id,
        display_name: data.user.user_metadata?.display_name ?? email.split('@')[0],
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id', ignoreDuplicates: true });
    } catch (e) { console.log('profile upsert error:', e); }
  },

  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { display_name: name } },
    });
    if (error) { set({ error: parseError(error.message), isLoading: false }); return; }

    // Se o Supabase exige confirmação de email, a sessão vem null
    if (!data.session) {
      set({ isLoading: false });
      return { needsEmailConfirmation: true };
    }

    set({
      user: {
        id: data.user!.id,
        email,
        displayName: name,
        isPremium: true, isAdmin: false, coins: 50, level: 1, xp: 0,
        memberNumber: `MV-${Math.floor(10000 + Math.random() * 90000)}`,
      },
      isAuthenticated: true, isLoading: false,
    });
    return { needsEmailConfirmation: false };
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

  checkAdminStatus: async (userId: string) => {
    try {
      const { supabase } = await import('../services/supabase');
      const { data } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();
      const isAdmin = !!data;
      const currentUser = useAuthStore.getState().user;
      if (currentUser && currentUser.isAdmin !== isAdmin) {
        useAuthStore.setState({ user: { ...currentUser, isAdmin } });
      }
      return isAdmin;
    } catch (e) {
      console.log('checkAdminStatus error:', e);
      return false;
    }
  },

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
      const isPremium = true; // TEMP: app 100% free durante revisão da Apple/Google
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
            isPremium: true, isAdmin: false, coins: 50, level: 1, xp: 0,
          },
          isAuthenticated: true, isLoading: false,
        });
        useAuthStore.getState().checkAdminStatus(session.user.id);
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
            isPremium: true, isAdmin: false, coins: 50, level: 1, xp: 0,
          },
          isAuthenticated: true, isLoading: false,
        });
        useAuthStore.getState().checkAdminStatus(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => subscription.unsubscribe();
  },
}));
