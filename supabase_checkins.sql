create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  event_id text,
  event_name text,
  type text not null default 'evento',
  partner_name text,
  xp_earned integer default 50,
  scanned_by uuid,
  created_at timestamptz default now()
);

alter table checkins enable row level security;

create policy "Usuario ve seus checkins"
  on checkins for select
  using (auth.uid() = user_id);

create policy "Admin pode inserir checkins"
  on checkins for insert
  using (true);

create index checkins_user_id_idx on checkins(user_id);
create index checkins_created_at_idx on checkins(created_at desc);
