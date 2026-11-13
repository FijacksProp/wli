create extension if not exists pgcrypto;

create table if not exists public.crm_staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null default 'agent' check (role in ('admin', 'manager', 'agent')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_crm_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.crm_staff
    where user_id = (select auth.uid()) and active
  );
$$;
revoke all on function public.is_crm_staff() from public;
grant execute on function public.is_crm_staff() to authenticated;

create table if not exists public.crm_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 100),
  email text not null check (char_length(trim(email)) between 3 and 254),
  phone text check (phone is null or char_length(phone) <= 30),
  message text not null check (char_length(trim(message)) between 10 and 2000),
  status text not null default 'new' check (status in ('new', 'in_progress', 'waiting', 'resolved', 'archived')),
  assigned_to uuid references public.crm_staff(user_id) on delete set null,
  internal_notes text not null default '' check (char_length(internal_notes) <= 5000),
  source text not null default 'website' check (source in ('website', 'phone', 'email', 'referral', 'other')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crm_enquiries_created_at_idx on public.crm_enquiries (created_at desc);
create index if not exists crm_enquiries_status_idx on public.crm_enquiries (status, created_at desc);
create index if not exists crm_enquiries_email_idx on public.crm_enquiries (lower(email));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists crm_enquiries_set_updated_at on public.crm_enquiries;
create trigger crm_enquiries_set_updated_at
before update on public.crm_enquiries
for each row execute function public.set_updated_at();

alter table public.crm_staff enable row level security;
alter table public.crm_enquiries enable row level security;

drop policy if exists "staff can read own profile" on public.crm_staff;
create policy "staff can read own profile" on public.crm_staff
for select to authenticated
using (user_id = (select auth.uid()) and active);

drop policy if exists "staff can read enquiries" on public.crm_enquiries;
create policy "staff can read enquiries" on public.crm_enquiries
for select to authenticated
using ((select public.is_crm_staff()));

drop policy if exists "staff can update enquiries" on public.crm_enquiries;
create policy "staff can update enquiries" on public.crm_enquiries
for update to authenticated
using ((select public.is_crm_staff()))
with check ((select public.is_crm_staff()));

drop policy if exists "public can submit website enquiries" on public.crm_enquiries;
create policy "public can submit website enquiries" on public.crm_enquiries
for insert to anon, authenticated
with check (
  status = 'new'
  and assigned_to is null
  and internal_notes = ''
  and source = 'website'
);

grant select on public.crm_staff to authenticated;
grant select, update on public.crm_enquiries to authenticated;
grant insert on public.crm_enquiries to anon, authenticated;
revoke all on public.crm_staff from anon;
revoke delete on public.crm_enquiries from anon, authenticated;

-- Disable public Auth sign-ups in Supabase. Create staff accounts by invitation,
-- then add their auth.users UUID to crm_staff from the SQL editor.
