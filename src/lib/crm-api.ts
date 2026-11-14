export type CrmSession = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: { id: string; email?: string };
};

export type CrmEnquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: "new" | "in_progress" | "waiting" | "resolved" | "archived";
  internal_notes: string;
  created_at: string;
  updated_at: string;
};

export type BlogBlockType =
  "heading" | "paragraph" | "image" | "quote" | "list" | "callout";
export type BlogBlock = {
  id: string;
  type: BlogBlockType;
  text: string;
  url?: string;
  storage_path?: string;
};
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  cover_image: string;
  cover_image_path: string;
  blocks: BlogBlock[];
  status: "draft" | "published";
  published_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};
export type WliResource = {
  id: string;
  type: "book" | "audio" | "video";
  title: string;
  description: string;
  cover_image: string;
  file_url: string;
  storage_path: string;
  external_url: string;
  status: "draft" | "published";
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

const API_URL = import.meta.env["VITE_SUPABASE_URL"]?.replace(/\/$/, "");
const ANON_KEY = import.meta.env["VITE_SUPABASE_ANON_KEY"];
const SESSION_KEY = "wli-crm-session";

function validateApiUrl(value: string | undefined) {
  if (!value) return "Add the Supabase Project URL to VITE_SUPABASE_URL.";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) {
      return "VITE_SUPABASE_URL must be the HTTPS Project URL from Supabase API settings, not a database connection string.";
    }
    return null;
  } catch {
    return "VITE_SUPABASE_URL must be the HTTPS Project URL from Supabase API settings.";
  }
}

export const crmConfigurationError =
  validateApiUrl(API_URL) ??
  (!ANON_KEY
    ? "Add the Supabase publishable/anon key to VITE_SUPABASE_ANON_KEY."
    : null);
export const isCrmConfigured = crmConfigurationError === null;

function requireConfig() {
  if (crmConfigurationError) throw new Error(crmConfigurationError);
  if (!API_URL || !ANON_KEY)
    throw new Error("The WLI contact service is not available right now.");
  return { apiUrl: API_URL, anonKey: ANON_KEY };
}

async function api<T>(
  path: string,
  init: RequestInit = {},
  token = ANON_KEY,
): Promise<T> {
  const { apiUrl, anonKey } = requireConfig();
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token ?? anonKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  if (!response.ok) {
    const details = await response.json().catch(() => null);
    throw new Error(
      typeof details?.message === "string"
        ? details.message
        : "The request could not be completed.",
    );
  }
  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0" ||
    (init.headers &&
      new Headers(init.headers).get("Prefer")?.includes("return=minimal"))
  )
    return undefined as T;
  return response.json() as Promise<T>;
}

