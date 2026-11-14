import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  FileText,
  Headphones,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Video,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteBlogPost,
  deleteContentFile,
  deleteResource,
  listBlogPosts,
  listCrmEnquiries,
  listResources,
  saveBlogPost,
  saveResource,
  updateCrmEnquiry,
  uploadContentFile,
  type BlogBlock,
  type BlogBlockType,
  type BlogPost,
  type CrmEnquiry,
  type CrmSession,
  type WliResource,
} from "@/lib/crm-api";

type Section = "overview" | "enquiries" | "blog" | "resources";
type ResourceType = WliResource["type"];
const statuses: CrmEnquiry["status"][] = [
  "new",
  "in_progress",
  "waiting",
  "resolved",
  "archived",
];
const statusLabels: Record<CrmEnquiry["status"], string> = {
  new: "New",
  in_progress: "In progress",
  waiting: "Waiting",
  resolved: "Resolved",
  archived: "Archived",
};
const resourceNames: Record<ResourceType, string> = {
  book: "Books",
  audio: "Audio",
  video: "Video",
};

export function StaffWorkspace({
  session,
  onSignOut,
}: {
  session: CrmSession;
  onSignOut: () => void;
}) {
  const [section, setSection] = useState<Section>("overview");
  const [enquiries, setEnquiries] = useState<CrmEnquiry[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [resources, setResources] = useState<WliResource[]>([]);
  const [resourceType, setResourceType] = useState<ResourceType>("book");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    Promise.allSettled([
      listCrmEnquiries(session),
      listBlogPosts(session),
      listResources(session),
    ])
      .then(([e, p, r]) => {
        if (cancelled) return;
        if (e.status === "fulfilled") setEnquiries(e.value);
        if (p.status === "fulfilled") setPosts(p.value);
        if (r.status === "fulfilled") setResources(r.value);
        const failures = [e, p, r].filter(
          (item): item is PromiseRejectedResult => item.status === "rejected",
        );
        if (failures.length)
          setError(
            `Some workspace data could not load. Confirm the latest Supabase migration has been applied. ${failures.map((item) => (item.reason instanceof Error ? item.reason.message : "Request failed")).join(" · ")}`,
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [session, refreshKey]);

  const nav: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "enquiries", label: "Enquiries", icon: FileText },
    { id: "blog", label: "Blog", icon: Newspaper },
    { id: "resources", label: "Resources", icon: BookOpen },
  ];
  return (
    <main className="min-h-[75vh] bg-[#faf9fb]">
      <div className="container-page min-w-0 py-8 sm:py-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="eyebrow">WLI staff workspace</p>
            <h1 className="mt-2 text-3xl font-medium text-purple">
              Content & enquiries
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setRefreshKey((v) => v + 1)}
              disabled={loading}
            >
              <RefreshCw className="size-4" aria-hidden /> Refresh
            </Button>
            <Button variant="outline" onClick={onSignOut}>
              <LogOut className="size-4" aria-hidden /> Sign out
            </Button>
          </div>
        </header>
        <nav
          aria-label="Admin sections"
          className="-mx-1 mt-5 flex gap-1 overflow-x-auto px-1 pb-2"
        >
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors ${section === id ? "bg-primary text-white" : "text-muted-foreground hover:bg-white hover:text-foreground"}`}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </button>
          ))}
        </nav>
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm"
          >
            {error}
          </p>
        )}
        {loading && (
          <p role="status" className="mt-5 text-sm text-muted-foreground">
            Loading workspace…
          </p>
        )}
        {!loading && section === "overview" && (
          <Overview
            enquiries={enquiries}
            posts={posts}
            resources={resources}
            onNavigate={setSection}
          />
        )}
        {!loading && section === "enquiries" && (
          <Enquiries
            enquiries={enquiries}
            session={session}
            query={query}
            setQuery={setQuery}
            onUpdate={(item) =>
              setEnquiries((list) =>
                list.map((x) => (x.id === item.id ? item : x)),
              )
            }
          />
        )}
        {!loading && section === "blog" && (
          <BlogSection
            posts={posts}
            session={session}
            onRefresh={() => setRefreshKey((v) => v + 1)}
          />
        )}
        {!loading && section === "resources" && (
          <ResourcesSection
            resources={resources}
            type={resourceType}
            setType={setResourceType}
            session={session}
            onRefresh={() => setRefreshKey((v) => v + 1)}
          />
        )}
      </div>
    </main>
  );
}

function Overview({
  enquiries,
  posts,
  resources,
  onNavigate,
}: {
  enquiries: CrmEnquiry[];
  posts: BlogPost[];
  resources: WliResource[];
  onNavigate: (s: Section) => void;
}) {
  const counts = [
    {
      label: "Open enquiries",
      value: enquiries.filter(
        (e) => !["resolved", "archived"].includes(e.status),
      ).length,
      icon: FileText,
      section: "enquiries" as const,
    },
    {
      label: "Published posts",
      value: posts.filter((p) => p.status === "published").length,
      icon: Newspaper,
      section: "blog" as const,
    },
    {
      label: "Published resources",
      value: resources.filter((r) => r.status === "published").length,
      icon: BookOpen,
      section: "resources" as const,
    },
  ];
  return (
    <section className="pt-7">
      <h2 className="text-xl font-semibold">Workspace overview</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Your latest enquiries and published WLI content.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {counts.map(({ label, value, icon: Icon, section }) => (
          <button
            key={label}
            onClick={() => onNavigate(section)}
            className="rounded-lg border border-border bg-white p-5 text-left hover:border-primary/50"
          >
            <span className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm">{label}</span>
              <Icon className="size-4" aria-hidden />
            </span>
            <span className="mt-3 block text-3xl font-semibold">{value}</span>
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-5">
          <div className="flex justify-between">
            <h3 className="font-semibold">Recent enquiries</h3>
            <button
              className="text-sm font-semibold text-primary"
              onClick={() => onNavigate("enquiries")}
            >
              View all
            </button>
          </div>
          {enquiries.slice(0, 4).map((e) => (
            <div
              key={e.id}
              className="flex justify-between gap-3 border-b border-border py-3 last:border-0"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {e.name}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {e.message}
                </span>
              </span>
              <StatusBadge status={e.status} />
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border bg-white p-5">
          <div className="flex justify-between">
            <h3 className="font-semibold">Recent content</h3>
            <button
              className="text-sm font-semibold text-primary"
              onClick={() => onNavigate("blog")}
            >
              Manage blog
            </button>
          </div>
          {posts.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="flex justify-between gap-3 border-b border-border py-3 last:border-0"
            >
              <span className="truncate text-sm font-medium">{p.title}</span>
              <StatusBadge status={p.status} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex h-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${status === "published" || status === "resolved" ? "bg-emerald-50 text-emerald-800" : status === "new" ? "bg-purple-50 text-purple-800" : "bg-neutral-100 text-neutral-700"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function Enquiries({
  enquiries,
  session,
  query,
  setQuery,
  onUpdate,
}: {
  enquiries: CrmEnquiry[];
  session: CrmSession;
  query: string;
  setQuery: (v: string) => void;
  onUpdate: (e: CrmEnquiry) => void;
}) {
  const [selected, setSelected] = useState<CrmEnquiry | null>(null);
  const [filter, setFilter] = useState("all");
  const filtered = useMemo(
    () =>
      enquiries.filter(
        (e) =>
          (filter === "all" || e.status === filter) &&
          (!query.trim() ||
            `${e.name} ${e.email} ${e.phone ?? ""} ${e.message}`
              .toLowerCase()
              .includes(query.toLowerCase())),
      ),
    [enquiries, filter, query],
  );
  return (
    <section className="pt-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-medium text-purple">Enquiries</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select a message to review it and update its follow-up status.
          </p>
        </div>
        <div className="flex gap-2">
          <label className="relative">
            <Search
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search enquiries"
              className="h-10 w-full pl-9 sm:w-64"
            />
            <span className="sr-only">Search enquiries</span>
          </label>
          <select
            aria-label="Filter by status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-white px-3 text-sm"
          >
            <option value="all">All statuses</option>
            {statuses.map((s) => (
              <option value={s} key={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5 overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Message</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((e) => (
              <tr
                key={e.id}
                tabIndex={0}
                onClick={() => setSelected(e)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelected(e);
                  }
                }}
                className="cursor-pointer hover:bg-purple-50/40 focus:bg-purple-50/40"
              >
                <td className="max-w-52 px-4 py-3">
                  <span className="block truncate font-semibold">{e.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {e.email}
                  </span>
                </td>
                <td className="max-w-md px-4 py-3">
                  <span className="line-clamp-2 text-muted-foreground">
                    {e.message}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={e.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                  {new Date(e.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No enquiries match your filters.
          </p>
        )}
      </div>
      {selected && (
        <EnquiryDetail
          enquiry={selected}
          session={session}
          onClose={() => setSelected(null)}
          onSaved={(e) => {
            onUpdate(e);
            setSelected(e);
          }}
        />
      )}
    </section>
  );
}

function EnquiryDetail({
  enquiry,
  session,
  onClose,
  onSaved,
}: {
  enquiry: CrmEnquiry;
  session: CrmSession;
  onClose: () => void;
  onSaved: (e: CrmEnquiry) => void;
}) {
  const [status, setStatus] = useState(enquiry.status);
  const [notes, setNotes] = useState(enquiry.internal_notes);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    setStatus(enquiry.status);
    setNotes(enquiry.internal_notes);
  }, [enquiry]);
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-title"
        className="h-full w-full max-w-xl overflow-y-auto bg-white p-5 shadow-2xl sm:p-7"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow">Contact enquiry</p>
            <h3
              id="enquiry-title"
              className="mt-2 text-2xl font-medium text-purple"
            >
              {enquiry.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close enquiry"
            className="rounded-md p-2 hover:bg-neutral-100"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-5 space-y-1 text-sm">
          <a
            className="block text-primary underline"
            href={`mailto:${enquiry.email}`}
          >
            {enquiry.email}
          </a>
          {enquiry.phone && (
            <a
              className="block text-primary underline"
              href={`tel:${enquiry.phone}`}
            >
              {enquiry.phone}
            </a>
          )}
          <time className="block pt-2 text-xs text-muted-foreground">
            {new Date(enquiry.created_at).toLocaleString()}
          </time>
        </div>
        <div className="mt-6 rounded-lg bg-neutral-50 p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {enquiry.message}
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-semibold">
            Status
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as CrmEnquiry["status"])
              }
              className="mt-2 h-11 w-full rounded-md border border-input bg-white px-3 font-normal"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Internal notes
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              maxLength={5000}
              className="mt-2"
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button
            disabled={
              busy ||
              (status === enquiry.status && notes === enquiry.internal_notes)
            }
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                const [updated] = await updateCrmEnquiry(session, enquiry.id, {
                  status,
                  internal_notes: notes,
                });
                if (updated) onSaved(updated);
              } catch (e) {
                setError(
                  e instanceof Error ? e.message : "Could not save enquiry.",
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </section>
    </div>
  );
}

function BlogSection({
  posts,
  session,
  onRefresh,
}: {
  posts: BlogPost[];
  session: CrmSession;
  onRefresh: () => void;
}) {
  const [editing, setEditing] = useState<BlogPost | null | "new">(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const filtered = posts.filter((p) =>
    `${p.title} ${p.excerpt}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="pt-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-medium text-purple">Blog</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create original posts and publish them to Insights.
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus className="size-4" aria-hidden /> Write a post
        </Button>
      </div>
      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="mt-5">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts"
          className="h-10 max-w-sm"
        />
      </div>
      <div className="mt-4 grid gap-3">
        {filtered.map((p) => (
          <article
            key={p.id}
            className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-white p-4 sm:flex-row sm:items-center"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate font-semibold">{p.title}</h3>
                <StatusBadge status={p.status} />
              </div>
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                {p.excerpt || "No excerpt yet"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Updated {new Date(p.updated_at).toLocaleDateString()} ·
                /insights/{p.slug}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" onClick={() => setEditing(p)}>
                Edit
              </Button>
              <Button
                variant="outline"
                className="text-destructive"
                onClick={async () => {
                  if (!window.confirm(`Delete “${p.title}”?`)) return;
                  setError("");
                  try {
                    await deleteBlogPost(session, p.id);
                    onRefresh();
                    const paths = [
                      p.cover_image_path,
                      ...p.blocks.map((block) => block.storage_path ?? ""),
                    ].filter(Boolean);
                    const cleanup = await Promise.allSettled(
                      paths.map((path) => deleteContentFile(session, path)),
                    );
                    if (cleanup.some((result) => result.status === "rejected"))
                      setError(
                        "Post deleted. One or more uploaded images could not be removed from Storage.",
                      );
                  } catch (e) {
                    setError(
                      e instanceof Error ? e.message : "Could not delete post.",
                    );
                  }
                }}
              >
                <Trash2 className="size-4" aria-hidden />
                <span className="sr-only">Delete {p.title}</span>
              </Button>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No posts yet. Start with a new post.
          </div>
        )}
      </div>
      {editing && (
        <BlogEditor
          post={editing === "new" ? null : editing}
          session={session}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            onRefresh();
          }}
        />
      )}
    </section>
  );
}

