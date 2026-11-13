# WLI CRM setup

The website talks to Supabase Auth and the PostgREST API using the public project key. Database row-level security keeps enquiry records private to active WLI staff. Never put a Supabase service-role/secret key in a `VITE_` variable or in browser code.

## 1. Create the Supabase project

Create a Supabase project for WLI and copy its **Project URL** and **publishable key** (or legacy anon key) from the API settings. The URL must be the HTTPS API URL, such as `https://your-project-ref.supabase.co`; do not use the PostgreSQL connection string, database host, or database password here. Add the two values to a local `.env` file using `.env.example` as the template. Add the same two values to the Vercel project environment variables for Production and Preview, then redeploy.

## 2. Create the CRM tables and policies

Open the Supabase SQL Editor and run `supabase/migrations/202611130001_crm.sql`. The migration creates staff and enquiry tables, indexes, update timestamps, and RLS policies. The public role can insert a website enquiry with a fixed `new` status, but cannot list, read, update, or delete enquiries. Active staff can list and update records.

## 3. Create staff accounts

In Supabase Auth, turn off public sign-ups and invite each WLI staff member. For each invited account, add their Auth user UUID and display name to `public.crm_staff` from the SQL Editor:

```sql
insert into public.crm_staff (user_id, display_name, role)
values ('AUTH-USER-UUID', 'Staff name', 'admin');
```

Available roles are `admin`, `manager`, and `agent`. Current access policy allows all active staff to work enquiries; role-specific permissions and staff management should be the next CRM increment.

## 4. Open the admin dashboard

Visit `/admin` and sign in with the invited account. The dashboard supports search, status filtering, internal notes, and status updates. Website contact form submissions appear there once the project keys and SQL migration are in place.

## Before launch

- Add a CAPTCHA/rate-limit layer to the public form endpoint to reduce automated spam.
- Configure an email notification to the WLI inbox for new enquiries.
- Confirm a retention period and who on the WLI team may access enquiry records.
- Enable Supabase database backups appropriate to the operating plan.
