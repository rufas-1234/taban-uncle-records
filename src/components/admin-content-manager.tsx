"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  FileText,
  Images,
  LogOut,
  Music2,
  Search,
  Shield,
  Users,
  UserRound,
  ClipboardList,
  ChevronDown,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import type { CultureMediaType } from "@/lib/culture-seed";
import { ImageUploadField } from "@/components/image-upload-field";
import { CreativeContentManager } from "@/components/creative-content-manager";
import { SiteContentManager } from "@/components/site-content-manager";
import { YouTubeVideoPreview } from "@/components/youtube-video-preview";
import { PublisherManagement } from "@/components/publisher-management";
import { BookingInbox } from "@/components/booking-inbox";
import { AdminContentSearch } from "@/components/admin-content-search";

type AdminArtist = {
  id: string;
  slug: string;
  name: string;
  culture: string;
  role: string;
  bio: string;
  imageUrl: string | null;
  sourceUrl: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  _count?: { media: number };
};

type AdminMedia = {
  id: string;
  title: string;
  mediaType: CultureMediaType;
  culture: string;
  description: string;
  youtubeUrl: string | null;
  sourceName: string | null;
  imageUrl: string | null;
  artistId: string | null;
  artist: { id: string; name: string } | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

type ArtistDraft = {
  name: string;
  culture: string;
  role: string;
  bio: string;
  imageUrl: string;
  sourceUrl: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

type MediaDraft = {
  title: string;
  mediaType: AdminMedia["mediaType"];
  culture: string;
  description: string;
  youtubeUrl: string;
  sourceName: string;
  imageUrl: string;
  artistId: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

const emptyArtist: ArtistDraft = {
  name: "",
  culture: "Pojulu",
  role: "Recording artist",
  bio: "",
  imageUrl: "",
  sourceUrl: "",
  featured: false,
  published: false,
  sortOrder: 0,
};

const emptyMedia: MediaDraft = {
  title: "",
  mediaType: "SONG",
  culture: "Pojulu",
  description: "",
  youtubeUrl: "",
  sourceName: "",
  imageUrl: "",
  artistId: "",
  featured: false,
  published: false,
  sortOrder: 0,
};

function errorText(value: unknown) {
  if (typeof value === "object" && value !== null && "error" in value) {
    if (typeof value.error === "string") return value.error;
    if (typeof value.error === "object" && value.error !== null) {
      const fieldErrors = Object.entries(value.error)
        .flatMap(([field, messages]) => Array.isArray(messages) ? messages.map((message) => `${field}: ${String(message)}`) : [])
        .join("; ");
      if (fieldErrors) return `Please correct: ${fieldErrors}`;
    }
    return "Check the required fields and make sure all media links are valid.";
  }

  return "The admin service returned an unexpected response.";
}

function fieldClassName() {
  return "editorial-input mt-1";
}

const adminNavigationGroups = [
  {
    label: "Culture",
    items: [
      { id: "admin-artists", label: "Artist profiles", icon: Users },
      { id: "admin-culture", label: "Culture features", icon: Music2 },
    ],
  },
  {
    label: "Publishing",
    items: [
      { id: "admin-pricing", label: "Pricing", icon: CircleDollarSign },
      { id: "admin-news", label: "News & insights", icon: FileText },
      { id: "admin-events", label: "Events", icon: CalendarDays },
    ],
  },
  {
    label: "Studio",
    items: [
      { id: "admin-team", label: "Team members", icon: UserRound },
      { id: "admin-portfolio", label: "Portfolio", icon: Images },
      { id: "admin-bookings", label: "Bookings", icon: ClipboardList },
      { id: "admin-accounts", label: "Publisher accounts", icon: Shield },
    ],
  },
];

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">
      {label}
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={fieldClassName()}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">
      {label}
      <textarea
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="editorial-input mt-1 resize-y"
      />
    </label>
  );
}

function PublicationFields({
  featured,
  published,
  sortOrder,
  onChange,
}: {
  featured: boolean;
  published: boolean;
  sortOrder: number;
  onChange: (field: "featured" | "published" | "sortOrder", value: boolean | number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#171713]/15 pt-4">
      <label className="flex items-center gap-2 text-xs text-[#171713]/70">
        <input
          type="checkbox"
          checked={featured}
          onChange={(event) => onChange("featured", event.target.checked)}
          className="accent-[#80643a]"
        />
        Feature on site
      </label>
      <label className="flex items-center gap-2 text-xs text-[#171713]/70">
        <input
          type="checkbox"
          checked={published}
          onChange={(event) => onChange("published", event.target.checked)}
          className="accent-[#80643a]"
        />
        Published
      </label>
      <label className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#171713]/60">
        Order
        <input
          type="number"
          min={0}
          max={10000}
          value={sortOrder}
          onChange={(event) => onChange("sortOrder", Number(event.target.value))}
          className="w-20 border-b border-[#171713]/25 bg-transparent px-2 py-1 text-sm text-[#171713]"
        />
      </label>
    </div>
  );
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: "no-store" });
  const payload: unknown = await response.json();

  if (!response.ok) {
    throw new Error(errorText(payload));
  }

  return payload as T;
}

