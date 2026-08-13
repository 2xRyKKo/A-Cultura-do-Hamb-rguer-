-- ============================================================================
-- A Cultura do Hambúrguer — database schema (run once in the Supabase
-- SQL Editor: dashboard → your project → SQL Editor → New query → paste
-- this whole file → Run). Safe to re-run; uses IF NOT EXISTS / OR REPLACE
-- throughout.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- profiles — one row per staff/owner account. Created automatically the
-- moment you add someone in Authentication → Users → Add user. Everyone
-- starts as role='staff'; promote the owner manually (see bottom of file).
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'staff' check (role in ('owner', 'staff')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own or owner reads all" on public.profiles;
create policy "profiles: read own or owner reads all"
  on public.profiles for select
  using (
    auth.uid() = id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );

drop policy if exists "profiles: owner manages all" on public.profiles;
create policy "profiles: owner manages all"
  on public.profiles for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner'));

-- Auto-create a profile row whenever a new account is added (via dashboard
-- invite or otherwise) — keeps profiles in sync with auth.users with no
-- manual step beyond "add the user".
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- reservations — public booking requests (Phase 2). Anyone can submit one
-- (the website's reservation form); only signed-in, active staff/owner can
-- read or manage them.
-- ---------------------------------------------------------------------------
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  party_size int not null check (party_size > 0),
  reservation_date date not null,
  reservation_time time not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.reservations enable row level security;

drop policy if exists "reservations: anyone can submit" on public.reservations;
create policy "reservations: anyone can submit"
  on public.reservations for insert
  with check (true);

drop policy if exists "reservations: staff can read" on public.reservations;
create policy "reservations: staff can read"
  on public.reservations for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.active));

drop policy if exists "reservations: staff can update" on public.reservations;
create policy "reservations: staff can update"
  on public.reservations for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.active));

-- ---------------------------------------------------------------------------
-- table_orders — "Meu Pedido" submissions from an NFC table session
-- (Phase 4). Same public-insert / staff-read shape as reservations.
-- ---------------------------------------------------------------------------
create table if not exists public.table_orders (
  id uuid primary key default gen_random_uuid(),
  table_id text not null,
  items jsonb not null,
  notes text,
  status text not null default 'new' check (status in ('new', 'seen', 'done')),
  created_at timestamptz not null default now()
);

alter table public.table_orders enable row level security;

drop policy if exists "table_orders: anyone can submit" on public.table_orders;
create policy "table_orders: anyone can submit"
  on public.table_orders for insert
  with check (true);

drop policy if exists "table_orders: staff can read" on public.table_orders;
create policy "table_orders: staff can read"
  on public.table_orders for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.active));

drop policy if exists "table_orders: staff can update" on public.table_orders;
create policy "table_orders: staff can update"
  on public.table_orders for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.active));

-- Realtime: let the staff dashboard subscribe to new orders as they land.
alter publication supabase_realtime add table public.table_orders;

-- ---------------------------------------------------------------------------
-- analytics_events — lightweight event log (Phase 5). Public insert (the
-- site's analytics.js), staff-only read.
-- ---------------------------------------------------------------------------
create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  event_name text not null,
  payload jsonb,
  table_id text,
  lang text,
  created_at timestamptz not null default now()
);

alter table public.analytics_events enable row level security;

drop policy if exists "analytics: anyone can submit" on public.analytics_events;
create policy "analytics: anyone can submit"
  on public.analytics_events for insert
  with check (true);

drop policy if exists "analytics: staff can read" on public.analytics_events;
create policy "analytics: staff can read"
  on public.analytics_events for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.active));

-- ============================================================================
-- ONE-TIME MANUAL STEP (do this after running the script above):
--
-- 1. Authentication → Users → Add user → create your own account
--    (email + password). This automatically creates your profiles row.
-- 2. Table Editor → profiles → find your row → set role = 'owner'.
-- 3. Any other staff you add the same way (Authentication → Users →
--    Add user) automatically get role = 'staff' and can sign in, but
--    only you (owner) can see/change roles or deactivate someone
--    (set active = false in Table Editor to revoke access instantly).
-- ============================================================================
