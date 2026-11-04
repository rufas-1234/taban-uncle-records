"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2, X } from "lucide-react";
import Image from "next/image";

import { ImageUploadField } from "@/components/image-upload-field";

type TeamRecord = {
  id: string;
  name: string;
  title: string;
  group: "CORE_TEAM" | "PRODUCER" | "SESSION_MUSICIAN";
  bio: string;
  imageUrl: string | null;
  published: boolean;
  sortOrder: number;
};

type PortfolioRecord = {
  id: string;
  title: string;
  category: string;
  type: "MUSIC" | "PHOTOGRAPHY" | "VIDEOGRAPHY" | "OTHER";
  description: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

type TeamDraft = Omit<TeamRecord, "id" | "imageUrl"> & { imageUrl: string };
type PortfolioDraft = Omit<PortfolioRecord, "id">;
type ContentKind = "team" | "portfolio";
type CreativeContent = { team: TeamRecord[]; portfolio: PortfolioRecord[] };

const emptyTeam: TeamDraft = {
  name: "",
  title: "",
  group: "CORE_TEAM",
  bio: "",
  imageUrl: "",
  published: false,
  sortOrder: 0,
};

const emptyPortfolio: PortfolioDraft = {
  title: "",
  category: "",
  type: "MUSIC",
  description: "",
  imageUrl: "",
  featured: false,
  published: false,
  sortOrder: 0,
};

function responseError(payload: unknown) {
  if (typeof payload !== "object" || payload === null || !("error" in payload)) {
    return "The creative content service returned an unexpected response.";
  }
  if (typeof payload.error === "string") return payload.error;
  if (typeof payload.error === "object" && payload.error !== null) {
    const messages = Object.entries(payload.error)
      .flatMap(([field, errors]) => Array.isArray(errors) ? errors.map((message) => `${field}: ${String(message)}`) : [])
      .join("; ");
    if (messages) return `Please correct: ${messages}`;
  }
  return "Please check the required fields and try again.";
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: "no-store" });
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("The server returned an invalid response. Please try again.");
  }
  if (!response.ok) throw new Error(responseError(payload));
  return payload as T;
}

function fetchCreativeContent() {
  return requestJson<CreativeContent>("/api/admin/creative-content");
}

