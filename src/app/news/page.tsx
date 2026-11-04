import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { FullFrameImage } from "@/components/full-frame-image";
import { getPublicArticles } from "@/lib/studio-content";

function dateLabel(date: Date) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

async function ArticleSections() {
  const articles = await getPublicArticles();
  const news = articles.filter((item) => item.kind === "NEWS");
  const insights = articles.filter((item) => item.kind === "INSIGHT");

  return (
    <div className="mt-12 space-y-16">
      {[
        { title: "Studio news", eyebrow: "What’s happening", entries: news },
        { title: "Ideas & insights", eyebrow: "Notes from the studio", entries: insights },
      ].map((section) => (
        <section key={section.title}>
          <div className="flex items-end justify-between gap-4 border-b border-[#171713]/20 pb-4">
            <div>
              <p className="editorial-eyebrow">{section.eyebrow}</p>
              <h2 className="editorial-heading mt-2 text-4xl sm:text-5xl">{section.title}</h2>
            </div>
            <span className="pb-1 text-[9px] uppercase tracking-[0.16em] text-[#171713]/45">{section.entries.length} stories</span>
          </div>
          {section.entries.length ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {section.entries.map((article) => (
                <article key={article.id} className="flex flex-col border border-[#171713]/15">
                  {article.imageUrl ? (
                    <div className="relative aspect-[1.45/1] overflow-hidden bg-[#d9d0c0]">
                      <FullFrameImage src={article.imageUrl} alt={article.title} />
                    </div>
                  ) : (
                    <div className="editorial-heading flex aspect-[1.45/1] items-center justify-center bg-[#d9d0c0] text-5xl text-[#80643a]">
                      {section.title === "Studio news" ? "N" : "I"}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[9px] uppercase tracking-[0.17em] text-[#80643a]">{dateLabel(article.publishedAt)}</p>
                    <h3 className="editorial-heading mt-3 text-2xl leading-tight">{article.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#171713]/65">{article.excerpt}</p>
                    <details className="group mt-5 border-t border-[#171713]/15 pt-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between text-[9px] uppercase tracking-[0.15em] text-[#80643a]">
                        Read story <ArrowRight className="h-3.5 w-3.5 transition group-open:rotate-90" />
                      </summary>
                      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#171713]/75">{article.body}</p>
                    </details>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-5 border border-dashed border-[#171713]/20 p-5 text-sm text-[#171713]/60">
              New {section.title.toLowerCase()} will appear here.
            </p>
          )}
        </section>
      ))}
      <div className="flex flex-wrap items-center justify-between gap-5 border-y border-[#171713]/20 py-7">
        <p className="editorial-heading text-2xl">Have a story worth sharing?</p>
        <Link href="/booking" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#80643a]">
          Talk to the studio <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default function NewsPage() {
  return (
    <div className="editorial-page">
      <div className="editorial-page-inner">
        <header className="editorial-page-hero">
          <p className="editorial-eyebrow">Journal · News, notes & ideas</p>
          <h1 className="editorial-page-title max-w-5xl">Stories from <em>the studio.</em></h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#171713]/70">Studio announcements, creative perspectives, and stories connected to South Sudan’s music and culture.</p>
        </header>
        <Suspense fallback={<p className="py-12 text-sm text-[#171713]/60">Loading studio stories…</p>}>
          <ArticleSections />
        </Suspense>
      </div>
    </div>
  );
}
