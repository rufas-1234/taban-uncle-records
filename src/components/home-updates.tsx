import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";

import { getPublicArticles, getUpcomingEvents } from "@/lib/studio-content";

function formattedDate(value: Date) {
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(value);
}

export async function HomeUpdates() {
  const [articles, events] = await Promise.all([getPublicArticles(), getUpcomingEvents(2)]);

  return (
    <section className="bg-[#171713] px-5 py-20 text-[#eeeae2] sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto grid max-w-[1500px] gap-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <div className="flex items-end justify-between gap-4 border-b border-white/15 pb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#c5a36d]">From the studio</p>
              <h2 className="editorial-heading mt-3 text-5xl tracking-[-0.06em] sm:text-6xl">News & <em>insights.</em></h2>
            </div>
            <Link href="/news" aria-label="View all news and insights" className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 transition hover:border-[#c5a36d] hover:text-[#c5a36d]">
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          {articles.length > 0 ? (
            <div className="divide-y divide-white/15">
              {articles.slice(0, 3).map((article) => (
                <article key={article.id} className="grid gap-4 py-5 sm:grid-cols-[96px_1fr]">
                  {article.imageUrl ? (
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-white/5">
                      <Image src={article.imageUrl} alt="" fill unoptimized className="object-cover" />
                    </div>
                  ) : (
                    <div className="editorial-heading flex aspect-square items-center justify-center rounded-lg border border-white/15 text-3xl text-[#c5a36d]">
                      {article.kind === "NEWS" ? "N" : "I"}
                    </div>
                  )}
                  <div className="flex flex-col items-start">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-[#c5a36d]">
                      {article.kind === "NEWS" ? "Studio news" : "Insight"} · {formattedDate(article.publishedAt)}
                    </p>
                    <h3 className="editorial-heading mt-2 text-2xl">{article.title}</h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-6 text-white/60">{article.excerpt}</p>
                    <Link href="/news" className="mt-3 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-white/80 hover:text-[#c5a36d]">
                      Read more <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="py-7 text-sm leading-7 text-white/60">News and studio insights will be shared here. Check back for stories from the team.</p>
          )}
        </div>

        <div>
          <div className="flex items-end justify-between gap-4 border-b border-white/15 pb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#c5a36d]">Meet us there</p>
              <h2 className="editorial-heading mt-3 text-5xl tracking-[-0.06em] sm:text-6xl">Coming <em>up.</em></h2>
            </div>
            <Link href="/events" aria-label="View all upcoming events" className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 transition hover:border-[#c5a36d] hover:text-[#c5a36d]">
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          {events.length > 0 ? (
            <div className="divide-y divide-white/15">
              {events.map((event) => (
                <article key={event.id} className="grid gap-4 py-6 sm:grid-cols-[74px_1fr]">
                  <div className="flex h-[74px] flex-col items-center justify-center border border-[#c5a36d]/50 text-center text-[#c5a36d]">
                    <span className="text-[8px] uppercase tracking-[0.17em]">{new Intl.DateTimeFormat("en", { month: "short" }).format(event.startsAt)}</span>
                    <span className="editorial-heading text-3xl leading-none">{new Intl.DateTimeFormat("en", { day: "2-digit" }).format(event.startsAt)}</span>
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-white/55">
                      <CalendarDays className="h-3 w-3 text-[#c5a36d]" />
                      {formattedDate(event.startsAt)} · {event.location}
                    </p>
                    <h3 className="editorial-heading mt-2 text-2xl">{event.title}</h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-6 text-white/60">{event.description}</p>
                    {event.registrationUrl && (
                      <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-white/80 hover:text-[#c5a36d]">
                        Event details <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="py-7 text-sm leading-7 text-white/60">No upcoming dates are posted yet. Follow the Pojulu Cultural Festival page for community announcements.</p>
          )}
        </div>
      </div>
    </section>
  );
}
