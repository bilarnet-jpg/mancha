import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { CommunityPost, Reel, Comment, MOCK_REELS, MOCK_COMMENTS, MOCK_RANKING, CommunityProfile } from '../types/community';

interface CommunityStore {
  posts: CommunityPost[];
  featuredPosts: CommunityPost[];
  reels: Reel[];
  comments: Comment[];
  ranking: CommunityProfile[];
  isLoading: boolean;
  pendingPosts: CommunityPost[];
  activeTab: string;
  searchQuery: string;
  activeCategory: string;

  loadPosts: () => Promise<void>;
  submitPost: (post: any) => Promise<void>;
  getFiltered: () => CommunityPost[];
  getByCategory: (cat: string) => CommunityPost[];
  setActiveTab: (tab: string) => void;
  setSearch: (q: string) => void;
  setCategory: (cat: string) => void;
  toggleLike: (postId: string, userId: string) => Promise<void>;
  toggleReelLike: (reelId: string, userId: string) => void;
  getCommentsFor: (postId: string) => Comment[];
  addComment: (postId: string, userId: string, userName: string, text: string) => Promise<void>;
  toggleCommentLike: (commentId: string, userId: string) => void;
}

export const useCommunityStore = create<CommunityStore>((set, get) => ({
  posts: [],
  featuredPosts: [],
  reels: MOCK_REELS,
  comments: MOCK_COMMENTS,
  ranking: MOCK_RANKING,
  isLoading: false,
  pendingPosts: [],
  activeTab: 'recent',
  searchQuery: '',
  activeCategory: 'todos',

  loadPosts: async () => {
    set({ isLoading: true });
    try {
      // Carregar posts mock como base
      const { MOCK_POSTS } = await import('../types/community');
      const mockApproved = MOCK_POSTS.filter(p => p.status === 'approved');

      // Carregar posts reais do Supabase
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      const realPosts: CommunityPost[] = (data ?? []).map(p => ({
        id: p.id,
        userId: p.user_id,
        userName: p.user_name,
        userAvatar: p.user_avatar,
        title: p.title,
        description: p.description ?? '',
        category: p.category,
        mediaUrl: p.media_url ?? '',
        mediaType: p.media_type ?? 'photo',
        likes: [],
        likesCount: p.likes_count ?? 0,
        commentsCount: p.comments_count ?? 0,
        views: 0,
        status: 'approved' as const,
        createdAt: p.created_at,
        isFeatured: false,
        isOfficial: false,
      }));

      // Combinar posts reais + mock
      const allPosts = [...realPosts, ...mockApproved];
      set({
        posts: allPosts,
        featuredPosts: allPosts.slice(0, 3),
        isLoading: false,
      });
    } catch (e) {
      console.log('loadPosts error:', e);
      const { MOCK_POSTS } = await import('../types/community');
      const approved = MOCK_POSTS.filter(p => p.status === 'approved');
      set({ posts: approved, featuredPosts: approved.filter(p => p.isFeatured), isLoading: false });
    }
  },

  submitPost: async (post) => {
    try {
      // Admin não precisa de aprovação
      const { useAuthStore } = await import('./authStore');
      const isAdmin = useAuthStore.getState().user?.isAdmin ?? false;

      const { data } = await supabase
        .from('posts')
        .insert({
          user_id: post.userId,
          user_name: post.userName,
          user_avatar: post.userAvatar,
          title: post.title,
          description: post.description,
          category: post.category,
          media_url: post.mediaUrl,
          media_type: post.mediaType,
          is_approved: isAdmin, // Admin aprova automaticamente
        })
        .select()
        .single();

      if (data) {
        const newPost: CommunityPost = {
          id: data.id, userId: data.user_id, userName: data.user_name,
          title: data.title, description: data.description ?? '',
          category: data.category, mediaUrl: data.media_url ?? '',
          mediaType: data.media_type, likes: [], likesCount: 0,
          commentsCount: 0, views: 0, status: 'pending',
          createdAt: data.created_at, isFeatured: false, isOfficial: false,
        };
        set(s => ({ pendingPosts: [newPost, ...s.pendingPosts] }));
      }
    } catch (e) {
      console.log('submitPost error:', e);
    }
  },

  getFiltered: () => {
    const { posts, searchQuery, activeCategory, activeTab } = get();
    let filtered = posts;
    if (searchQuery) filtered = filtered.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.userName.toLowerCase().includes(searchQuery.toLowerCase()));
    if (activeCategory !== 'todos') filtered = filtered.filter(p => p.category === activeCategory);
    if (activeTab === 'popular') filtered = [...filtered].sort((a, b) => (b.likesCount ?? 0) - (a.likesCount ?? 0));
    return filtered;
  },

  getByCategory: (cat) => get().posts.filter(p => p.category === cat),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearch: (q) => set({ searchQuery: q }),
  setCategory: (cat) => set({ activeCategory: cat }),

  toggleLike: async (postId, userId) => {
    const { posts } = get();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isLiked = post.likes.includes(userId);

    // Atualizar UI otimisticamente
    set(s => ({
      posts: s.posts.map(p => p.id === postId ? {
        ...p,
        likes: isLiked ? p.likes.filter(u => u !== userId) : [...p.likes, userId],
        likesCount: (p.likesCount ?? 0) + (isLiked ? -1 : 1),
      } : p)
    }));

    // Atualizar Supabase
    if (isLiked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId);
      await supabase.from('posts').update({ likes_count: (post.likesCount ?? 1) - 1 }).eq('id', postId);
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
      await supabase.from('posts').update({ likes_count: (post.likesCount ?? 0) + 1 }).eq('id', postId);
    }
  },

  toggleReelLike: (reelId, userId) => {
    set(s => ({
      reels: s.reels.map(r => r.id === reelId ? {
        ...r,
        likes: r.likes.includes(userId) ? r.likes.filter(u => u !== userId) : [...r.likes, userId],
      } : r)
    }));
  },

  getCommentsFor: (postId) => get().comments.filter(c => c.postId === postId),

  addComment: async (postId, userId, userName, text) => {
    try {
      await supabase.from('post_comments').insert({
        post_id: postId,
        user_id: userId,
        user_name: userName,
        content: text,
      });
      await supabase.from('posts').update({ comments_count: supabase.rpc('increment', { x: 1 }) }).eq('id', postId);
    } catch (e) {
      console.log('addComment error:', e);
    }
    // Adicionar localmente também
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      postId, userId, userName,
      text, likes: [],
      createdAt: new Date().toISOString(),
    };
    set(s => ({ comments: [...s.comments, newComment] }));
  },

  toggleCommentLike: (commentId, userId) => {
    set(s => ({
      comments: s.comments.map(c => c.id === commentId ? {
        ...c,
        likes: c.likes.includes(userId) ? c.likes.filter(u => u !== userId) : [...c.likes, userId],
      } : c)
    }));
  },
}));