export function getSavedCrmSession(): CrmSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as CrmSession;
    if (session.expires_at <= Math.floor(Date.now() / 1000)) {
      window.sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    window.sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export async function signInToCrm(
  email: string,
  password: string,
): Promise<CrmSession> {
  const { apiUrl, anonKey } = requireConfig();
  const response = await fetch(`${apiUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      data?.msg ??
        data?.message ??
        "Sign-in failed. Check your email and password.",
    );
  const session: CrmSession = {
    ...data,
    expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
  };
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function signOutFromCrm(session: CrmSession) {
  try {
    await api<void>(
      "/auth/v1/logout",
      { method: "POST" },
      session.access_token,
    );
  } finally {
    window.sessionStorage.removeItem(SESSION_KEY);
  }
}

export function listCrmEnquiries(session: CrmSession) {
  return api<CrmEnquiry[]>(
    "/rest/v1/crm_enquiries?select=id,name,email,phone,message,status,internal_notes,created_at,updated_at&order=created_at.desc&limit=200",
    {},
    session.access_token,
  );
}

export function updateCrmEnquiry(
  session: CrmSession,
  id: string,
  updates: Pick<CrmEnquiry, "status" | "internal_notes">,
) {
  return api<CrmEnquiry[]>(
    `/rest/v1/crm_enquiries?id=eq.${encodeURIComponent(id)}&select=*`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(updates),
    },
    session.access_token,
  );
}

export function submitCrmEnquiry(enquiry: {
  name: string;
  email: string;
  phone: string | null;
  message: string;
}) {
  return api<void>("/rest/v1/crm_enquiries", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ ...enquiry, source: "website" }),
  });
}

function publicQuery<T>(path: string) {
  return api<T>(path);
}

async function signContentFile(path: string, token = ANON_KEY) {
  const { apiUrl, anonKey } = requireConfig();
  if (!token) throw new Error("Supabase is not configured.");
  const response = await fetch(
    `${apiUrl}/storage/v1/object/sign/wli-content/${storagePath(path)}`,
    {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expiresIn: 86400 }),
    },
  );
  const data = await response.json().catch(() => null);
  if (!response.ok || typeof data?.signedURL !== "string") {
    throw new Error(
      typeof data?.message === "string"
        ? data.message
        : "The content file could not be opened.",
    );
  }
  if (data.signedURL.startsWith("https://")) return data.signedURL as string;
  return `${apiUrl}/storage/v1${data.signedURL.startsWith("/") ? data.signedURL : `/${data.signedURL}`}`;
}

async function hydrateBlogPost(
  post: BlogPost,
  token = ANON_KEY,
): Promise<BlogPost> {
  const [cover, blocks] = await Promise.all([
    post.cover_image_path
      ? signContentFile(post.cover_image_path, token)
      : Promise.resolve(post.cover_image),
    Promise.all(
      post.blocks.map(async (block) =>
        block.storage_path
          ? { ...block, url: await signContentFile(block.storage_path, token) }
          : block,
      ),
    ),
  ]);
  return { ...post, cover_image: cover, blocks };
}

export async function listPublishedBlogPosts() {
  const posts = await publicQuery<BlogPost[]>(
    "/rest/v1/wli_blog_posts?select=*&status=eq.published&order=published_at.desc",
  );
  return Promise.all(posts.map((post) => hydrateBlogPost(post)));
}

export async function getPublishedBlogPost(slug: string) {
  const posts = await publicQuery<BlogPost[]>(
    `/rest/v1/wli_blog_posts?select=*&status=eq.published&slug=eq.${encodeURIComponent(slug)}&limit=1`,
  );
  return Promise.all(posts.map((post) => hydrateBlogPost(post)));
}

export async function listBlogPosts(session: CrmSession) {
  const posts = await api<BlogPost[]>(
    "/rest/v1/wli_blog_posts?select=*&order=updated_at.desc",
    {},
    session.access_token,
  );
  return Promise.all(
    posts.map((post) => hydrateBlogPost(post, session.access_token)),
  );
}

export function saveBlogPost(
  session: CrmSession,
  post: Partial<BlogPost> &
    Pick<
      BlogPost,
      | "title"
      | "slug"
      | "excerpt"
      | "author"
      | "cover_image"
      | "blocks"
      | "status"
    >,
) {
  const payload = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    author: post.author,
    cover_image: post.cover_image_path ? "" : post.cover_image,
    cover_image_path: post.cover_image_path ?? "",
    blocks: post.blocks.map((block) =>
      block.storage_path ? { ...block, url: "" } : block,
    ),
    status: post.status,
    published_at:
      post.status === "published"
        ? (post.published_at ?? new Date().toISOString())
        : null,
    created_by: session.user.id,
  };
  const path = post.id
    ? `/rest/v1/wli_blog_posts?id=eq.${encodeURIComponent(post.id)}&select=*`
    : "/rest/v1/wli_blog_posts?select=*";
  return api<BlogPost[]>(
    path,
    {
      method: post.id ? "PATCH" : "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(payload),
    },
    session.access_token,
  );
}

export function deleteBlogPost(session: CrmSession, id: string) {
  return api<void>(
    `/rest/v1/wli_blog_posts?id=eq.${encodeURIComponent(id)}`,
    { method: "DELETE", headers: { Prefer: "return=minimal" } },
    session.access_token,
  );
}

async function hydrateResource(resource: WliResource, token = ANON_KEY) {
  return resource.storage_path
    ? {
        ...resource,
        file_url: await signContentFile(resource.storage_path, token),
      }
    : resource;
}

export async function listPublishedResources(type: WliResource["type"]) {
  const resources = await publicQuery<WliResource[]>(
    `/rest/v1/wli_resources?select=*&status=eq.published&type=eq.${type}&order=sort_order.asc,created_at.desc`,
  );
  return Promise.all(resources.map((resource) => hydrateResource(resource)));
}

export async function listResources(
  session: CrmSession,
  type?: WliResource["type"],
) {
  const typeFilter = type ? `&type=eq.${type}` : "";
  const resources = await api<WliResource[]>(
    `/rest/v1/wli_resources?select=*&order=sort_order.asc,created_at.desc${typeFilter}`,
    {},
    session.access_token,
  );
  return Promise.all(
    resources.map((resource) =>
      hydrateResource(resource, session.access_token),
    ),
  );
}

export function saveResource(
  session: CrmSession,
  resource: Partial<WliResource> &
    Pick<
      WliResource,
      | "type"
      | "title"
      | "description"
      | "cover_image"
      | "file_url"
      | "storage_path"
      | "external_url"
      | "status"
      | "sort_order"
    >,
) {
  const payload = {
    type: resource.type,
    title: resource.title,
    description: resource.description,
    cover_image: resource.cover_image,
    file_url: resource.storage_path ? "" : resource.file_url,
    storage_path: resource.storage_path,
    external_url: resource.external_url,
    status: resource.status,
    sort_order: resource.sort_order,
    created_by: session.user.id,
  };
  const path = resource.id
    ? `/rest/v1/wli_resources?id=eq.${encodeURIComponent(resource.id)}&select=*`
    : "/rest/v1/wli_resources?select=*";
  return api<WliResource[]>(
    path,
    {
      method: resource.id ? "PATCH" : "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(payload),
    },
    session.access_token,
  );
}

export function deleteResource(session: CrmSession, id: string) {
  return api<void>(
    `/rest/v1/wli_resources?id=eq.${encodeURIComponent(id)}`,
    { method: "DELETE", headers: { Prefer: "return=minimal" } },
    session.access_token,
  );
}

function storagePath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

export async function uploadContentFile(
  session: CrmSession,
  file: File,
  folder: "blog" | "resources" | "covers",
) {
  const { apiUrl, anonKey } = requireConfig();
  const safeName =
    file.name
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(-100) || "upload";
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const response = await fetch(
    `${apiUrl}/storage/v1/object/wli-content/${storagePath(path)}`,
    {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "false",
      },
      body: file,
    },
  );
  if (!response.ok) {
    const details = await response.json().catch(() => null);
    throw new Error(
      typeof details?.message === "string"
        ? details.message
        : "The file could not be uploaded.",
    );
  }
  return { path, url: await signContentFile(path, session.access_token) };
}

export async function deleteContentFile(session: CrmSession, path: string) {
  const { apiUrl, anonKey } = requireConfig();
  const response = await fetch(`${apiUrl}/storage/v1/object/wli-content`, {
    method: "DELETE",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefixes: [path] }),
  });
  if (!response.ok) {
    const details = await response.json().catch(() => null);
    throw new Error(
      typeof details?.message === "string"
        ? details.message
        : "The uploaded file could not be removed.",
    );
  }
}
