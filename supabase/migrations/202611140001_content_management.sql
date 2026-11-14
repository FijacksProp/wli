-- WLI content management: blog posts and public learning resources.
create table if not exists public.wli_blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text not null default '' check (char_length(excerpt) <= 500),
  author text not null default 'Wisdom Leadership Initiatives',
  cover_image text not null default '',
  cover_image_path text not null default '',
  blocks jsonb not null default '[]'::jsonb check (jsonb_typeof(blocks) = 'array'),
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wli_blog_posts_published_idx
  on public.wli_blog_posts (published_at desc) where status = 'published';

create table if not exists public.wli_resources (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('book', 'audio', 'video')),
  title text not null check (char_length(trim(title)) between 1 and 180),
  description text not null default '' check (char_length(description) <= 1000),
  cover_image text not null default '',
  file_url text not null default '',
  storage_path text not null default '',
  external_url text not null default '',
  status text not null default 'published' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint wli_resources_type_title_unique unique (type, title),
  constraint wli_resources_has_media check (
    (type = 'video' and external_url <> '') or
    (type in ('book', 'audio') and (file_url <> '' or storage_path <> ''))
  ),
  constraint wli_resources_video_url check (
    type <> 'video' or
    external_url ~ '^https://(www[.])?youtube[.]com/watch[?]v=[A-Za-z0-9_-]{11}(&.*)?$' or
    external_url ~ '^https://youtu[.]be/[A-Za-z0-9_-]{11}([?].*)?$'
  )
);

create index if not exists wli_resources_public_idx
  on public.wli_resources (type, sort_order, created_at desc) where status = 'published';

drop trigger if exists wli_blog_posts_set_updated_at on public.wli_blog_posts;
create trigger wli_blog_posts_set_updated_at
before update on public.wli_blog_posts
for each row execute function public.set_updated_at();

drop trigger if exists wli_resources_set_updated_at on public.wli_resources;
create trigger wli_resources_set_updated_at
before update on public.wli_resources
for each row execute function public.set_updated_at();

alter table public.wli_blog_posts enable row level security;
alter table public.wli_resources enable row level security;

drop policy if exists "public can read published WLI blog posts" on public.wli_blog_posts;
create policy "public can read published WLI blog posts" on public.wli_blog_posts
for select to anon, authenticated
using (status = 'published');

drop policy if exists "WLI staff can manage blog posts" on public.wli_blog_posts;
create policy "WLI staff can manage blog posts" on public.wli_blog_posts
for all to authenticated
using ((select public.is_crm_staff()))
with check ((select public.is_crm_staff()));

drop policy if exists "public can read published WLI resources" on public.wli_resources;
create policy "public can read published WLI resources" on public.wli_resources
for select to anon, authenticated
using (status = 'published');

drop policy if exists "WLI staff can manage resources" on public.wli_resources;
create policy "WLI staff can manage resources" on public.wli_resources
for all to authenticated
using ((select public.is_crm_staff()))
with check ((select public.is_crm_staff()));

grant select on public.wli_blog_posts, public.wli_resources to anon, authenticated;
grant insert, update, delete on public.wli_blog_posts, public.wli_resources to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wli-content', 'wli-content', false, 104857600,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf', 'audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/wav', 'audio/ogg']
)
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public can read WLI content files" on storage.objects;
drop policy if exists "public can read published WLI content files" on storage.objects;
create policy "public can read published WLI content files" on storage.objects
for select to anon, authenticated
using (
  bucket_id = 'wli-content' and (
    exists (
      select 1 from public.wli_resources r
      where r.status = 'published' and r.storage_path = storage.objects.name
    ) or exists (
      select 1 from public.wli_blog_posts p
      where p.status = 'published' and p.cover_image_path = storage.objects.name
    ) or exists (
      select 1 from public.wli_blog_posts p
      cross join lateral jsonb_array_elements(p.blocks) as content_block(value)
      where p.status = 'published' and content_block.value ->> 'storage_path' = storage.objects.name
    )
  )
);

drop policy if exists "WLI staff can read content files" on storage.objects;
create policy "WLI staff can read content files" on storage.objects
for select to authenticated
using (bucket_id = 'wli-content' and (select public.is_crm_staff()));

drop policy if exists "WLI staff can upload content files" on storage.objects;
create policy "WLI staff can upload content files" on storage.objects
for insert to authenticated
with check (bucket_id = 'wli-content' and (select public.is_crm_staff()));

drop policy if exists "WLI staff can update content files" on storage.objects;
create policy "WLI staff can update content files" on storage.objects
for update to authenticated
using (bucket_id = 'wli-content' and (select public.is_crm_staff()))
with check (bucket_id = 'wli-content' and (select public.is_crm_staff()));

drop policy if exists "WLI staff can delete content files" on storage.objects;
create policy "WLI staff can delete content files" on storage.objects
for delete to authenticated
using (bucket_id = 'wli-content' and (select public.is_crm_staff()));

-- Preserve the books and video messages currently shown by the public site.
insert into public.wli_resources (type, title, file_url, external_url, status, sort_order)
values
  ('book', '31 Wisdom Keys', '/resources/books/31-wisdom-keys.pdf', '', 'published', 10),
  ('book', 'The Life Assignment', '/resources/books/the-life-assignment.pdf', '', 'published', 20),
  ('book', 'Wisdom for Living', '/resources/books/wisdom-for-living.pdf', '', 'published', 30),
  ('book', 'Times and Seasons of Life', '/resources/books/times-and-seasons-of-life.pdf', '', 'published', 40),
  ('book', 'Confessions over Children', '/resources/books/confessions-over-children.pdf', '', 'published', 50),
  ('book', 'Meditations on the Anointing', '/resources/books/meditations-on-the-anointing.pdf', '', 'published', 60),
  ('book', 'Meditations on Grace', '/resources/books/meditations-on-grace.pdf', '', 'published', 70),
  ('book', 'Meditations on Wisdom', '/resources/books/meditations-on-wisdom.pdf', '', 'published', 80),
  ('book', 'Meditations on Healing and Health', '/resources/books/meditations-on-healing-and-health.pdf', '', 'published', 90),
  ('book', 'Meditations on Favour', '/resources/books/meditations-on-favour.pdf', '', 'published', 100),
  ('book', 'Meditations on Prosperity', '/resources/books/meditations-on-prosperity.pdf', '', 'published', 110),
  ('book', 'Meditations on Selflessness', '/resources/books/meditations-on-selflessness.pdf', '', 'published', 120),
  ('video', 'Wisdom of Order', '', 'https://www.youtube.com/watch?v=NJbDLKS3M1A', 'published', 10),
  ('video', 'Wisdom of Automation', '', 'https://www.youtube.com/watch?v=mjZdtSNZJl0', 'published', 20),
  ('video', 'The Wisdom of Growth', '', 'https://www.youtube.com/watch?v=jM9oDbRfxlg', 'published', 30),
  ('video', 'The Lifted Ark — Kingdom Mindset', '', 'https://www.youtube.com/watch?v=oxVdUvL2u80', 'published', 40),
  ('video', 'Shut in the Ark', '', 'https://www.youtube.com/watch?v=AufOtqZf3Lk', 'published', 50),
  ('video', 'The Lifted Ark', '', 'https://www.youtube.com/watch?v=xEFDkzUTd1k', 'published', 60)
on conflict do nothing;