function BlogEditor({
  post,
  session,
  onClose,
  onSaved,
}: {
  post: BlogPost | null;
  session: CrmSession;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [author, setAuthor] = useState(
    post?.author ?? "Wisdom Leadership Initiatives",
  );
  const [cover, setCover] = useState(post?.cover_image ?? "");
  const [coverPath, setCoverPath] = useState(post?.cover_image_path ?? "");
  const [blocks, setBlocks] = useState<BlogBlock[]>(post?.blocks ?? []);
  const [status, setStatus] = useState<BlogPost["status"]>(
    post?.status ?? "draft",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const changeTitle = (value: string) => {
    setTitle(value);
    if (!post) setSlug(slugify(value));
  };
  const appendBlock = (type: BlogBlockType) =>
    setBlocks((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        text: "",
        ...(type === "image" ? { url: "" } : {}),
      },
    ]);
  const updateBlock = (id: string, patch: Partial<BlogBlock>) =>
    setBlocks((current) =>
      current.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    );
  const moveBlock = (index: number, by: number) =>
    setBlocks((current) => {
      const next = [...current];
      const target = index + by;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  const upload = async (file: File, folder: "blog" | "covers") =>
    uploadContentFile(session, file, folder);
  return (
    <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/50 p-2 sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="blog-editor-title"
        className="my-auto w-full max-w-5xl rounded-xl bg-white shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="eyebrow">Insights editor</p>
            <h3 id="blog-editor-title" className="mt-1 text-xl font-semibold">
              {post ? "Edit post" : "Create a post"}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setPreview((v) => !v)}>
              {preview ? "Back to editor" : "Preview"}
            </Button>
            <button
              onClick={onClose}
              className="rounded-md p-2 hover:bg-neutral-100"
              aria-label="Close editor"
            >
              <X className="size-5" />
            </button>
          </div>
        </header>
        {preview ? (
          <BlogPreview
            title={title}
            excerpt={excerpt}
            author={author}
            cover={cover}
            blocks={blocks}
          />
        ) : (
          <form
            className="grid max-h-[calc(100vh-7rem)] gap-6 overflow-y-auto p-5 lg:grid-cols-[minmax(0,1fr)_17rem] sm:p-7"
            onSubmit={async (event) => {
              event.preventDefault();
              setBusy(true);
              setError("");
              try {
                const [saved] = await saveBlogPost(session, {
                  ...(post
                    ? { id: post.id, published_at: post.published_at }
                    : {}),
                  title: title.trim(),
                  slug: slugify(slug),
                  excerpt: excerpt.trim(),
                  author: author.trim(),
                  cover_image: cover,
                  cover_image_path: coverPath,
                  blocks,
                  status,
                });
                if (!saved) throw new Error("The post could not be saved.");
                onSaved();
              } catch (e) {
                setError(
                  e instanceof Error ? e.message : "Could not save post.",
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            <div className="min-w-0 space-y-5">
              <label className="block text-sm font-semibold">
                Post title
                <Input
                  required
                  maxLength={180}
                  value={title}
                  onChange={(e) => changeTitle(e.target.value)}
                  className="mt-2 h-12 text-lg"
                  placeholder="A clear, specific headline"
                />
              </label>
              <label className="block text-sm font-semibold">
                URL slug
                <Input
                  required
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  className="mt-2"
                />
              </label>
              <label className="block text-sm font-semibold">
                Short introduction
                <Textarea
                  maxLength={500}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="mt-2"
                  placeholder="A concise summary for the Insights page"
                />
              </label>
              <div>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-semibold">Article content</h4>
                  <p className="text-xs text-muted-foreground">
                    Build the post with a mix of content blocks.
                  </p>
                </div>
                <div className="space-y-3">
                  {blocks.map((block, i) => (
                    <div
                      key={block.id}
                      className="rounded-lg border border-border bg-neutral-50 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                          {block.type}
                        </span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            disabled={i === 0}
                            onClick={() => moveBlock(i, -1)}
                            className="rounded px-2 py-1 text-xs hover:bg-white disabled:opacity-30"
                            aria-label="Move block up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            disabled={i === blocks.length - 1}
                            onClick={() => moveBlock(i, 1)}
                            className="rounded px-2 py-1 text-xs hover:bg-white disabled:opacity-30"
                            aria-label="Move block down"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setBlocks((current) =>
                                current.filter((b) => b.id !== block.id),
                              )
                            }
                            className="rounded px-2 py-1 text-xs text-destructive hover:bg-white"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      {block.type === "image" ? (
                        <div className="space-y-2">
                          <Input
                            value={block.storage_path ? "" : (block.url ?? "")}
                            onChange={(e) =>
                              updateBlock(block.id, {
                                url: e.target.value,
                                storage_path: "",
                              })
                            }
                            placeholder="Image URL or upload below"
                          />
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const uploaded = await upload(file, "blog");
                                updateBlock(block.id, {
                                  url: uploaded.url,
                                  storage_path: uploaded.path,
                                });
                              } catch (reason) {
                                setError(
                                  reason instanceof Error
                                    ? reason.message
                                    : "Image upload failed.",
                                );
                              }
                            }}
                            className="block w-full text-xs"
                          />
                          {block.url && (
                            <img
                              src={block.url}
                              alt={block.text || "Article image"}
                              className="max-h-52 rounded object-cover"
                            />
                          )}
                          <Input
                            value={block.text}
                            onChange={(e) =>
                              updateBlock(block.id, { text: e.target.value })
                            }
                            placeholder="Image caption / alt text"
                          />
                        </div>
                      ) : (
                        <Textarea
                          value={block.text}
                          onChange={(e) =>
                            updateBlock(block.id, { text: e.target.value })
                          }
                          rows={
                            block.type === "paragraph"
                              ? 5
                              : block.type === "list"
                                ? 4
                                : 2
                          }
                          placeholder={
                            block.type === "list"
                              ? "One item per line"
                              : `Write the ${block.type} text…`
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {(
                    [
                      "heading",
                      "paragraph",
                      "image",
                      "quote",
                      "list",
                      "callout",
                    ] as BlogBlockType[]
                  ).map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendBlock(type)}
                    >
                      <Plus className="size-3.5" aria-hidden />
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <aside className="space-y-4 rounded-lg border border-border p-4">
              <h4 className="font-semibold">Post settings</h4>
              <label className="block text-sm font-medium">
                Author
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="mt-1"
                />
              </label>
              <label className="block text-sm font-medium">
                Cover image URL
                <Input
                  value={coverPath || cover.startsWith("/") ? "" : cover}
                  onChange={(e) => {
                    setCover(e.target.value);
                    setCoverPath("");
                  }}
                  className="mt-1"
                  placeholder="https://…"
                />
              </label>
              <label className="block text-sm font-medium">
                Upload cover
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="mt-2 block w-full text-xs"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const uploaded = await upload(file, "covers");
                      setCover(uploaded.url);
                      setCoverPath(uploaded.path);
                    } catch (reason) {
                      setError(
                        reason instanceof Error
                          ? reason.message
                          : "Cover upload failed.",
                      );
                    }
                  }}
                />
              </label>
              {cover && (
                <img
                  src={cover}
                  alt="Cover preview"
                  className="aspect-video w-full rounded object-cover"
                />
              )}
              <label className="block text-sm font-medium">
                Publishing
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as BlogPost["status"])
                  }
                  className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3"
                >
                  <option value="draft">Save as draft</option>
                  <option value="published">Publish</option>
                </select>
              </label>
              <div className="rounded-md bg-neutral-50 p-3 text-xs leading-relaxed text-muted-foreground">
                Drafts stay private. Published posts appear on the public
                Insights page.
              </div>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <div className="flex flex-col gap-2">
                <Button type="submit" disabled={busy || !title.trim()}>
                  {busy
                    ? "Saving…"
                    : status === "published"
                      ? "Publish post"
                      : "Save draft"}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </aside>
          </form>
        )}
      </section>
    </div>
  );
}

function BlogPreview({
  title,
  excerpt,
  author,
  cover,
  blocks,
}: {
  title: string;
  excerpt: string;
  author: string;
  cover: string;
  blocks: BlogBlock[];
}) {
  return (
    <article className="max-h-[calc(100vh-7rem)] overflow-y-auto">
      <header className="mx-auto max-w-3xl px-6 py-10">
        <p className="eyebrow">WLI Insights</p>
        <h1 className="mt-4 text-4xl font-medium text-purple">
          {title || "Your post title"}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{excerpt}</p>
        <p className="mt-4 text-sm text-muted-foreground">By {author}</p>
        {cover && (
          <img
            className="mt-7 aspect-[16/8] w-full rounded-lg object-cover"
            src={cover}
            alt=""
          />
        )}
      </header>
      <div className="mx-auto max-w-2xl space-y-6 px-6 pb-12 text-lg leading-relaxed">
        {blocks.map((b) => (
          <BlockPreview key={b.id} block={b} />
        ))}
      </div>
    </article>
  );
}
function BlockPreview({ block }: { block: BlogBlock }) {
  if (block.type === "image")
    return block.url ? (
      <figure>
        <img src={block.url} alt={block.text} className="w-full rounded-lg" />
        {block.text && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground">
            {block.text}
          </figcaption>
        )}
      </figure>
    ) : null;
  if (block.type === "heading")
    return (
      <h2 className="pt-3 text-2xl font-medium text-purple">
        {block.text || "Section heading"}
      </h2>
    );
  if (block.type === "quote")
    return (
      <blockquote className="border-l-2 border-brand-purple pl-5 font-display text-2xl italic text-purple">
        {block.text}
      </blockquote>
    );
  if (block.type === "list")
    return (
      <ul className="list-disc space-y-2 pl-6">
        {block.text
          .split("\n")
          .filter(Boolean)
          .map((v, i) => (
            <li key={i}>{v}</li>
          ))}
      </ul>
    );
  if (block.type === "callout")
    return (
      <aside className="rounded-lg bg-tint p-5 text-base">{block.text}</aside>
    );
  return <p className="whitespace-pre-wrap">{block.text}</p>;
}

function ResourcesSection({
  resources,
  type,
  setType,
  session,
  onRefresh,
}: {
  resources: WliResource[];
  type: ResourceType;
  setType: (t: ResourceType) => void;
  session: CrmSession;
  onRefresh: () => void;
}) {
  const [editing, setEditing] = useState<WliResource | "new" | null>(null);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const [importCount, setImportCount] = useState(0);
  const filtered = resources.filter((r) => r.type === type);
  const legacyBooks = filtered.filter(
    (r) =>
      r.type === "book" &&
      r.file_url.startsWith("/resources/books/") &&
      !r.storage_path,
  );
  const ResourceIcon =
    type === "book" ? BookOpen : type === "audio" ? Headphones : Video;
  return (
    <section className="min-w-0 max-w-full overflow-x-clip pt-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-medium text-purple">
            Books, audio & video
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage what visitors can find in Program & Resources.
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus className="size-4" aria-hidden /> Add {type}
        </Button>
      </div>
      <div className="mt-5 flex gap-2">
        {(["book", "audio", "video"] as ResourceType[]).map((t) => {
          const Icon =
            t === "book" ? BookOpen : t === "audio" ? Headphones : Video;
          return (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold ${t === type ? "bg-primary text-white" : "border border-border bg-white text-muted-foreground"}`}
            >
              <Icon className="size-4" />
              {resourceNames[t]}
            </button>
          );
        })}
      </div>
      {type === "book" && legacyBooks.length > 0 && (
        <div className="mt-4 flex flex-col justify-between gap-3 rounded-md border border-border bg-purple-50/60 p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-purple">
              Move the current PDFs into Supabase Storage
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Import the {legacyBooks.length} existing project books so their
              files can be managed with the library.
            </p>
            {importing && (
              <p role="status" className="mt-1 text-xs text-muted-foreground">
                Imported {importCount} of {legacyBooks.length}…
              </p>
            )}
          </div>
          <Button
            variant="outline"
            disabled={importing}
            onClick={async () => {
              setImporting(true);
              setImportCount(0);
              setError("");
              try {
                for (const item of legacyBooks) {
                  const response = await fetch(item.file_url);
                  if (!response.ok)
                    throw new Error(
                      `Could not read ${item.title} from the current project.`,
                    );
                  const file = new File(
                    [await response.blob()],
                    item.file_url.split("/").pop() ??
                      `${slugify(item.title)}.pdf`,
                    { type: "application/pdf" },
                  );
                  const uploaded = await uploadContentFile(
                    session,
                    file,
                    "resources",
                  );
                  try {
                    const [saved] = await saveResource(session, {
                      id: item.id,
                      type: item.type,
                      title: item.title,
                      description: item.description,
                      cover_image: item.cover_image,
                      cover_image_path: item.cover_image_path,
                      file_url: uploaded.url,
                      storage_path: uploaded.path,
                      external_url: "",
                      status: item.status,
                      sort_order: item.sort_order,
                    });
                    if (!saved)
                      throw new Error("The book record was not updated.");
                  } catch (reason) {
                    await deleteContentFile(session, uploaded.path).catch(
                      () => {},
                    );
                    throw reason;
                  }
                  setImportCount((n) => n + 1);
                }
                onRefresh();
              } catch (e) {
                setError(
                  e instanceof Error
                    ? e.message
                    : "Book import failed. Completed books remain imported; retry to continue.",
                );
              } finally {
                setImporting(false);
              }
            }}
          >
            {importing ? "Importing…" : "Import existing books"}
          </Button>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="mt-4 grid min-w-0 max-w-full gap-3 overflow-hidden">
        {filtered.map((r) => (
          <article
            key={r.id}
            className="flex w-full min-w-0 max-w-full flex-col justify-between gap-4 overflow-hidden rounded-lg border border-border bg-white p-4 sm:flex-row sm:items-center"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-purple-50 text-primary">
                <ResourceIcon className="size-5" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-semibold">{r.title}</h3>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {r.description ||
                    (r.type === "video" ? r.external_url : r.file_url)}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2 self-end sm:self-auto">
              <Button variant="outline" onClick={() => setEditing(r)}>
                Edit
              </Button>
              <Button
                variant="outline"
                className="text-destructive"
                onClick={async () => {
                  if (
                    !window.confirm(
                      `Delete “${r.title}”? This also removes its uploaded file.`,
                    )
                  )
                    return;
                  setError("");
                  try {
                    await deleteResource(session, r.id);
                    onRefresh();
                    const uploadedPaths = [
                      r.storage_path,
                      r.cover_image_path,
                    ].filter(Boolean);
                    for (const path of uploadedPaths) {
                      try {
                        await deleteContentFile(session, path);
                      } catch {
                        setError(
                          "The resource was deleted, but one of its uploaded files could not be removed from Storage.",
                        );
                      }
                    }
                  } catch (e) {
                    setError(
                      e instanceof Error
                        ? e.message
                        : "Could not delete resource.",
                    );
                  }
                }}
              >
                <Trash2 className="size-4" aria-hidden />
                <span className="sr-only">Delete {r.title}</span>
              </Button>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No {resourceNames[type].toLowerCase()} yet.
          </div>
        )}
      </div>
      {editing && (
        <ResourceEditor
          resource={editing === "new" ? null : editing}
          type={type}
          session={session}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            onRefresh();
          }}
        />
      )}
    </section>
  );
}

function ResourceEditor({
  resource,
  type,
  session,
  onClose,
  onSaved,
}: {
  resource: WliResource | null;
  type: ResourceType;
  session: CrmSession;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(resource?.title ?? "");
  const [description, setDescription] = useState(resource?.description ?? "");
  const [cover, setCover] = useState(resource?.cover_image ?? "");
  const [coverImagePath, setCoverImagePath] = useState(
    resource?.cover_image_path ?? "",
  );
  const [fileUrl, setFileUrl] = useState(resource?.file_url ?? "");
  const [storagePath, setStoragePath] = useState(resource?.storage_path ?? "");
  const [externalUrl, setExternalUrl] = useState(resource?.external_url ?? "");
  const [status, setStatus] = useState<WliResource["status"]>(
    resource?.status ?? "draft",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const chooseFile = async (file: File) => {
    if (type === "book" && file.type !== "application/pdf")
      throw new Error("Choose a PDF file for a book.");
    if (type === "audio" && !file.type.startsWith("audio/"))
      throw new Error("Choose an audio file.");
    if (file.size > 100 * 1024 * 1024)
      throw new Error("Files must be 100 MB or smaller.");
    const uploaded = await uploadContentFile(session, file, "resources");
    setFileUrl(uploaded.url);
    setStoragePath(uploaded.path);
  };
  const chooseCoverImage = async (file: File) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];
    if (!allowedTypes.includes(file.type))
      throw new Error("Choose a JPG, PNG, WebP, or AVIF image.");
    if (file.size > 10 * 1024 * 1024)
      throw new Error("Cover images must be 10 MB or smaller.");
    const uploaded = await uploadContentFile(session, file, "covers");
    setCover(uploaded.url);
    setCoverImagePath(uploaded.path);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3">
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="resource-form-title"
        onSubmit={async (event) => {
          event.preventDefault();
          if (type === "video" && !isYouTubeUrl(externalUrl)) {
            setError("Enter a valid YouTube video link.");
            return;
          }
          setBusy(true);
          setError("");
          try {
            const [saved] = await saveResource(session, {
              ...(resource ? { id: resource.id } : {}),
              type,
              title: title.trim(),
              description: description.trim(),
              cover_image: cover,
              cover_image_path: coverImagePath,
              file_url: type === "video" ? "" : fileUrl,
              storage_path: type === "video" ? "" : storagePath,
              external_url: type === "video" ? externalUrl.trim() : "",
              status,
              sort_order: resource?.sort_order ?? 0,
            });
            if (!saved) throw new Error("The resource could not be saved.");
            if (
              resource?.cover_image_path &&
              resource.cover_image_path !== coverImagePath
            )
              await deleteContentFile(session, resource.cover_image_path);
            if (resource?.storage_path && resource.storage_path !== storagePath)
              await deleteContentFile(session, resource.storage_path);
            onSaved();
          } catch (e) {
            setError(
              e instanceof Error ? e.message : "Could not save resource.",
            );
          } finally {
            setBusy(false);
          }
        }}
        className="my-auto w-full max-w-xl space-y-4 rounded-xl bg-white p-5 shadow-2xl sm:p-7"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow">{resourceNames[type]}</p>
            <h3 id="resource-form-title" className="mt-1 text-xl font-semibold">
              {resource ? "Edit item" : `Add ${type}`}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-2 hover:bg-neutral-100"
          >
            <X className="size-5" />
          </button>
        </div>
        <label className="block text-sm font-semibold">
          Title
          <Input
            required
            maxLength={180}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
        </label>
        <label className="block text-sm font-semibold">
          Description
          <Textarea
            maxLength={1000}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
          />
        </label>
        {type === "video" ? (
          <label className="block text-sm font-semibold">
            YouTube link
            <Input
              required
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              className="mt-1"
              placeholder="https://www.youtube.com/watch?v=…"
            />
          </label>
        ) : (
          <>
            <label className="block text-sm font-semibold">
              {type === "book" ? "PDF file" : "Audio file"}
              <input
                type="file"
                accept={type === "book" ? "application/pdf" : "audio/*"}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setBusy(true);
                  try {
                    await chooseFile(file);
                  } catch (reason) {
                    setError(
                      reason instanceof Error
                        ? reason.message
                        : "Upload failed.",
                    );
                  } finally {
                    setBusy(false);
                  }
                }}
                className="mt-2 block w-full text-sm"
              />
            </label>
            <label className="block text-sm font-medium">
              Or use an existing file URL
              <Input
                type="url"
                value={storagePath || fileUrl.startsWith("/") ? "" : fileUrl}
                onChange={(e) => {
                  setFileUrl(e.target.value);
                  setStoragePath("");
                }}
                className="mt-1"
                placeholder="https://…"
              />
            </label>
            <p className="text-xs text-muted-foreground">
              {storagePath
                ? "Uploaded to WLI Supabase Storage."
                : fileUrl.startsWith("/")
                  ? `Current project file: ${fileUrl}`
                  : "PDF and audio uploads up to 100 MB are supported."}
            </p>
          </>
        )}
        <div className="space-y-2">
          <label className="block text-sm font-semibold">
            Cover image
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setBusy(true);
                setError("");
                try {
                  await chooseCoverImage(file);
                } catch (reason) {
                  setError(
                    reason instanceof Error
                      ? reason.message
                      : "Cover image upload failed.",
                  );
                } finally {
                  setBusy(false);
                  e.target.value = "";
                }
              }}
              className="mt-1 block w-full text-sm"
            />
          </label>
          <label className="block text-sm font-medium">
            Or use an image URL
            <Input
              type="url"
              value={coverImagePath || cover.startsWith("/") ? "" : cover}
              onChange={(e) => {
                setCover(e.target.value);
                setCoverImagePath("");
              }}
              className="mt-1"
              placeholder="Optional https://…"
            />
          </label>
          {cover && (
            <img
              src={cover}
              alt="Cover image preview"
              className="h-28 w-44 rounded-md border border-border object-cover"
            />
          )}
          <p className="text-xs text-muted-foreground">
            Upload a JPG, PNG, WebP, or AVIF image up to 10 MB, or paste an
            image URL.
          </p>
        </div>
        <label className="block text-sm font-medium">
          Visibility
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as WliResource["status"])}
            className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              busy ||
              !title.trim() ||
              (type === "video" ? !externalUrl.trim() : !fileUrl.trim())
            }
          >
            {busy ? "Saving…" : "Save resource"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
function isYouTubeUrl(value: string) {
  try {
    const url = new URL(value);
    const hostOk = [
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "youtu.be",
    ].includes(url.hostname);
    const id =
      url.hostname === "youtu.be"
        ? url.pathname.slice(1)
        : (url.searchParams.get("v") ?? "");
    return (
      url.protocol === "https:" && hostOk && /^[A-Za-z0-9_-]{11}$/.test(id)
    );
  } catch {
    return false;
  }
}
