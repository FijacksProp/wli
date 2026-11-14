# WLI workspace and content setup

The website uses Supabase Auth, PostgREST, and Storage through the public project key. Row-level security keeps enquiries private to active WLI staff and allows staff to manage content. Never put a Supabase service-role/secret key in a `VITE_` variable or browser code.

## 1. Configure the Supabase project

Copy the **Project URL** and **publishable key** (or legacy anon key) from Supabase API settings. Use the HTTPS API URL such as `https://your-project-ref.supabase.co`, not the PostgreSQL connection string. Add them to your local `.env` using `.env.example`, and add the same values to Vercel Production and Preview variables before redeploying.

## 2. Apply the database migrations

In the Supabase SQL Editor, run these files in this order:

1. `supabase/migrations/202611130001_crm.sql`
2. `supabase/migrations/202611140001_content_management.sql`

The first migration creates staff and enquiry tables. The second creates the blog and resource tables, adds public read and staff management policies, creates the private `wli-content` Storage bucket (100 MB maximum per file) with published-content-only signed access, and inserts the current book and video catalogue. The existing PDFs initially continue to use their project URLs so visitors can read them immediately.

## 3. Invite staff accounts

Turn off public sign-ups in Supabase Auth and invite staff accounts. Add each account's Auth user UUID and display name to `public.crm_staff`:

```sql
insert into public.crm_staff (user_id, display_name, role)
values ('AUTH-USER-UUID', 'Staff name', 'admin');
```

Any active WLI staff account can work enquiries and manage blog posts/resources. Supabase policies protect these actions; the browser must never receive a secret/service-role key.

## 4. Use the workspace

Visit `/admin` and sign in. The workspace has Overview, Enquiries, Blog, and Resources sections. Blog posts can be saved as drafts, previewed, and published. Books, audio files, and YouTube videos can be added, edited, unpublished, or deleted.

The first time you open **Resources → Books**, choose **Import existing books** to copy the current project PDFs into Supabase Storage and update their records. It is safe to retry: already imported files are skipped. New book PDFs and audio uploads must be 100 MB or smaller; supported types are PDF and common browser audio formats. Video messages use YouTube URLs.

The public Insights, Books, Audio Messages, and Video Messages pages read published Supabase records. Draft blog posts and resources remain private to active staff.

## Before launch

- Add a CAPTCHA/rate-limit layer to the public enquiry endpoint to reduce automated spam.
- Configure an email notification to the WLI inbox for new enquiries.
- Confirm the enquiry retention period and who on the WLI team may access records.
- Enable Supabase database backups appropriate to the operating plan.
