-- Run after creating this email as an Auth user in Supabase Dashboard.
do $$
declare
  target_user_id uuid;
begin
  select id
    into target_user_id
  from auth.users
  where lower(email) = lower('thewisdomplaceonline@gmail.com')
  limit 1;

  if target_user_id is null then
    raise exception 'Create the email in Supabase Authentication > Users first.';
  end if;

  insert into public.crm_staff (user_id, display_name, role, active)
  values (target_user_id, 'WLI Team', 'manager', true)
  on conflict (user_id) do update
    set role = 'manager', active = true;
end;
$$;