async function fetchAdminContent() {
  const [artistResponse, mediaResponse] = await Promise.all([
    requestJson<{ data: AdminArtist[] }>("/api/admin/artists"),
    requestJson<{ data: AdminMedia[] }>("/api/admin/media"),
  ]);

  return { artists: artistResponse.data, media: mediaResponse.data };
}

export function AdminContentManager() {
  const router = useRouter();
  const [artists, setArtists] = useState<AdminArtist[]>([]);
  const [media, setMedia] = useState<AdminMedia[]>([]);
  const [artistDraft, setArtistDraft] = useState<ArtistDraft>(emptyArtist);
  const [mediaDraft, setMediaDraft] = useState<MediaDraft>(emptyMedia);
  const [editingArtistId, setEditingArtistId] = useState<string | null>(null);
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadContent = useCallback(async () => {
    try {
      const content = await fetchAdminContent();
      setArtists(content.artists);
      setMedia(content.media);
      setError("");
    } catch (requestError) {
      if (requestError instanceof Error && requestError.message === "Authentication required.") {
        router.replace("/admin/login");
        return;
      }

      setError(
        requestError instanceof Error
          ? requestError.message
          : "The culture archive could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    let active = true;

    void fetchAdminContent()
      .then((content) => {
        if (!active) return;
        setArtists(content.artists);
        setMedia(content.media);
        setError("");
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        if (requestError instanceof Error && requestError.message === "Authentication required.") {
          router.replace("/admin/login");
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "The culture archive could not be loaded.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router]);

  async function saveArtist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      await requestJson<{ data: AdminArtist }>(
        editingArtistId ? `/api/admin/artists/${editingArtistId}` : "/api/admin/artists",
        {
          method: editingArtistId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(artistDraft),
        },
      );
      setArtistDraft(emptyArtist);
      setEditingArtistId(null);
      setNotice("Artist profile saved.");
      await loadContent();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Artist could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function saveMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      await requestJson<{ data: AdminMedia }>(
        editingMediaId ? `/api/admin/media/${editingMediaId}` : "/api/admin/media",
        {
          method: editingMediaId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mediaDraft),
        },
      );
      setMediaDraft(emptyMedia);
      setEditingMediaId(null);
      setNotice(
        mediaDraft.published
          ? "Culture feature published. It is now visible on Artists & Culture."
          : "Culture feature saved as a draft. Check Published to show it on the site.",
      );
      await loadContent();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Media could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteRecord(url: string, label: string) {
    if (!window.confirm(`Delete this ${label}? This cannot be undone.`)) return;

    setError("");
    setNotice("");

    try {
      await requestJson<{ ok: true }>(url, { method: "DELETE" });
      setNotice(`${label[0].toUpperCase()}${label.slice(1)} deleted.`);
      await loadContent();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The record could not be deleted.");
    }
  }

  function editArtist(artist: AdminArtist) {
    setEditingArtistId(artist.id);
    setArtistDraft({
      name: artist.name,
      culture: artist.culture,
      role: artist.role,
      bio: artist.bio,
      imageUrl: artist.imageUrl ?? "",
      sourceUrl: artist.sourceUrl ?? "",
      featured: artist.featured,
      published: artist.published,
      sortOrder: artist.sortOrder,
    });
  }

  function editMedia(item: AdminMedia) {
    setEditingMediaId(item.id);
    setMediaDraft({
      title: item.title,
      mediaType: item.mediaType,
      culture: item.culture,
      description: item.description,
      youtubeUrl: item.youtubeUrl ?? "",
      sourceName: item.sourceName ?? "",
      imageUrl: item.imageUrl ?? "",
      artistId: item.artistId ?? "",
      featured: item.featured,
      published: item.published,
      sortOrder: item.sortOrder,
    });
  }

  async function logout() {
    try {
      await requestJson<{ ok: true }>("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Sign out could not be completed.");
    }
  }

  return (
    <div className="editorial-page">
      <div className="editorial-page-inner">
        <section className="editorial-page-hero">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="editorial-eyebrow">Taban Uncle · Content studio</p>
              <h1 className="editorial-page-title mt-4">
                Culture <em>archive.</em>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#171713]/65">
                Manage the culture archive, studio services, news, events, team profiles, and portfolio. Unpublished
                records stay private; publish content when it is ready for the public site.
              </p>
            </div>
            <button type="button" onClick={logout} className="editorial-button-outline">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav aria-label="Admin sections" className="flex max-w-full gap-2 overflow-x-auto rounded-2xl border border-[#171713]/10 bg-white/55 p-3 shadow-sm backdrop-blur-xl lg:block lg:overflow-visible">
              <a href="#admin-overview" className="mb-0 flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#171713] transition hover:bg-[#80643a]/10 lg:mb-3">
                <Search className="h-4 w-4 text-[#80643a]" />
                Overview &amp; search
              </a>
              {adminNavigationGroups.map((group) => (
                <details key={group.label} open className="group min-w-max border-l border-[#171713]/10 px-1 py-1 lg:border-l-0 lg:border-t lg:px-0 lg:py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 rounded-xl px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-[#171713]/55 transition hover:bg-[#80643a]/10 [&::-webkit-details-marker]:hidden">
                    {group.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="mt-1 flex gap-1 lg:block lg:space-y-1">
                    {group.items.map(({ id, label, icon: Icon }) => (
                      <li key={id}>
                        <a href={`#${id}`} className="flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm text-[#171713]/70 transition hover:bg-[#80643a]/10 hover:text-[#171713]">
                          <Icon className="h-4 w-4 shrink-0 text-[#80643a]" />
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </nav>
          </aside>

          <main className="min-w-0">
            <div id="admin-overview" className="scroll-mt-28">
              <AdminContentSearch />
              <p className="mt-4 text-xs leading-5 text-[#171713]/55">
                Use the sidebar to jump between sections. All of your existing content and editing forms remain below.
              </p>
              {error && (
                <p role="alert" className="mt-6 border border-red-800/25 bg-red-950/5 px-4 py-3 text-sm text-red-900">
                  {error}
                </p>
              )}
              {notice && (
                <p role="status" className="mt-6 border border-[#80643a]/25 bg-[#80643a]/5 px-4 py-3 text-sm text-[#5b4528]">
                  {notice}
                </p>
              )}
            </div>

            <div id="admin-accounts" className="scroll-mt-28">
              <PublisherManagement />
            </div>

            {loading ? (
              <p className="py-12 text-sm text-[#171713]/60">Loading your culture archive…</p>
            ) : (
              <>
                <section className="mt-12 grid grid-cols-1 gap-12">
              <div id="admin-artists" data-admin-search-form="artists" className="min-w-0 scroll-mt-28">
                <div className="flex items-end justify-between gap-4 border-b border-[#171713]/20 pb-4">
                  <div className="min-w-0">
                    <p className="editorial-eyebrow">People & channels</p>
                    <h2 className="editorial-heading mt-2 text-3xl">Artist profiles</h2>
                  </div>
                  <span className="text-xs text-[#171713]/50">{artists.length} profiles</span>
                </div>

                <form data-admin-search-create="Add new artist or channel profile" data-admin-search-category="Artist profiles" onSubmit={saveArtist} className="mt-6 space-y-5 border-b border-[#171713]/15 pb-7">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Artist or channel name"
                      value={artistDraft.name}
                      required
                      onChange={(name) => setArtistDraft((draft) => ({ ...draft, name }))}
                    />
                    <Field
                      label="Culture or community"
                      value={artistDraft.culture}
                      required
                      onChange={(culture) => setArtistDraft((draft) => ({ ...draft, culture }))}
                    />
                    <Field
                      label="Role"
                      value={artistDraft.role}
                      required
                      onChange={(role) => setArtistDraft((draft) => ({ ...draft, role }))}
                    />
                    <Field
                      label="Artist/channel source link"
                      value={artistDraft.sourceUrl}
                      type="url"
                      placeholder="https://…"
                      onChange={(sourceUrl) => setArtistDraft((draft) => ({ ...draft, sourceUrl }))}
                    />
                  </div>
                  <TextArea
                    label="Bio and source context"
                    value={artistDraft.bio}
                    required
                    onChange={(bio) => setArtistDraft((draft) => ({ ...draft, bio }))}
                  />
                  <ImageUploadField
                    label="Artist photo"
                    imageUrl={artistDraft.imageUrl}
                    onChange={(imageUrl) => setArtistDraft((draft) => ({ ...draft, imageUrl }))}
                  />
                  <PublicationFields
                    featured={artistDraft.featured}
                    published={artistDraft.published}
                    sortOrder={artistDraft.sortOrder}
                    onChange={(field, value) =>
                      setArtistDraft((draft) => ({ ...draft, [field]: value }))
                    }
                  />
                  <div className="flex flex-wrap gap-3">
                    <button type="submit" disabled={saving} className="editorial-button-dark disabled:opacity-60">
                      {editingArtistId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {saving ? "Saving…" : editingArtistId ? "Update artist" : "Add artist"}
                    </button>
                    {editingArtistId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingArtistId(null);
                          setArtistDraft(emptyArtist);
                        }}
                        className="editorial-button-outline"
                      >
                        <X className="h-4 w-4" /> Cancel
                      </button>
                    )}
                  </div>
                </form>

                <ul className="divide-y divide-[#171713]/15">
                  {artists.map((artist) => (
                    <li key={artist.id} data-admin-search-record data-admin-search-label={artist.name} data-admin-search-keywords={`${artist.culture} ${artist.role} ${artist.bio} artist profile channel ${artist.published ? "published" : "draft"}`} data-admin-search-category="Artist profile" className="flex flex-wrap items-center justify-between gap-4 py-4">
                      <div className="flex items-center gap-3">
                        {artist.imageUrl ? (
                          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#171713]/5">
                            <span
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ backgroundImage: `url("${artist.imageUrl}")` }}
                              role="img"
                              aria-label={`${artist.name} portrait`}
                            />
                          </span>
                        ) : (
                          <span className="editorial-heading flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#80643a]/30 text-xl text-[#80643a]">
                            {artist.name.slice(0, 1)}
                          </span>
                        )}
                        <div>
                        <p className="editorial-heading text-xl">{artist.name}</p>
                        <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-[#171713]/55">
                          {artist.culture} · {artist.published ? "Published" : "Draft"} · {artist._count?.media ?? 0} linked features
                        </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" data-admin-search-edit onClick={() => editArtist(artist)} className="editorial-button-outline min-h-9 px-4 py-2 text-[9px]">
                          Edit
                        </button>
                        <button type="button" onClick={() => void deleteRecord(`/api/admin/artists/${artist.id}`, "artist")} className="rounded-full border border-red-900/20 p-2 text-red-900 hover:bg-red-950/5" aria-label={`Delete ${artist.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div id="admin-culture" data-admin-search-form="culture-features" className="scroll-mt-28">
                <div className="flex items-end justify-between gap-4 border-b border-[#171713]/20 pb-4">
                  <div>
                    <p className="editorial-eyebrow">Songs, performances & stories</p>
                    <h2 className="editorial-heading mt-2 text-3xl">Culture features</h2>
                  </div>
                  <span className="text-xs text-[#171713]/50">{media.length} features</span>
                </div>

                <form data-admin-search-create="Add new song, performance, or culture story" data-admin-search-category="Culture features" onSubmit={saveMedia} className="mt-6 space-y-5 border-b border-[#171713]/15 pb-7">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Title"
                      value={mediaDraft.title}
                      required
                      onChange={(title) => setMediaDraft((draft) => ({ ...draft, title }))}
                    />
                    <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">
                      Feature type
                      <select
                        value={mediaDraft.mediaType}
                        onChange={(event) =>
                          setMediaDraft((draft) => ({
                            ...draft,
                            mediaType: event.target.value as AdminMedia["mediaType"],
                          }))
                        }
                        className={fieldClassName()}
                      >
                        <option value="SONG">Song</option>
                        <option value="MUSIC_COLLECTION">Music collection</option>
                        <option value="PERFORMANCE">Traditional performance</option>
                        <option value="CULTURE_STORY">Culture story</option>
                      </select>
                    </label>
                    <Field
                      label="Culture or community"
                      value={mediaDraft.culture}
                      required
                      onChange={(culture) => setMediaDraft((draft) => ({ ...draft, culture }))}
                    />
                    <Field
                      label="Publisher or source credit (optional)"
                      value={mediaDraft.sourceName}
                      onChange={(sourceName) => setMediaDraft((draft) => ({ ...draft, sourceName }))}
                    />
                  </div>
                  <TextArea
                    label="Description and attribution"
                    value={mediaDraft.description}
                    required
                    onChange={(description) => setMediaDraft((draft) => ({ ...draft, description }))}
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="YouTube video URL (optional)"
                      value={mediaDraft.youtubeUrl}
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=…"
                      onChange={(youtubeUrl) => setMediaDraft((draft) => ({ ...draft, youtubeUrl }))}
                    />
                    <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">
                      Linked artist (optional)
                      <select
                        value={mediaDraft.artistId}
                        onChange={(event) => setMediaDraft((draft) => ({ ...draft, artistId: event.target.value }))}
                        className={fieldClassName()}
                      >
                        <option value="">No named artist / community feature</option>
                        {artists.map((artist) => (
                          <option key={artist.id} value={artist.id}>
                            {artist.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <YouTubeVideoPreview
                    key={`${mediaDraft.youtubeUrl}|${mediaDraft.imageUrl}`}
                    url={mediaDraft.youtubeUrl}
                    title={mediaDraft.title}
                    coverImageUrl={mediaDraft.imageUrl || undefined}
                  />
                  <ImageUploadField
                    label="Feature cover image (optional)"
                    imageUrl={mediaDraft.imageUrl}
                    onChange={(imageUrl) => setMediaDraft((draft) => ({ ...draft, imageUrl }))}
                  />
                  <PublicationFields
                    featured={mediaDraft.featured}
                    published={mediaDraft.published}
                    sortOrder={mediaDraft.sortOrder}
                    onChange={(field, value) => setMediaDraft((draft) => ({ ...draft, [field]: value }))}
                  />
                  <p className="text-xs leading-5 text-[#171713]/60">
                    Check <strong>Published</strong> to show this feature on Artists &amp; Culture. <strong>Feature on site</strong> also promotes it on the homepage.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button type="submit" disabled={saving} className="editorial-button-dark disabled:opacity-60">
                      {editingMediaId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {saving ? "Saving…" : editingMediaId ? "Update feature" : "Add feature"}
                    </button>
                    {editingMediaId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMediaId(null);
                          setMediaDraft(emptyMedia);
                        }}
                        className="editorial-button-outline"
                      >
                        <X className="h-4 w-4" /> Cancel
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] leading-5 text-[#171713]/50">
                    Video links and source credits are optional. Add a YouTube video and/or cover image when available;
                    only publish media and photos you have permission to use.
                  </p>
                </form>

                <ul className="divide-y divide-[#171713]/15">
                  {media.map((item) => (
                    <li key={item.id} data-admin-search-record data-admin-search-label={item.title} data-admin-search-keywords={`${item.culture} ${item.mediaType} ${item.artist?.name ?? ""} ${item.sourceName ?? ""} ${item.description} culture story song music performance`} data-admin-search-category="Culture feature" className="flex flex-wrap items-center justify-between gap-4 py-4">
                      <div className="min-w-0">
                        <p className="editorial-heading truncate text-xl">{item.title}</p>
                        <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-[#171713]/55">
                          {item.culture}{item.artist?.name || item.sourceName ? ` · ${item.artist?.name ?? item.sourceName}` : ""} · {item.published ? "Published" : "Draft"}
                        </p>
                        {item.youtubeUrl && (
                          <a href={item.youtubeUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[9px] text-[#80643a] underline underline-offset-2">
                            Open source <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button type="button" data-admin-search-edit onClick={() => editMedia(item)} className="editorial-button-outline min-h-9 px-4 py-2 text-[9px]">
                          Edit
                        </button>
                        <button type="button" onClick={() => void deleteRecord(`/api/admin/media/${item.id}`, "feature")} className="rounded-full border border-red-900/20 p-2 text-red-900 hover:bg-red-950/5" aria-label={`Delete ${item.title}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
                <SiteContentManager />
                <CreativeContentManager />
                <BookingInbox />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
