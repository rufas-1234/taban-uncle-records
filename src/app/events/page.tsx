import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";

import { getUpcomingEvents } from "@/lib/studio-content";

function EventDate({ date }: { date: Date }) {
  return (
    <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center border border-[#80643a]/50 text-[#80643a]">
      <span className="text-[9px] uppercase tracking-[0.16em]">{new Intl.DateTimeFormat("en", { month: "short" }).format(date)}</span>
      <span className="editorial-heading text-4xl leading-none">{new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date)}</span>
    </div>
  );
}

async function UpcomingEvents() {
  const events = await getUpcomingEvents();
  if (events.length === 0) {
    return (
      <div className="mt-10 border border-[#171713]/15 p-7 sm:p-10">
        <p className="editorial-eyebrow">No dates announced</p>
        <h2 className="editorial-heading mt-3 text-3xl">The next gathering is on its way.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#171713]/65">There are no upcoming events posted right now. Follow the Pojulu Cultural Festival page for community events and announcements.</p>
        <a href="https://www.facebook.com/profile.php?id=61585510990428" target="_blank" rel="noopener noreferrer" className="editorial-button-dark mt-5">
          Visit the festival page <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-6">
      {events.map((event) => (
        <article key={event.id} className="grid gap-6 border-y border-[#171713]/15 py-6 md:grid-cols-[80px_1fr] md:gap-8">
          <EventDate date={event.startsAt} />
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[9px] uppercase tracking-[0.15em] text-[#171713]/55">
                <span className="inline-flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-[#80643a]" />{new Intl.DateTimeFormat("en", { dateStyle: "long", timeStyle: "short" }).format(event.startsAt)}</span>
                <span className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-[#80643a]" />{event.location}</span>
              </p>
              <h2 className="editorial-heading mt-4 text-3xl sm:text-4xl">{event.title}</h2>
              <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-7 text-[#171713]/65">{event.description}</p>
              {event.registrationUrl && (
                <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="editorial-button-dark mt-5">
                  Event details <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
            {event.imageUrl && (
              <div className="relative aspect-[1.5/1] overflow-hidden bg-[#171713]/5 lg:aspect-[1.25/1]">
                <Image src={event.imageUrl} alt="" fill unoptimized className="object-cover" />
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export default function EventsPage() {
  return (
    <div className="editorial-page">
      <div className="editorial-page-inner">
        <header className="editorial-page-hero">
          <p className="editorial-eyebrow">Community · Culture · Coming together</p>
          <h1 className="editorial-page-title max-w-5xl">See you <em>there.</em></h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#171713]/70">Upcoming studio sessions, live performances, cultural gatherings, and community events.</p>
        </header>
        <Suspense fallback={<p className="py-12 text-sm text-[#171713]/60">Loading upcoming events…</p>}>
          <UpcomingEvents />
        </Suspense>
        <section className="mt-14 border-t border-[#171713]/15 pt-7">
          <p className="editorial-eyebrow">Hosting something?</p>
          <h2 className="editorial-heading mt-3 text-3xl">Let’s put your event in motion.</h2>
          <Link href="/booking" className="editorial-button-dark mt-5">Work with the studio</Link>
        </section>
      </div>
    </div>
  );
}
