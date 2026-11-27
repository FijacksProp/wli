# Newsletter setup

The newsletter signup stores consented records in Supabase and immediately adds or updates each contact in the selected Brevo list. Names are optional. Unsubscribing from the staff workspace removes the contact from the WLI Brevo list and preserves an unsubscribe record in Supabase.

## 1. Apply the database migration

In Supabase, open **SQL Editor** and run `supabase/migrations/202611270001_newsletter.sql` after the existing CRM migrations. The migration creates a subscriber table with row-level security. Public visitors cannot read the list; active CRM staff can review/export subscribers and manage unsubscribes.

## 2. Create the Brevo list and API key

In Brevo, create a contact list for WLI newsletter subscribers, then create an API key in account settings. Copy the numeric list ID from the list details. The key must have permission to create/update contacts and remove a contact from that list.

## 3. Configure server environment variables

Add these values to local `.env.local` and to the hosting platform's server environment variables for production and preview, then redeploy:

- `SUPABASE_URL` - the HTTPS Supabase Project URL
- `SUPABASE_SECRET_KEY` — the Supabase secret API key; server-side only (legacy projects may use `SUPABASE_SERVICE_ROLE_KEY`)
- `BREVO_API_KEY` - Brevo API key; server-side only
- `BREVO_LIST_ID` - numeric WLI subscriber list ID

Keep the existing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values for public CRM/browser requests. Never expose Supabase secret or Brevo keys through `VITE_` variables, commit real values, or paste them into client code.

## 4. Verify

1. Submit a test signup with an email address you control and leave the name blank.
2. Confirm the success message appears and the contact is in the WLI Brevo list.
3. Open **Admin > Newsletter** and confirm the subscriber and consent date appear.
4. Try the CSV export and unsubscribe action. The address should disappear from the active admin list and from the WLI Brevo list.

If Brevo is temporarily unavailable during signup, the consent record is still saved in Supabase and shown as **Sync pending** in the admin. Check the Brevo credentials/list ID and server logs, then add that contact to the Brevo list manually.
