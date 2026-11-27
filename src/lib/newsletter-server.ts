import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function supabaseAdminHeaders(apiKey: string, includeLegacyBearer = true) {
  const headers: Record<string, string> = { apikey: apiKey };
  // Current sb_secret keys belong in apikey only; legacy service_role JWTs
  // still need Authorization when used as the elevated PostgREST identity.
  if (includeLegacyBearer && !apiKey.startsWith("sb_secret_")) {
    headers.Authorization = `Bearer ${apiKey}`;
  }
  return headers;
}

const signupSchema = z.object({
  email: z.string().trim().email().max(254),
  name: z.string().trim().max(100).optional().default(""),
  consent: z
    .boolean()
    .refine((value) => value, "Please agree to receive email updates."),
  website: z.string().max(200).optional().default(""),
});

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .validator(signupSchema)
  .handler(async ({ data }) => {
    // Honeypot: acknowledge quietly while dropping automated submissions.
    if (data.website) return { success: true as const };

    const env = process.env as Record<string, string | undefined>;
    const supabaseUrl = (env.SUPABASE_URL ?? env.VITE_SUPABASE_URL)?.replace(
      /\/$/,
      "",
    );
    const serviceKey = env.SUPABASE_SECRET_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY;
    const brevoKey = env.BREVO_API_KEY;
    const brevoListId = env.BREVO_LIST_ID;
    if (!supabaseUrl || !serviceKey || !brevoKey || !brevoListId) {
      console.error("Newsletter is missing server configuration.");
      throw new Error(
        "Newsletter signup is temporarily unavailable. Please try again later.",
      );
    }

    const email = data.email.toLowerCase();
    const name = data.name.trim() || null;
    const recordResponse = await fetch(
      `${supabaseUrl}/rest/v1/wli_newsletter_subscribers?on_conflict=email&select=id`,
      {
        method: "POST",
        headers: {
          ...supabaseAdminHeaders(serviceKey),
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=representation",
        },
        body: JSON.stringify({
          email,
          name,
          consent_at: new Date().toISOString(),
          source: "website",
          status: "active",
          brevo_status: "pending",
          brevo_synced_at: null,
          brevo_sync_error: "",
        }),
      },
    );
    if (!recordResponse.ok) {
      console.error(
        "Could not save a newsletter signup:",
        recordResponse.status,
      );
      throw new Error(
        "Newsletter signup is temporarily unavailable. Please try again later.",
      );
    }
    const saved = (await recordResponse.json()) as Array<{ id: string }>;
    const subscriberId = saved[0]?.id;
    if (!subscriberId)
      throw new Error(
        "Newsletter signup is temporarily unavailable. Please try again later.",
      );

    let brevoStatus: "synced" | "pending" = "pending";
    let syncError = "";
    try {
      const listId = Number(brevoListId);
      if (!Number.isInteger(listId) || listId < 1)
        throw new Error("Invalid Brevo list ID");
      const contactResponse = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "api-key": brevoKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          ...(name ? { attributes: { FIRSTNAME: name } } : {}),
          listIds: [listId],
          updateEnabled: true,
        }),
      });
      if (!contactResponse.ok) {
        syncError = `Brevo returned HTTP ${contactResponse.status}`;
      } else {
        brevoStatus = "synced";
      }
    } catch {
      syncError = "Could not reach Brevo";
    }

    const updateResponse = await fetch(
      `${supabaseUrl}/rest/v1/wli_newsletter_subscribers?id=eq.${encodeURIComponent(subscriberId)}`,
      {
        method: "PATCH",
        headers: {
          ...supabaseAdminHeaders(serviceKey),
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          brevo_status: brevoStatus,
          brevo_synced_at:
            brevoStatus === "synced" ? new Date().toISOString() : null,
          brevo_sync_error: syncError,
        }),
      },
    );
    if (!updateResponse.ok)
      console.error(
        "Could not update newsletter sync status:",
        updateResponse.status,
      );
    if (syncError)
      console.error(
        "Newsletter subscriber saved; Brevo sync is pending:",
        syncError,
      );

    return { success: true as const, brevoSynced: brevoStatus === "synced" };
  });

const adminActionSchema = z.object({
  id: z.string().uuid(),
  accessToken: z.string().min(20),
});

async function requireNewsletterStaff(accessToken: string) {
  const env = process.env as Record<string, string | undefined>;
  const supabaseUrl = (env.SUPABASE_URL ?? env.VITE_SUPABASE_URL)?.replace(
    /\/$/,
    "",
  );
  const serviceKey = env.SUPABASE_SECRET_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey)
    throw new Error("Newsletter management is not configured.");
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${accessToken}`,
  };
  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers });
  if (!userResponse.ok)
    throw new Error("Your staff session has expired. Please sign in again.");
  const user = (await userResponse.json()) as { id?: string };
  if (!user.id) throw new Error("Your staff session is invalid.");
  const staffResponse = await fetch(
    `${supabaseUrl}/rest/v1/crm_staff?user_id=eq.${encodeURIComponent(user.id)}&active=eq.true&select=user_id&limit=1`,
    { headers: supabaseAdminHeaders(serviceKey) },
  );
  const staff = staffResponse.ok
    ? ((await staffResponse.json()) as unknown[])
    : [];
  if (!staff.length)
    throw new Error("Only active WLI staff can manage subscribers.");
  return {
    supabaseUrl,
    serviceKey,
    brevoKey: env.BREVO_API_KEY,
    listId: Number(env.BREVO_LIST_ID),
  };
}

export const unsubscribeNewsletterSubscriber = createServerFn({
  method: "POST",
})
  .validator(adminActionSchema)
  .handler(async ({ data }) => {
    const { supabaseUrl, serviceKey, brevoKey, listId } =
      await requireNewsletterStaff(data.accessToken);
    if (!brevoKey || !Number.isInteger(listId) || listId < 1)
      throw new Error("Brevo is not configured.");
    const headers = supabaseAdminHeaders(serviceKey);
    const response = await fetch(
      `${supabaseUrl}/rest/v1/wli_newsletter_subscribers?id=eq.${encodeURIComponent(data.id)}&status=eq.active&select=email,name`,
      { headers },
    );
    if (!response.ok) throw new Error("Could not retrieve this subscriber.");
    const matches = (await response.json()) as Array<{ email: string }>;
    const subscriber = matches[0];
    if (!subscriber)
      throw new Error(
        "This subscriber is already removed or no longer exists.",
      );

    const unlinkResponse = await fetch(
      `https://api.brevo.com/v3/contacts/${encodeURIComponent(subscriber.email)}`,
      {
        method: "PUT",
        headers: {
          "api-key": brevoKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ unlinkListIds: [listId] }),
      },
    );
    if (!unlinkResponse.ok && unlinkResponse.status !== 404) {
      throw new Error(
        "Brevo could not remove this address from the mailing list. Please try again.",
      );
    }
    const update = await fetch(
      `${supabaseUrl}/rest/v1/wli_newsletter_subscribers?id=eq.${encodeURIComponent(data.id)}&status=eq.active`,
      {
        method: "PATCH",
        headers: {
          ...supabaseAdminHeaders(serviceKey),
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          status: "unsubscribed",
          brevo_status: "unsubscribed",
          brevo_sync_error: "",
        }),
      },
    );
    if (!update.ok)
      throw new Error(
        "Brevo was updated, but the local subscriber record could not be updated.",
      );
    return { success: true as const };
  });
