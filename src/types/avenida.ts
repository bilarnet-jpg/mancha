export interface SambaAtual {
  year: number;
  title: string;
  composers: string;
  lyrics: string;
  audioUrl?: string;
  youtubeId?: string;
  releaseDate: string;
}

export interface SambaHistorico {
  id: string;
  year: number;
  title: string;
  composers: string;
  youtubeId: string;
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
  youtubeId: 'uObSmyGrzBM', // Samba 2026 — vídeo real confirmado
  releaseDate: '2025-11-20T00:00:00Z',
};

// HISTÓRICO — vídeos reais confirmados do canal oficial Mancha Carnaval.
// Títulos, compositores e colocação (placement) são provisórios — Franco pode
// detalhar/corrigir cada ano depois.
export const SAMBAS_HISTORICOS: SambaHistorico[] = [
  {
    id: 'samba-2025',
    year: 2025,
    title: 'Samba-Enredo 2025',
    composers: 'Grupo Mancha Verde',
    youtubeId: 'JrzgHn-Ec3c',
  },
  {
    id: 'samba-2024',
    year: 2024,
    title: 'Samba-Enredo 2024',
    composers: 'Grupo Mancha Verde',
    youtubeId: '0C54s3rkDgQ',
  },
  {
    id: 'samba-2023',
    year: 2023,
    title: 'Verde Eterno: O Samba Que o Coração Guarda',
    composers: 'Grupo Mancha Verde',
    youtubeId: 'jZzshxC2Nzs',
  },
  {
    id: 'samba-2022',
    year: 2022,
    title: 'Samba-Enredo 2022',
    composers: 'Grupo Mancha Verde',
    youtubeId: '0_1G7OPsPVs',
  },
  {
    id: 'samba-2021',
    year: 2021,
    title: 'Samba-Enredo 2021',
    composers: 'Grupo Mancha Verde',
    youtubeId: 'Tzpis1YSDBw',
  },
  {
    id: 'samba-2020',
    year: 2020,
    title: 'Samba-Enredo 2020',
    composers: 'Grupo Mancha Verde',
    youtubeId: 'qQHuA03r68c',
  },
  {
    id: 'samba-2019',
    year: 2019,
    title: 'Samba-Enredo 2019',
    composers: 'Grupo Mancha Verde',
    youtubeId: 'gr7HEL8afZI',
  },
  {
    id: 'samba-2018',
    year: 2018,
    title: 'Samba-Enredo 2018',
    composers: 'Grupo Mancha Verde',
    youtubeId: '5uEzCkOQNKE',
  },
  {
    id: 'samba-2017',
    year: 2017,
    title: 'Samba-Enredo 2017',
    composers: 'Grupo Mancha Verde',
    youtubeId: 'XTL_SOKQAi8',
  },
  {
    id: 'samba-2016',
    year: 2016,
    title: 'Samba-Enredo 2016',
    composers: 'Grupo Mancha Verde',
    youtubeId: 'ADFU6u2Ml14',
  },
  {
    id: 'samba-2015',
    year: 2015,
    title: 'Samba-Enredo 2015',
    composers: 'Grupo Mancha Verde',
    youtubeId: 'ldD25GvCkxI',
  },
  {
    id: 'samba-2014',
    year: 2014,
    title: 'Samba-Enredo 2014',
    composers: 'Grupo Mancha Verde',
    youtubeId: 'gzVeJgJsLHk',
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
