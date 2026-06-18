-- Tabela de anúncios/comunicados especiais exibidos após o login
create table if not exists splash_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text,
  image_url text,
  background_color text default '#0A1F14',
  accent_color text default '#00FF85',
  emoji text default '📣',
  cta_label text,
  cta_link text,
  duration_seconds integer default 5,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  is_active boolean default true,
  priority integer default 0,
  created_at timestamptz default now()
);

-- Política de leitura pública (qualquer usuário autenticado pode ler anúncios ativos)
alter table splash_announcements enable row level security;

create policy "Anúncios visíveis para todos os usuários autenticados"
  on splash_announcements for select
  using (true);

-- Exemplo de anúncio de teste (pode editar/deletar depois)
insert into splash_announcements (title, message, emoji, cta_label, duration_seconds, is_active)
values (
  'Samba-Enredo 2027 Definido!',
  'A comunidade votou e o resultado saiu! Confira qual enredo vai representar a Mancha Verde na próxima Avenida.',
  '🏆',
  'Ver Resultado',
  6,
  true
);
