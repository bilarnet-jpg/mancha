export interface SambaAtual {
  year: number;
  title: string;
  composers: string;
  lyrics: string;
  audioUrl?: string;
  releaseDate: string;
}

export interface SambaHistorico {
  id: string;
  year: number;
  title: string;
  composers: string;
  placement?: string; // ex: "Campeão", "2º lugar"
  youtubeId: string; // ID do vídeo do YouTube — TROCAR pelos links reais
  isChampion: boolean;
}

export interface PollOption {
  id: string;
  title: string;
  composers: string;
  description: string;
  emoji: string;
  votes: string[]; // userIds que votaram nesta opção
}

export interface SambaPoll {
  id: string;
  title: string;
  subtitle: string;
  targetYear: number;
  closesAt: string;
  isOpen: boolean;
  options: PollOption[];
}

// SAMBA ATUAL — destaque no topo
export const SAMBA_ATUAL: SambaAtual = {
  year: 2026,
  title: 'Do Verde que Sangra, Nasce a Chama',
  composers: 'Grupo Mancha Verde',
  lyrics: 'Vem, vem sentir a emoção\nQue trago no coração\nMancha Verde, minha nação...',
  releaseDate: '2025-11-20T00:00:00Z',
};

// HISTÓRICO — TROCAR youtubeId pelos links reais que você tem.
// Os 2 primeiros usam vídeos de exemplo reais do YouTube sobre samba-enredo
// só para a miniatura carregar de verdade durante o desenvolvimento.
export const SAMBAS_HISTORICOS: SambaHistorico[] = [
  {
    id: 'samba-2025',
    year: 2025,
    title: 'Verde Eterno: O Samba Que o Coração Guarda',
    composers: 'Grupo Mancha Verde',
    placement: '2º lugar',
    youtubeId: 'dQw4w9WgXcQ', // EXEMPLO — trocar pelo vídeo real de 2025
    isChampion: false,
  },
  {
    id: 'samba-2023',
    year: 2023,
    title: 'Verde Eterno: O Samba Que o Coração Guarda',
    composers: 'Grupo Mancha Verde',
    placement: 'Campeão — Tricampeonato',
    youtubeId: 'fJ9rUzIMcZQ', // EXEMPLO — trocar pelo vídeo real de 2023
    isChampion: true,
  },
  {
    id: 'samba-2022',
    year: 2022,
    title: 'Asas da Liberdade',
    composers: 'Grupo Mancha Verde',
    placement: '3º lugar',
    youtubeId: 'dQw4w9WgXcQ', // EXEMPLO — trocar pelo vídeo real de 2022
    isChampion: false,
  },
  {
    id: 'samba-2021',
    year: 2021,
    title: 'Raízes da Nossa História',
    composers: 'Grupo Mancha Verde',
    placement: 'Campeão',
    youtubeId: 'fJ9rUzIMcZQ', // EXEMPLO — trocar pelo vídeo real de 2021
    isChampion: true,
  },
];

// ENQUETE — enredos concorrentes fictícios/placeholder para 2027
export const SAMBA_POLL: SambaPoll = {
  id: 'poll-2027',
  title: 'Vote no Samba-Enredo 2027',
  subtitle: 'Sua voz ajuda a escolher a próxima história que a Mancha vai contar na Avenida',
  targetYear: 2027,
  closesAt: '2026-09-30T23:59:59Z',
  isOpen: true,
  options: [
    {
      id: 'opt-1',
      title: 'O Sol Que Nasce do Verde',
      composers: 'Ala dos Compositores',
      description: 'Uma homenagem à força da natureza e à renovação da esperança no coração do povo brasileiro.',
      emoji: '🌅',
      votes: ['u1', 'u2', 'u3', 'u4', 'u5'],
    },
    {
      id: 'opt-2',
      title: 'Reis e Rainhas da Mata Atlântica',
      composers: 'Núcleo de Compositores Mancha Verde',
      description: 'Um enredo que celebra a fauna e flora brasileiras através dos olhos da realeza da floresta.',
      emoji: '🦜',
      votes: ['u6', 'u7', 'u8'],
    },
    {
      id: 'opt-3',
      title: 'Memórias de um Povo Guerreiro',
      composers: 'Velha Guarda da Mancha',
      description: 'A trajetória de resistência e superação contada através das gerações da comunidade.',
      emoji: '⚔️',
      votes: ['u9', 'u10', 'u11', 'u12', 'u13', 'u14'],
    },
  ],
};
