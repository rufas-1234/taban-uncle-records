"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowDownRight, Search, X } from "lucide-react";

type SearchTarget = {
  element: HTMLElement;
  label: string;
  category: string;
  action: "edit" | "open";
};

function findTargets(query: string): SearchTarget[] {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  return Array.from(
    document.querySelectorAll<HTMLElement>("[data-admin-search-create], [data-admin-search-record]"),
  )
    .map((element) => {
      const createLabel = element.dataset.adminSearchCreate;
      const label = createLabel ?? element.dataset.adminSearchLabel ?? "";
      const searchable = `${label} ${element.dataset.adminSearchCategory ?? ""} ${element.dataset.adminSearchKeywords ?? ""}`.toLocaleLowerCase();
      const matches = terms.every((term) => searchable.includes(term));
      if (!matches) return null;

      return {
        element,
        label,
        category: element.dataset.adminSearchCategory ?? (createLabel ? "Add new" : "Record"),
        action: createLabel ? "open" : "edit",
      } satisfies SearchTarget;
    })
    .filter((target): target is SearchTarget => target !== null)
    .slice(0, 8);
}

export function AdminContentSearch() {
  const searchRoot = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchTarget[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!query) return;

    const observer = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => !searchRoot.current?.contains(mutation.target))) {
        setResults(findTargets(query));
      }
    });
    observer.observe(document.querySelector(".editorial-page-inner") ?? document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [query]);

  function search(value: string) {
    setQuery(value);
    setResults(findTargets(value));
    setActiveIndex(0);
  }

  function openTarget(target: SearchTarget) {
    const form = target.action === "edit"
      ? target.element.closest<HTMLElement>("[data-admin-search-form]")
      : target.element;
    const destination = form ?? target.element;

    destination.scrollIntoView({ behavior: "smooth", block: "center" });
    if (target.action === "edit") {
      target.element.querySelector<HTMLButtonElement>("[data-admin-search-edit]")?.click();
    }

    window.setTimeout(() => {
      destination.querySelector<HTMLElement>("input:not([type='checkbox']), textarea, select, button")?.focus({
        preventScroll: true,
      });
    }, 250);
    setQuery("");
    setResults([]);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      search("");
      return;
    }
    if (event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    }
    if (event.key === "ArrowUp" && results.length) {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    }
    if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      openTarget(results[activeIndex]);
    }
  }

  return (
    <div ref={searchRoot} className="sticky top-20 z-40 mt-6">
      <div className="relative mx-auto max-w-4xl rounded-2xl border border-[#171713]/15 bg-[#eeeae2]/95 p-2 shadow-xl shadow-black/10 backdrop-blur-2xl">
        <label className="flex items-center gap-3 px-3">
          <Search className="h-5 w-5 shrink-0 text-[#80643a]" />
          <input
            type="search"
            value={query}
            onChange={(event) => search(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search records or type “add news”, “pricing”, “booking”…"
            aria-label="Search admin records and publishing actions"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={query.length > 0}
            aria-controls="admin-search-results"
            aria-activedescendant={results[activeIndex] ? `admin-search-result-${activeIndex}` : undefined}
            className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#171713] outline-none placeholder:text-[#171713]/45"
          />
          {query && (
            <button type="button" onClick={() => search("")} className="rounded-full p-2 text-[#171713]/55 transition hover:bg-black/5 hover:text-[#171713]" aria-label="Clear search">
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="hidden rounded-md border border-[#171713]/15 px-2 py-1 text-[9px] text-[#171713]/45 sm:block">ESC</span>
        </label>

        {query && (
          <div id="admin-search-results" role="listbox" aria-label="Admin search results" className="mt-2 max-h-[min(60vh,28rem)] overflow-y-auto border-t border-[#171713]/10 pt-2">
            {results.length ? results.map((result, index) => (
              <button
                key={`${result.label}-${index}`}
                id={`admin-search-result-${index}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => openTarget(result)}
                className={`flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3 text-left transition ${index === activeIndex ? "bg-[#171713]/[0.07]" : "hover:bg-[#171713]/[0.04]"}`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm text-[#171713]">{result.label}</span>
                  <span className="mt-1 block text-[9px] uppercase tracking-[0.16em] text-[#80643a]">{result.category}</span>
                </span>
                <ArrowDownRight className="h-4 w-4 shrink-0 text-[#80643a]" />
              </button>
            )) : (
              <p className="px-4 py-5 text-sm text-[#171713]/55">No matching records or actions. Try a name, title, or section.</p>
            )}
          </div>
        )}
      </div>
      <p className="mx-auto mt-2 max-w-4xl px-3 text-[10px] text-[#171713]/55">
        Search names and titles to edit records, or search “add” with a section name to open a new form.
      </p>
    </div>
  );
}
