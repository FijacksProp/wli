-- Add manageable sections and ordering for the public book library.
alter table public.wli_resources
  add column if not exists book_category text not null default '';

alter table public.wli_resources
  drop constraint if exists wli_resources_book_category_check;

alter table public.wli_resources
  add constraint wli_resources_book_category_check
  check (book_category in ('', 'books', 'meditation_booklets', 'bible_teaching_module'));

-- Place the known catalog in its requested sections; other book records go to
-- the Bible Teaching Module so existing titles remain visible and organized.
update public.wli_resources
set book_category = case
  when title in (
    '31 Wisdom Keys',
    'The Life Assignment',
    'Wisdom for Living',
    'Times and Seasons of Life'
  ) then 'books'
  when title = 'Confessions over Children'
    or title ilike 'Meditations on %' then 'meditation_booklets'
  else 'bible_teaching_module'
end
where type = 'book';

notify pgrst, 'reload schema';
