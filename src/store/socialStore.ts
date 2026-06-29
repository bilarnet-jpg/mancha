import { create } from 'zustand';
import { supabase } from '../services/supabase';

export interface UserProfile {
  id: string;
  display_name: string;
  bio?: string;
  city?: string;
  avatar_url?: string;
  alas?: string[];
  created_at?: string;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  profile?: UserProfile;
}

interface SocialStore {
  friends: Friendship[];
  pendingReceived: Friendship[];
  pendingSent: Friendship[];
  isLoading: boolean;

  loadFriendships: (userId: string) => Promise<void>;
  sendFriendRequest: (userId: string, friendId: string) => Promise<void>;
  acceptFriendRequest: (friendshipId: string) => Promise<void>;
  declineFriendRequest: (friendshipId: string) => Promise<void>;
  removeFriend: (friendshipId: string) => Promise<void>;
  getFriendshipStatus: (userId: string, friendId: string) => 'none' | 'pending_sent' | 'pending_received' | 'accepted';
  
  // Perfis
  getProfile: (userId: string) => Promise<UserProfile | null>;
  updateProfile: (userId: string, data: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (userId: string, uri: string) => Promise<string | null>;
}

export const useSocialStore = create<SocialStore>((set, get) => ({
  friends: [],
  pendingReceived: [],
  pendingSent: [],
  isLoading: false,

  loadFriendships: async (userId) => {
    set({ isLoading: true });
    try {
      const { data } = await supabase
        .from('friendships')
        .select('*')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

      if (data) {
        const friends = data.filter(f => f.status === 'accepted');
        const pendingReceived = data.filter(f => f.status === 'pending' && f.friend_id === userId);
        const pendingSent = data.filter(f => f.status === 'pending' && f.user_id === userId);
        set({ friends, pendingReceived, pendingSent });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  sendFriendRequest: async (userId, friendId) => {
    const { data, error } = await supabase
      .from('friendships')
      .insert({ user_id: userId, friend_id: friendId, status: 'pending' })
      .select()
      .single();
    if (data) {
      set(state => ({ pendingSent: [...state.pendingSent, data] }));
    }
  },

  acceptFriendRequest: async (friendshipId) => {
    await supabase
      .from('friendships')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', friendshipId);
    set(state => {
      const friendship = state.pendingReceived.find(f => f.id === friendshipId);
      if (!friendship) return state;
      return {
        pendingReceived: state.pendingReceived.filter(f => f.id !== friendshipId),
        friends: [...state.friends, { ...friendship, status: 'accepted' }],
      };
    });
  },

  declineFriendRequest: async (friendshipId) => {
    await supabase
      .from('friendships')
      .update({ status: 'declined', updated_at: new Date().toISOString() })
      .eq('id', friendshipId);
    set(state => ({
      pendingReceived: state.pendingReceived.filter(f => f.id !== friendshipId),
    }));
  },

  removeFriend: async (friendshipId) => {
    await supabase.from('friendships').delete().eq('id', friendshipId);
    set(state => ({
      friends: state.friends.filter(f => f.id !== friendshipId),
    }));
  },

  getFriendshipStatus: (userId, friendId) => {
    const { friends, pendingSent, pendingReceived } = get();
    if (friends.some(f => (f.user_id === userId && f.friend_id === friendId) || (f.user_id === friendId && f.friend_id === userId))) return 'accepted';
    if (pendingSent.some(f => f.friend_id === friendId)) return 'pending_sent';
    if (pendingReceived.some(f => f.user_id === friendId)) return 'pending_received';
    return 'none';
  },

  getProfile: async (userId) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    return data;
  },

  updateProfile: async (userId, profileData) => {
    await supabase
      .from('user_profiles')
      .upsert({ id: userId, ...profileData, updated_at: new Date().toISOString() });
  },

  uploadAvatar: async (userId, uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileExt = uri.split('.').pop() ?? 'jpg';
      const filePath = `avatars/${userId}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, { upsert: true, contentType: `image/${fileExt}` });
      
      if (error) throw error;
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (e) {
      console.log('uploadAvatar error:', e);
      return null;
    }
  },
}));
