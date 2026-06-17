import { create } from 'zustand';
import { CommunityPost, Reel, Comment, MOCK_POSTS, MOCK_REELS, MOCK_COMMENTS, MOCK_RANKING, CommunityProfile } from '../types/community';

interface CommunityStore {
  posts: CommunityPost[];
  featuredPosts: CommunityPost[];
  reels: Reel[];
  comments: Comment[];
  ranking: CommunityProfile[];
  activeCategory: string;
  activeFilter: string;
  searchQuery: string;
  isLoading: boolean;
  pendingPosts: CommunityPost[];

  loadPosts: () => void;
  setCategory: (cat: string) => void;
  setFilter: (filter: string) => void;
  setSearch: (q: string) => void;
  toggleLike: (postId: string, userId: string) => void;
  toggleReelLike: (reelId: string, userId: string) => void;
  submitPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'views' | 'commentsCount' | 'status' | 'createdAt' | 'isFeatured' | 'isOfficial'>) => void;
  getFiltered: () => CommunityPost[];
  getByCategory: (cat: string) => CommunityPost[];

  // Comentários
  getCommentsFor: (postId: string) => Comment[];
  addComment: (postId: string, userId: string, userName: string, text: string) => void;
  toggleCommentLike: (commentId: string, userId: string) => void;
}

export const useCommunityStore = create<CommunityStore>((set, get) => ({
  posts: [],
  featuredPosts: [],
  reels: [],
  comments: [],
  ranking: [],
  activeCategory: 'all',
  activeFilter: 'recent',
  searchQuery: '',
  isLoading: false,
  pendingPosts: [],

  loadPosts: () => {
    const approved = MOCK_POSTS.filter(p => p.status === 'approved');
    set({
      posts: approved,
      featuredPosts: approved.filter(p => p.isFeatured),
      reels: MOCK_REELS,
      comments: MOCK_COMMENTS,
      ranking: MOCK_RANKING,
    });
  },

  setCategory: (cat) => set({ activeCategory: cat }),
  setFilter: (filter) => set({ activeFilter: filter }),
  setSearch: (q) => set({ searchQuery: q }),

  toggleLike: (postId, userId) => {
    set(state => ({
      posts: state.posts.map(p => {
        if (p.id !== postId) return p;
        const liked = p.likes.includes(userId);
        return { ...p, likes: liked ? p.likes.filter(u => u !== userId) : [...p.likes, userId] };
      }),
    }));
  },

  toggleReelLike: (reelId, userId) => {
    set(state => ({
      reels: state.reels.map(r => {
        if (r.id !== reelId) return r;
        const liked = r.likes.includes(userId);
        return { ...r, likes: liked ? r.likes.filter(u => u !== userId) : [...r.likes, userId] };
      }),
    }));
  },

  submitPost: (postData) => {
    const newPost: CommunityPost = {
      ...postData,
      id: `post-${Date.now()}`,
      likes: [],
      views: 0,
      commentsCount: 0,
      status: 'pending',
      isFeatured: false,
      isOfficial: false,
      createdAt: new Date().toISOString(),
    };
    set(state => ({ pendingPosts: [newPost, ...state.pendingPosts] }));
  },

  getFiltered: () => {
    const { posts, activeCategory, activeFilter, searchQuery } = get();
    let result = [...posts];
    if (activeCategory !== 'all') result = result.filter(p => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.userName.toLowerCase().includes(q));
    }
    if (activeFilter === 'popular') result.sort((a, b) => b.likes.length - a.likes.length);
    else if (activeFilter === 'most_viewed') result.sort((a, b) => b.views - a.views);
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  },

  getByCategory: (cat) => get().posts.filter(p => p.category === cat),

  getCommentsFor: (postId) => {
    return get().comments
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addComment: (postId, userId, userName, text) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      userId,
      userName,
      text,
      createdAt: new Date().toISOString(),
      likes: [],
    };
    set(state => ({
      comments: [newComment, ...state.comments],
      posts: state.posts.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p),
      reels: state.reels.map(r => r.id === postId ? { ...r, commentsCount: r.commentsCount + 1 } : r),
    }));
  },

  toggleCommentLike: (commentId, userId) => {
    set(state => ({
      comments: state.comments.map(c => {
        if (c.id !== commentId) return c;
        const liked = c.likes.includes(userId);
        return { ...c, likes: liked ? c.likes.filter(u => u !== userId) : [...c.likes, userId] };
      }),
    }));
  },
}));
