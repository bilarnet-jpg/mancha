import { create } from 'zustand';
import { SambaAtual, SambaHistorico, SambaPoll, SAMBA_ATUAL, SAMBAS_HISTORICOS, SAMBA_POLL } from '../types/avenida';

interface AvenidaStore {
  sambaAtual: SambaAtual;
  historico: SambaHistorico[];
  poll: SambaPoll;
  isLoading: boolean;

  loadData: () => void;
  vote: (optionId: string, userId: string) => boolean; // retorna false se já votou
  hasVoted: (userId: string) => boolean;
  getVotedOption: (userId: string) => string | null;
  getTotalVotes: () => number;
  getPercentage: (optionId: string) => number;
  getWinningOption: () => string | null;
}

export const useAvenidaStore = create<AvenidaStore>((set, get) => ({
  sambaAtual: SAMBA_ATUAL,
  historico: [],
  poll: SAMBA_POLL,
  isLoading: false,

  loadData: () => {
    set({ sambaAtual: SAMBA_ATUAL, historico: SAMBAS_HISTORICOS, poll: SAMBA_POLL });
  },

  vote: (optionId, userId) => {
    const { poll, hasVoted } = get();
    if (hasVoted(userId)) return false;
    if (!poll.isOpen) return false;

    set(state => ({
      poll: {
        ...state.poll,
        options: state.poll.options.map(opt =>
          opt.id === optionId ? { ...opt, votes: [...opt.votes, userId] } : opt
        ),
      },
    }));
    return true;
  },

  hasVoted: (userId) => {
    const { poll } = get();
    return poll.options.some(opt => opt.votes.includes(userId));
  },

  getVotedOption: (userId) => {
    const { poll } = get();
    const found = poll.options.find(opt => opt.votes.includes(userId));
    return found?.id ?? null;
  },

  getTotalVotes: () => {
    const { poll } = get();
    return poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
  },

  getPercentage: (optionId) => {
    const { poll, getTotalVotes } = get();
    const total = getTotalVotes();
    if (total === 0) return 0;
    const option = poll.options.find(o => o.id === optionId);
    if (!option) return 0;
    return Math.round((option.votes.length / total) * 100);
  },

  getWinningOption: () => {
    const { poll } = get();
    if (poll.options.length === 0) return null;
    const winner = [...poll.options].sort((a, b) => b.votes.length - a.votes.length)[0];
    return winner.id;
  },
}));
