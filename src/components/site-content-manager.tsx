"use client";

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Newspaper, Plus, Save, Trash2, X } from "lucide-react";

import { ImageUploadField } from "@/components/image-upload-field";

type PricingEntry = {
  id: string;
  title: string;
  category: string;
  description: string;
  priceAmount: number | null;
  currency: string;
  priceUnit: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

type ArticleEntry = {
  id: string;
  kind: "NEWS" | "INSIGHT";
  title: string;
  excerpt: string;
  body: string;
  imageUrl: string | null;
  publishedAt: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

type EventEntry = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string | null;
  location: string;
  imageUrl: string | null;
  registrationUrl: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

type PricingDraft = Omit<PricingEntry, "id" | "priceAmount"> & { priceAmount: string };
type ArticleDraft = Omit<ArticleEntry, "id" | "publishedAt"> & { publishedAt: string };
type EventDraft = Omit<EventEntry, "id" | "startsAt" | "endsAt"> & { startsAt: string; endsAt: string };
type ContentKind = "pricing" | "article" | "event";

const emptyPricing: PricingDraft = {
  title: "",
  category: "Recording",
  description: "",
  priceAmount: "",
  currency: "USD",
  priceUnit: "per project",
  featured: false,
  published: false,
  sortOrder: 0,
};

const emptyArticle: ArticleDraft = {
  kind: "NEWS",
  title: "",
  excerpt: "",
  body: "",
  imageUrl: "",
  publishedAt: "",
  featured: false,
  published: false,
  sortOrder: 0,
};

const emptyEvent: EventDraft = {
  title: "",
  description: "",
  startsAt: "",
  endsAt: "",
  location: "Juba, South Sudan",
  imageUrl: "",
  registrationUrl: "",
  featured: false,
  published: false,
  sortOrder: 0,
};

function dateTimeLocalValue(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function messageFrom(value: unknown) {
  if (typeof value === "object" && value !== null && "error" in value) {
    if (typeof value.error === "string") return value.error;
    if (typeof value.error === "object" && value.error !== null) {
      const fields = Object.entries(value.error)
        .flatMap(([field, messages]) =>
          Array.isArray(messages)
            ? messages.filter((message): message is string => typeof message === "string").map((message) => `${field}: ${message}`)
            : [],
        );
      if (fields.length > 0) return `Please correct these fields: ${fields.join("; ")}`;
    }
    return "Check the required fields and try again.";
  }
  return "The studio content service returned an unexpected response.";
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: "no-store" });
  const payload: unknown = await response.json();
  if (!response.ok) throw new Error(messageFrom(payload));
  return payload as T;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  min,
  minLength,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
  minLength?: number;
}) {
  return (
    <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">
      {label}
      <input
        type={type}
        required={required}
        min={min}
        minLength={minLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="editorial-input mt-1"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  required = false,
  rows = 3,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
  minLength?: number;
}) {
  return (
    <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">
      {label}
      <textarea
        required={required}
        minLength={minLength}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="editorial-input mt-1 resize-y"
      />
    </label>
  );
}

function PublishFields({
  value,
  onChange,
}: {
  value: { published: boolean; featured: boolean; sortOrder: number };
  onChange: (field: "published" | "featured" | "sortOrder", next: boolean | number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#171713]/15 pt-4">
      {(["published", "featured"] as const).map((field) => (
        <label key={field} className="flex items-center gap-2 text-xs text-[#171713]/70">
          <input type="checkbox" checked={value[field]} onChange={(event) => onChange(field, event.target.checked)} className="accent-[#80643a]" />
          {field === "published" ? "Published" : "Feature on site"}
        </label>
      ))}
      <label className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#171713]/60">
        Order
        <input type="number" min={0} max={10000} value={value.sortOrder} onChange={(event) => onChange("sortOrder", Number(event.target.value))} className="w-20 border-b border-[#171713]/25 bg-transparent px-2 py-1 text-sm text-[#171713]" />
      </label>
    </div>
  );
}

function SectionHeading({ icon, eyebrow, title, count }: { icon: ReactNode; eyebrow: string; title: string; count: number }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-[#171713]/20 pb-4">
      <div id="admin-pricing" data-admin-search-form="pricing" className="scroll-mt-28">
        <p className="editorial-eyebrow inline-flex items-center gap-2">{icon}{eyebrow}</p>
        <h2 className="editorial-heading mt-2 text-3xl">{title}</h2>
      </div>
      <span className="text-xs text-[#171713]/50">{count} records</span>
    </div>
  );
}

function SubmitButtons({ editing, saving, onCancel }: { editing: boolean; saving: boolean; onCancel: () => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      <button type="submit" disabled={saving} className="editorial-button-dark disabled:opacity-60">
        {editing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {saving ? "Saving…" : editing ? "Save changes" : "Add record"}
      </button>
      {editing && <button type="button" onClick={onCancel} className="editorial-button-outline"><X className="h-4 w-4" /> Cancel</button>}
    </div>
  );
}

export function SiteContentManager() {
  const router = useRouter();
  const [pricing, setPricing] = useState<PricingEntry[]>([]);
  const [articles, setArticles] = useState<ArticleEntry[]>([]);
  const [events, setEvents] = useState<EventEntry[]>([]);
  const [pricingDraft, setPricingDraft] = useState<PricingDraft>(emptyPricing);
  const [articleDraft, setArticleDraft] = useState<ArticleDraft>(emptyArticle);
  const [eventDraft, setEventDraft] = useState<EventDraft>(emptyEvent);
  const [editing, setEditing] = useState<{ kind: ContentKind; id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [formErrors, setFormErrors] = useState<Partial<Record<ContentKind, string>>>({});

  const fetchContent = useCallback(
    () =>
      requestJson<{ pricing: PricingEntry[]; articles: ArticleEntry[]; events: EventEntry[] }>(
        "/api/admin/site-content",
      ),
    [],
  );

  const loadContent = useCallback(async () => {
    const content = await fetchContent();
    setPricing(content.pricing);
    setArticles(content.articles);
    setEvents(content.events);
  }, [fetchContent]);

  useEffect(() => {
    let active = true;
    void fetchContent()
      .then((content) => {
        if (!active) return;
        setPricing(content.pricing);
        setArticles(content.articles);
        setEvents(content.events);
        setError("");
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        if (requestError instanceof Error && requestError.message === "Authentication required.") {
          router.replace("/admin/login");
          return;
        }
        setError(requestError instanceof Error ? requestError.message : "Studio content could not be loaded.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [fetchContent, router]);

  async function save(kind: ContentKind, event: FormEvent<HTMLFormElement>, data: object) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      const invalidFields = Array.from(
        form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input, textarea, select"),
      )
        .filter((field) => !field.validity.valid)
        .map((field) => {
          const label = field.labels?.[0]?.childNodes[0]?.textContent?.trim() || "A field";
          const reason = field.validity.valueMissing
            ? "is required"
            : field.validity.tooShort && "minLength" in field
              ? `must contain at least ${field.minLength} characters`
              : field.validity.typeMismatch
                ? "must be a valid link"
                : "is invalid";
          return `${label} ${reason}`;
        });
      const uniqueFields = [...new Set(invalidFields)];
      const message = uniqueFields.length
        ? `Please correct: ${uniqueFields.join("; ")}.`
        : "Please check the required fields and try again.";
      setFormErrors((current) => ({ ...current, [kind]: message }));
      setError("");
      return;
    }

    setSaving(true);
    setFormErrors((current) => ({ ...current, [kind]: "" }));
    setError("");
    setNotice("");

    try {
      await requestJson("/api/admin/site-content", {
        method: editing?.kind === kind ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, ...(editing?.kind === kind ? { id: editing.id } : {}), data }),
      });
      setEditing(null);
      setPricingDraft(emptyPricing);
      setArticleDraft(emptyArticle);
      setEventDraft(emptyEvent);
      setNotice("Studio content saved.");
      await loadContent();
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Studio content could not be saved.";
      setError(message);
      setFormErrors((current) => ({ ...current, [kind]: message }));
    } finally {
      setSaving(false);
    }
  }

  async function remove(kind: ContentKind, id: string, title: string) {
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
    setError("");
    setNotice("");
    try {
      await requestJson("/api/admin/site-content", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, id }),
      });
      setNotice("Studio content deleted.");
      await loadContent();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Studio content could not be deleted.");
    }
  }

  function editPrice(item: PricingEntry) {
    setEditing({ kind: "pricing", id: item.id });
    setPricingDraft({ ...item, priceAmount: item.priceAmount === null ? "" : String(item.priceAmount) });
  }

  function editArticle(item: ArticleEntry) {
    setEditing({ kind: "article", id: item.id });
    setArticleDraft({ ...item, publishedAt: dateTimeLocalValue(new Date(item.publishedAt)) });
  }

  function editEvent(item: EventEntry) {
    setEditing({ kind: "event", id: item.id });
    setEventDraft({
      ...item,
      startsAt: dateTimeLocalValue(new Date(item.startsAt)),
      endsAt: item.endsAt ? dateTimeLocalValue(new Date(item.endsAt)) : "",
      registrationUrl: item.registrationUrl ?? "",
      imageUrl: item.imageUrl ?? "",
    });
  }

  function cancelEdit() {
    setEditing(null);
    setPricingDraft(emptyPricing);
    setArticleDraft(emptyArticle);
    setEventDraft(emptyEvent);
  }

  return (
    <section data-admin-search-section="Publishing desk" className="mt-16 border-t-2 border-[#171713]/20 pt-10">
      <div className="max-w-3xl">
        <p className="editorial-eyebrow">Manage the whole studio site</p>
        <h2 className="editorial-heading mt-3 text-4xl sm:text-5xl">Publishing <em>desk.</em></h2>
        <p className="mt-4 text-sm leading-7 text-[#171713]/65">Update service prices, publish news and insights, and post upcoming events. Draft records remain private until published.</p>
      </div>
      {error && <p role="alert" className="mt-6 border border-red-800/25 bg-red-950/5 px-4 py-3 text-sm text-red-900">{error}</p>}
      {notice && <p role="status" className="mt-6 border border-[#80643a]/25 bg-[#80643a]/5 px-4 py-3 text-sm text-[#5b4528]">{notice}</p>}
      {loading ? <p className="py-10 text-sm text-[#171713]/60">Loading publishing desk…</p> : (
        <div className="mt-10 space-y-12">
          <section className="space-y-12">
            <div data-admin-search-form="pricing">
              <SectionHeading icon={<span aria-hidden="true">$</span>} eyebrow="Service catalogue" title="Pricing" count={pricing.length} />
              <form data-admin-search-create="Add new service pricing" data-admin-search-category="Pricing" noValidate onSubmit={(event) => void save("pricing", event, {
                ...pricingDraft,
                priceAmount: pricingDraft.priceAmount === "" ? null : Number(pricingDraft.priceAmount),
              })} className="mt-5 space-y-4 border-b border-[#171713]/15 pb-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Service name" value={pricingDraft.title} required onChange={(title) => setPricingDraft((draft) => ({ ...draft, title }))} />
                  <Field label="Category" value={pricingDraft.category} required onChange={(category) => setPricingDraft((draft) => ({ ...draft, category }))} />
                  <Field label="Price amount (blank for quote)" value={pricingDraft.priceAmount} type="number" min={0} onChange={(priceAmount) => setPricingDraft((draft) => ({ ...draft, priceAmount }))} />
                  <Field label="Currency code" value={pricingDraft.currency} required placeholder="USD" onChange={(currency) => setPricingDraft((draft) => ({ ...draft, currency: currency.toUpperCase() }))} />
                  <Field label="Price unit" value={pricingDraft.priceUnit} required placeholder="per song, per hour..." onChange={(priceUnit) => setPricingDraft((draft) => ({ ...draft, priceUnit }))} />
                </div>
                <TextArea label="Description" value={pricingDraft.description} required onChange={(description) => setPricingDraft((draft) => ({ ...draft, description }))} />
                <PublishFields value={pricingDraft} onChange={(field, value) => setPricingDraft((draft) => ({ ...draft, [field]: value }))} />
                {formErrors.pricing && <p role="alert" className="border border-red-800/25 bg-red-950/5 px-4 py-3 text-sm text-red-900">{formErrors.pricing}</p>}
                <SubmitButtons editing={editing?.kind === "pricing"} saving={saving} onCancel={cancelEdit} />
              </form>
              <ul className="divide-y divide-[#171713]/15">
                {pricing.map((item) => (
                  <li key={item.id} data-admin-search-record data-admin-search-label={item.title} data-admin-search-keywords={`${item.category} pricing price service ${item.priceUnit}`} data-admin-search-category="Service pricing" className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div><p className="editorial-heading text-lg">{item.title}</p><p className="text-[9px] uppercase tracking-[0.12em] text-[#171713]/50">{item.priceAmount === null ? "Request a quote" : `${item.currency} ${item.priceAmount}`} · {item.published ? "Published" : "Draft"}</p></div>
                    <div className="flex gap-2"><button type="button" data-admin-search-edit onClick={() => editPrice(item)} className="editorial-button-outline min-h-9 px-4 py-2 text-[9px]">Edit</button><button type="button" onClick={() => void remove("pricing", item.id, item.title)} aria-label={`Delete ${item.title}`} className="rounded-full border border-red-900/20 p-2 text-red-900"><Trash2 className="h-4 w-4" /></button></div>
                  </li>
                ))}
              </ul>
            </div>

            <div id="admin-news" data-admin-search-form="news-insights" className="scroll-mt-28">
              <SectionHeading icon={<Newspaper className="h-3.5 w-3.5" />} eyebrow="Journal" title="News & insights" count={articles.length} />
              <form data-admin-search-create="Add new news article or insight" data-admin-search-category="News & insights" noValidate onSubmit={(event) => void save("article", event, {
                ...articleDraft,
                publishedAt: new Date(articleDraft.publishedAt || Date.now()).toISOString(),
              })} className="mt-5 space-y-4 border-b border-[#171713]/15 pb-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Title" value={articleDraft.title} required minLength={2} onChange={(title) => setArticleDraft((draft) => ({ ...draft, title }))} />
                  <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">Section
                    <select value={articleDraft.kind} onChange={(event) => setArticleDraft((draft) => ({ ...draft, kind: event.target.value as ArticleDraft["kind"] }))} className="editorial-input mt-1">
                      <option value="NEWS">News</option><option value="INSIGHT">Insight</option>
                    </select>
                  </label>
                  <Field label="Publish date (defaults to now)" value={articleDraft.publishedAt} type="datetime-local" onChange={(publishedAt) => setArticleDraft((draft) => ({ ...draft, publishedAt }))} />
                </div>
                <TextArea label="Short summary" value={articleDraft.excerpt} required minLength={10} onChange={(excerpt) => setArticleDraft((draft) => ({ ...draft, excerpt }))} />
                <TextArea label="Full story" value={articleDraft.body} required minLength={20} rows={6} onChange={(body) => setArticleDraft((draft) => ({ ...draft, body }))} />
                <ImageUploadField label="Story image" imageUrl={articleDraft.imageUrl ?? ""} onChange={(imageUrl) => setArticleDraft((draft) => ({ ...draft, imageUrl }))} />
                <PublishFields value={articleDraft} onChange={(field, value) => setArticleDraft((draft) => ({ ...draft, [field]: value }))} />
                {formErrors.article && <p role="alert" className="border border-red-800/25 bg-red-950/5 px-4 py-3 text-sm text-red-900">{formErrors.article}</p>}
                <SubmitButtons editing={editing?.kind === "article"} saving={saving} onCancel={cancelEdit} />
              </form>
              <ul className="divide-y divide-[#171713]/15">
                {articles.map((item) => (
                  <li key={item.id} data-admin-search-record data-admin-search-label={item.title} data-admin-search-keywords={`${item.kind} ${item.excerpt} news article insight insights story`} data-admin-search-category={item.kind === "NEWS" ? "News article" : "Insight"} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div><p className="editorial-heading text-lg">{item.title}</p><p className="text-[9px] uppercase tracking-[0.12em] text-[#171713]/50">{item.kind} · {item.published ? "Published" : "Draft"}</p></div>
                    <div className="flex gap-2"><button type="button" data-admin-search-edit onClick={() => editArticle(item)} className="editorial-button-outline min-h-9 px-4 py-2 text-[9px]">Edit</button><button type="button" onClick={() => void remove("article", item.id, item.title)} aria-label={`Delete ${item.title}`} className="rounded-full border border-red-900/20 p-2 text-red-900"><Trash2 className="h-4 w-4" /></button></div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="admin-events" data-admin-search-form="events" className="scroll-mt-28 space-y-6">
            <div>
              <SectionHeading icon={<CalendarDays className="h-3.5 w-3.5" />} eyebrow="Community calendar" title="Events" count={events.length} />
              <p className="mt-4 text-xs leading-6 text-[#171713]/55">Only published future events appear in the upcoming events section.</p>
            </div>
            <div>
              <form data-admin-search-create="Add new upcoming event" data-admin-search-category="Events" noValidate onSubmit={(event) => void save("event", event, {
                ...eventDraft,
                startsAt: new Date(eventDraft.startsAt || Date.now() + 60 * 60 * 1000).toISOString(),
                endsAt: eventDraft.endsAt ? new Date(eventDraft.endsAt).toISOString() : "",
              })} className="space-y-4 border-b border-[#171713]/15 pb-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Event title" value={eventDraft.title} required minLength={2} onChange={(title) => setEventDraft((draft) => ({ ...draft, title }))} />
                  <Field label="Location" value={eventDraft.location} required onChange={(location) => setEventDraft((draft) => ({ ...draft, location }))} />
                  <Field label="Starts (defaults to one hour from now)" value={eventDraft.startsAt} type="datetime-local" onChange={(startsAt) => setEventDraft((draft) => ({ ...draft, startsAt }))} />
                  <Field label="Ends (optional)" value={eventDraft.endsAt} type="datetime-local" onChange={(endsAt) => setEventDraft((draft) => ({ ...draft, endsAt }))} />
                  <Field label="Registration or info link" value={eventDraft.registrationUrl ?? ""} type="url" onChange={(registrationUrl) => setEventDraft((draft) => ({ ...draft, registrationUrl }))} />
                </div>
                <TextArea label="Event description" value={eventDraft.description} required minLength={10} onChange={(description) => setEventDraft((draft) => ({ ...draft, description }))} />
                <ImageUploadField label="Event image" imageUrl={eventDraft.imageUrl ?? ""} onChange={(imageUrl) => setEventDraft((draft) => ({ ...draft, imageUrl }))} />
                <PublishFields value={eventDraft} onChange={(field, value) => setEventDraft((draft) => ({ ...draft, [field]: value }))} />
                {formErrors.event && <p role="alert" className="border border-red-800/25 bg-red-950/5 px-4 py-3 text-sm text-red-900">{formErrors.event}</p>}
                <SubmitButtons editing={editing?.kind === "event"} saving={saving} onCancel={cancelEdit} />
              </form>
              <ul className="divide-y divide-[#171713]/15">
                {events.map((item) => (
                  <li key={item.id} data-admin-search-record data-admin-search-label={item.title} data-admin-search-keywords={`${item.description} ${item.location} event upcoming`} data-admin-search-category="Event" className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div><p className="editorial-heading text-lg">{item.title}</p><p className="text-[9px] uppercase tracking-[0.12em] text-[#171713]/50">{new Date(item.startsAt).toLocaleString()} · {item.published ? "Published" : "Draft"}</p></div>
                    <div className="flex gap-2"><button type="button" data-admin-search-edit onClick={() => editEvent(item)} className="editorial-button-outline min-h-9 px-4 py-2 text-[9px]">Edit</button><button type="button" onClick={() => void remove("event", item.id, item.title)} aria-label={`Delete ${item.title}`} className="rounded-full border border-red-900/20 p-2 text-red-900"><Trash2 className="h-4 w-4" /></button></div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
