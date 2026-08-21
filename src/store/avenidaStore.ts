import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { SambaAtual, SambaHistorico, SambaPoll } from '../types/avenida';

interface AvenidaStore {
  sambaAtual: SambaAtual | null;
  historico: SambaHistorico[];
  poll: SambaPoll | null;
  votedOptionId: string | null;
  totalVotes: number;
  optionVoteCounts: Record<string, number>;
  isLoading: boolean;

  loadData: (userId?: string) => Promise<void>;
  vote: (optionId: string, userId: string) => Promise<boolean>;
  hasVoted: () => boolean;
  getVotedOption: () => string | null;
  getTotalVotes: () => number;
  getPercentage: (optionId: string) => number;
  getWinningOption: () => string | null;
}

export const useAvenidaStore = create<AvenidaStore>((set, get) => ({
  sambaAtual: null,
  historico: [],
  poll: null,
  votedOptionId: null,
  totalVotes: 0,
  optionVoteCounts: {},
  isLoading: false,

  loadData: async (userId?: string) => {
    set({ isLoading: true });
    try {
      const { data: atualData } = await supabase
        .from('samba_atual')
        .select('*')
        .eq('is_active', true)
        .order('year', { ascending: false })
        .limit(1)
        .maybeSingle();

      const sambaAtual: SambaAtual | null = atualData ? {
        year: atualData.year,
        title: atualData.title,
        composers: atualData.composers,
        lyrics: atualData.lyrics,
        youtubeId: atualData.youtube_id,
        releaseDate: atualData.release_date,
      } : null;

      const { data: historicoData } = await supabase
        .from('sambas_historico')
        .select('*')
        .order('year', { ascending: false });

      const historico: SambaHistorico[] = (historicoData ?? []).map((h: any) => ({
        id: h.id,
        year: h.year,
        title: h.title,
        composers: h.composers,
        youtubeId: h.youtube_id,
      }));

      const { data: pollData } = await supabase
        .from('samba_poll')
        .select('*, samba_poll_options(*)')
        .eq('is_open', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      let poll: SambaPoll | null = null;
      let optionVoteCounts: Record<string, number> = {};
      let totalVotes = 0;
      let votedOptionId: string | null = null;

      if (pollData) {
        const { data: votesData } = await supabase
          .from('samba_poll_votes')
          .select('option_id, user_id')
          .eq('poll_id', pollData.id);

        (votesData ?? []).forEach((v: any) => {
          optionVoteCounts[v.option_id] = (optionVoteCounts[v.option_id] ?? 0) + 1;
          totalVotes += 1;
          if (userId && v.user_id === userId) votedOptionId = v.option_id;
        });

        poll = {
          id: pollData.id,
          title: pollData.title,
          subtitle: pollData.subtitle,
          targetYear: pollData.target_year,
          closesAt: pollData.closes_at,
          isOpen: pollData.is_open,
          options: (pollData.samba_poll_options ?? []).map((o: any) => ({
            id: o.id,
            title: o.title,
            composers: o.composers,
            description: o.description,
            emoji: o.emoji,
            votes: [],
          })),
        };
      }

      set({ sambaAtual, historico, poll, optionVoteCounts, totalVotes, votedOptionId, isLoading: false });
    } catch (e) {
      console.log('avenidaStore loadData error:', e);
      set({ isLoading: false });
    }
  },

  vote: async (optionId, userId) => {
    const { poll, hasVoted } = get();
    if (!poll || hasVoted() || !poll.isOpen) return false;

    const { error } = await supabase.from('samba_poll_votes').insert({
      poll_id: poll.id,
      option_id: optionId,
      user_id: userId,
    });

    if (error) {
      console.log('vote error:', error);
      return false;
    }

    set(state => ({
      votedOptionId: optionId,
      totalVotes: state.totalVotes + 1,
      optionVoteCounts: { ...state.optionVoteCounts, [optionId]: (state.optionVoteCounts[optionId] ?? 0) + 1 },
    }));
    return true;
  },

  hasVoted: () => {
    return !!get().votedOptionId;
  },

  getVotedOption: () => {
    return get().votedOptionId;
  },

  getTotalVotes: () => {
    return get().totalVotes;
  },

  getPercentage: (optionId) => {
    const { totalVotes, optionVoteCounts } = get();
    if (totalVotes === 0) return 0;
    return Math.round(((optionVoteCounts[optionId] ?? 0) / totalVotes) * 100);
  },

  getWinningOption: () => {
    const { poll, optionVoteCounts } = get();
    if (!poll || poll.options.length === 0) return null;
    const sorted = [...poll.options].sort((a, b) => (optionVoteCounts[b.id] ?? 0) - (optionVoteCounts[a.id] ?? 0));
    return sorted[0]?.id ?? null;
  },
}));
