create table if not exists public.wli_newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (
    email = lower(trim(email))
    and char_length(email) between 3 and 254
    and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  name text check (name is null or char_length(trim(name)) <= 100),
  consent_at timestamptz not null,
  source text not null default 'website' check (source = 'website'),
  status text not null default 'active' check (status in ('active', 'unsubscribed')),
  brevo_status text not null default 'pending' check (brevo_status in ('pending', 'synced', 'unsubscribed')),
  brevo_synced_at timestamptz,
  brevo_sync_error text not null default '' check (char_length(brevo_sync_error) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wli_newsletter_created_at_idx
  on public.wli_newsletter_subscribers (created_at desc);

alter table public.wli_newsletter_subscribers enable row level security;

revoke all on public.wli_newsletter_subscribers from anon;
revoke insert, update, delete on public.wli_newsletter_subscribers from authenticated;
grant select, update on public.wli_newsletter_subscribers to authenticated;

drop policy if exists "staff can read newsletter subscribers" on public.wli_newsletter_subscribers;
create policy "staff can read newsletter subscribers" on public.wli_newsletter_subscribers
for select to authenticated
using ((select public.is_crm_staff()));

drop policy if exists "staff can delete newsletter subscribers" on public.wli_newsletter_subscribers;
drop policy if exists "staff can update newsletter subscribers" on public.wli_newsletter_subscribers;
create policy "staff can update newsletter subscribers" on public.wli_newsletter_subscribers
for update to authenticated
using ((select public.is_crm_staff()))
with check ((select public.is_crm_staff()));

drop trigger if exists wli_newsletter_set_updated_at on public.wli_newsletter_subscribers;
create trigger wli_newsletter_set_updated_at
before update on public.wli_newsletter_subscribers
for each row execute function public.set_updated_at();
