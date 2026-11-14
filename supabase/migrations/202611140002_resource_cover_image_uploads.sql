-- Keep uploaded resource covers as Storage paths so signed URLs can be renewed.
alter table public.wli_resources
  add column if not exists cover_image_path text not null default '';

drop policy if exists "public can read published WLI content files" on storage.objects;
create policy "public can read published WLI content files" on storage.objects
for select to anon, authenticated
using (
  bucket_id = 'wli-content' and (
    exists (
      select 1 from public.wli_resources r
      where r.status = 'published' and (
        r.storage_path = storage.objects.name or
        r.cover_image_path = storage.objects.name
      )
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

notify pgrst, 'reload schema';