function SaveButton({ saving, editing }: { saving: boolean; editing: boolean }) {
  return (
    <button type="submit" disabled={saving} className="editorial-button-dark disabled:opacity-60">
      {editing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {saving ? "Saving…" : editing ? "Save changes" : "Add record"}
    </button>
  );
}

function PublishToggle({ checked, onChange, label = "Published" }: { checked: boolean; onChange: (value: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-2 text-xs text-[#171713]/70">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="accent-[#80643a]" />
      {label}
    </label>
  );
}

export function CreativeContentManager() {
  const router = useRouter();
  const [team, setTeam] = useState<TeamRecord[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioRecord[]>([]);
  const [teamDraft, setTeamDraft] = useState<TeamDraft>(emptyTeam);
  const [portfolioDraft, setPortfolioDraft] = useState<PortfolioDraft>(emptyPortfolio);
  const [editing, setEditing] = useState<{ kind: ContentKind; id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<Partial<Record<ContentKind, string>>>({});
  const [notice, setNotice] = useState("");

  const loadContent = useCallback(async () => {
    const content = await fetchCreativeContent();
    setTeam(content.team);
    setPortfolio(content.portfolio);
  }, []);

  useEffect(() => {
    let active = true;
    void fetchCreativeContent()
      .then((content) => {
        if (!active) return;
        setTeam(content.team);
        setPortfolio(content.portfolio);
        setError("");
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        if (loadError instanceof Error && loadError.message === "Authentication required.") {
          router.replace("/admin/login");
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "Creative content could not be loaded.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [loadContent, router]);

  async function save(kind: ContentKind, event: FormEvent<HTMLFormElement>, data: object) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      const invalid = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input, textarea, select"))
        .filter((field) => !field.validity.valid)
        .map((field) => field.labels?.[0]?.childNodes[0]?.textContent?.trim() || "A field");
      setFormErrors((current) => ({ ...current, [kind]: `Please complete: ${[...new Set(invalid)].join(", ")}.` }));
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");
    setFormErrors((current) => ({ ...current, [kind]: "" }));
    try {
      await requestJson("/api/admin/creative-content", {
        method: editing?.kind === kind ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, ...(editing?.kind === kind ? { id: editing.id } : {}), data }),
      });
      setEditing(null);
      setTeamDraft(emptyTeam);
      setPortfolioDraft(emptyPortfolio);
      setNotice(kind === "team" ? "Team member saved." : "Portfolio project saved.");
      try {
        await loadContent();
      } catch (refreshError) {
        setError(
          refreshError instanceof Error
            ? `The record was saved, but the list could not refresh: ${refreshError.message}`
            : "The record was saved, but the list could not refresh.",
        );
      }
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Creative content could not be saved.";
      setError(message);
      setFormErrors((current) => ({ ...current, [kind]: message }));
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    setEditing(null);
    setTeamDraft(emptyTeam);
    setPortfolioDraft(emptyPortfolio);
  }

  async function remove(kind: ContentKind, item: TeamRecord | PortfolioRecord) {
    if (!window.confirm(`Delete “${"name" in item ? item.name : item.title}”? This cannot be undone.`)) return;
    setError("");
    setNotice("");
    try {
      await requestJson("/api/admin/creative-content", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, id: item.id }),
      });
      setNotice("Record deleted.");
      try {
        await loadContent();
      } catch (refreshError) {
        setError(
          refreshError instanceof Error
            ? `The record was deleted, but the list could not refresh: ${refreshError.message}`
            : "The record was deleted, but the list could not refresh.",
        );
      }
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Record could not be deleted.");
    }
  }

  return (
    <section className="mt-16 border-t-2 border-[#171713]/20 pt-10">
      <div className="max-w-3xl">
        <p className="editorial-eyebrow">Manage the studio story</p>
        <h2 className="editorial-heading mt-3 text-4xl sm:text-5xl">Team &amp; <em>portfolio.</em></h2>
        <p className="mt-4 text-sm leading-7 text-[#171713]/65">
          Upload each person’s portrait and choose their profile section. Published core-team profiles appear on About and Artists; producers and keyboardists, guitarists, and other session musicians appear in their own Artists sections. Published photo and video projects also appear in Visual Collections.
        </p>
      </div>
      {error && <p role="alert" className="mt-6 border border-red-800/25 bg-red-950/5 px-4 py-3 text-sm text-red-900">{error}</p>}
      {notice && <p role="status" className="mt-6 border border-[#80643a]/25 bg-[#80643a]/5 px-4 py-3 text-sm text-[#5b4528]">{notice}</p>}
      {loading ? <p className="py-10 text-sm text-[#171713]/60">Loading team and portfolio…</p> : (
        <div className="mt-10 space-y-12">
          <div id="admin-team" data-admin-search-form="team" className="scroll-mt-28">
            <div className="flex items-end justify-between gap-4 border-b border-[#171713]/20 pb-4">
              <div><p className="editorial-eyebrow">People behind the work</p><h3 className="editorial-heading mt-2 text-3xl">Team members</h3></div>
              <span className="text-xs text-[#171713]/50">{team.length} records</span>
            </div>
            <form data-admin-search-create="Add new team member" data-admin-search-category="Team members" noValidate onSubmit={(event) => void save("team", event, teamDraft)} className="mt-5 space-y-4 border-b border-[#171713]/15 pb-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">Name<input required minLength={2} value={teamDraft.name} onChange={(event) => setTeamDraft((draft) => ({ ...draft, name: event.target.value }))} className="editorial-input mt-1" /></label>
                <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">Role or instrument<input required minLength={2} value={teamDraft.title} onChange={(event) => setTeamDraft((draft) => ({ ...draft, title: event.target.value }))} className="editorial-input mt-1" placeholder="Audio Producer, Keyboardist, Guitarist…" /></label>
                <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">Artists page section<select value={teamDraft.group} onChange={(event) => setTeamDraft((draft) => ({ ...draft, group: event.target.value as TeamDraft["group"] }))} className="editorial-input mt-1"><option value="CORE_TEAM">Core studio team</option><option value="PRODUCER">Producers</option><option value="SESSION_MUSICIAN">Session musicians</option></select></label>
              </div>
              <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">Biography (optional)<textarea rows={3} value={teamDraft.bio} onChange={(event) => setTeamDraft((draft) => ({ ...draft, bio: event.target.value }))} className="editorial-input mt-1 resize-y" /></label>
              <ImageUploadField label="Team member photo" imageUrl={teamDraft.imageUrl} onChange={(imageUrl) => setTeamDraft((draft) => ({ ...draft, imageUrl }))} />
              <div className="flex flex-wrap items-center gap-5">
                <PublishToggle checked={teamDraft.published} onChange={(published) => setTeamDraft((draft) => ({ ...draft, published }))} />
                <label className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#171713]/60">Order<input type="number" min={0} max={10000} value={teamDraft.sortOrder} onChange={(event) => setTeamDraft((draft) => ({ ...draft, sortOrder: Number(event.target.value) }))} className="w-20 border-b border-[#171713]/25 bg-transparent px-2 py-1 text-sm" /></label>
              </div>
              {formErrors.team && <p role="alert" className="text-sm text-red-900">{formErrors.team}</p>}
              <div className="flex flex-wrap gap-3"><SaveButton saving={saving} editing={editing?.kind === "team"} />{editing?.kind === "team" && <button type="button" onClick={cancelEdit} className="editorial-button-outline"><X className="h-4 w-4" /> Cancel</button>}</div>
            </form>
            <ul className="divide-y divide-[#171713]/15">
              {team.map((item) => (
                <li key={item.id} data-admin-search-record data-admin-search-label={item.name} data-admin-search-keywords={`${item.title} ${item.group} ${item.bio} team staff musician producer`} data-admin-search-category="Team member" className="flex items-center justify-between gap-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#d9d0c0] text-[#80643a]">
                      {item.imageUrl ? <Image src={item.imageUrl} alt={`${item.name} portrait`} fill sizes="48px" unoptimized className="object-cover" /> : <span className="editorial-heading text-xl">{item.name.slice(0, 1)}</span>}
                    </div>
                    <div className="min-w-0"><p className="editorial-heading truncate text-lg">{item.name}</p><p className="text-[9px] uppercase tracking-[0.12em] text-[#171713]/50">{item.group.replaceAll("_", " ")} · {item.title} · {item.published ? "Published" : "Draft"}</p></div>
                  </div>
                  <div className="flex gap-2"><button type="button" data-admin-search-edit onClick={() => { setEditing({ kind: "team", id: item.id }); setTeamDraft({ ...item, imageUrl: item.imageUrl ?? "" }); }} className="editorial-button-outline min-h-9 px-4 py-2 text-[9px]">Edit</button><button type="button" onClick={() => void remove("team", item)} aria-label={`Delete ${item.name}`} className="rounded-full border border-red-900/20 p-2 text-red-900"><Trash2 className="h-4 w-4" /></button></div>
                </li>
              ))}
            </ul>
          </div>

          <div id="admin-portfolio" data-admin-search-form="portfolio" className="scroll-mt-28">
            <div className="flex items-end justify-between gap-4 border-b border-[#171713]/20 pb-4">
              <div><p className="editorial-eyebrow">Selected work</p><h3 className="editorial-heading mt-2 text-3xl">Portfolio projects</h3></div>
              <span className="text-xs text-[#171713]/50">{portfolio.length} records</span>
            </div>
            <form data-admin-search-create="Add new portfolio project" data-admin-search-category="Portfolio" noValidate onSubmit={(event) => void save("portfolio", event, portfolioDraft)} className="mt-5 space-y-4 border-b border-[#171713]/15 pb-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">Project title<input required minLength={2} value={portfolioDraft.title} onChange={(event) => setPortfolioDraft((draft) => ({ ...draft, title: event.target.value }))} className="editorial-input mt-1" /></label>
                <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">Category<input required minLength={2} value={portfolioDraft.category} onChange={(event) => setPortfolioDraft((draft) => ({ ...draft, category: event.target.value }))} className="editorial-input mt-1" placeholder="Music production, photography…" /></label>
                <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">Project type<select value={portfolioDraft.type} onChange={(event) => setPortfolioDraft((draft) => ({ ...draft, type: event.target.value as PortfolioDraft["type"] }))} className="editorial-input mt-1"><option value="MUSIC">Music</option><option value="PHOTOGRAPHY">Photography</option><option value="VIDEOGRAPHY">Videography</option><option value="OTHER">Other</option></select></label>
              </div>
              <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">Project description<textarea required minLength={10} rows={3} value={portfolioDraft.description} onChange={(event) => setPortfolioDraft((draft) => ({ ...draft, description: event.target.value }))} className="editorial-input mt-1 resize-y" /></label>
              <ImageUploadField label="Project cover image (required)" imageUrl={portfolioDraft.imageUrl} onChange={(imageUrl) => setPortfolioDraft((draft) => ({ ...draft, imageUrl }))} />
              <div className="flex flex-wrap items-center gap-5">
                <PublishToggle checked={portfolioDraft.published} onChange={(published) => setPortfolioDraft((draft) => ({ ...draft, published }))} />
                <PublishToggle label="Feature on homepage" checked={portfolioDraft.featured} onChange={(featured) => setPortfolioDraft((draft) => ({ ...draft, featured }))} />
                <label className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#171713]/60">Order<input type="number" min={0} max={10000} value={portfolioDraft.sortOrder} onChange={(event) => setPortfolioDraft((draft) => ({ ...draft, sortOrder: Number(event.target.value) }))} className="w-20 border-b border-[#171713]/25 bg-transparent px-2 py-1 text-sm" /></label>
              </div>
              {formErrors.portfolio && <p role="alert" className="text-sm text-red-900">{formErrors.portfolio}</p>}
              <div className="flex flex-wrap gap-3"><SaveButton saving={saving} editing={editing?.kind === "portfolio"} />{editing?.kind === "portfolio" && <button type="button" onClick={cancelEdit} className="editorial-button-outline"><X className="h-4 w-4" /> Cancel</button>}</div>
            </form>
            <ul className="divide-y divide-[#171713]/15">
              {portfolio.map((item) => (
                <li key={item.id} data-admin-search-record data-admin-search-label={item.title} data-admin-search-keywords={`${item.category} ${item.description} ${item.type} portfolio project`} data-admin-search-category="Portfolio project" className="flex items-center justify-between gap-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded bg-[#171713]/5"><Image src={item.imageUrl} alt={`${item.title} project cover`} fill sizes="80px" unoptimized className="object-cover" /></div>
                    <div className="min-w-0"><p className="editorial-heading truncate text-lg">{item.title}</p><p className="text-[9px] uppercase tracking-[0.12em] text-[#171713]/50">{item.category} · {item.published ? "Published" : "Draft"}{item.featured ? " · Homepage" : ""}</p></div>
                  </div>
                  <div className="flex gap-2"><button type="button" data-admin-search-edit onClick={() => { setEditing({ kind: "portfolio", id: item.id }); setPortfolioDraft({ ...item }); }} className="editorial-button-outline min-h-9 px-4 py-2 text-[9px]">Edit</button><button type="button" onClick={() => void remove("portfolio", item)} aria-label={`Delete ${item.title}`} className="rounded-full border border-red-900/20 p-2 text-red-900"><Trash2 className="h-4 w-4" /></button></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
