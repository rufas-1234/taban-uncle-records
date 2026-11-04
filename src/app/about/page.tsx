import { ArrowRight, Music2, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { getPublicTeam } from "@/lib/creative-content";

export const instant = false;

const principles = [
  { label: "Creative direction", value: "Brand + artist-first", icon: Sparkles },
  { label: "Production support", value: "From concept to final delivery", icon: Music2 },
  { label: "People-first collaboration", value: "Built with clarity and trust", icon: Users },
];

export default async function AboutPage() {
  const team = (await getPublicTeam()).filter((member) => member.group === "CORE_TEAM");

  return (
    <div className="editorial-page">
      <div className="editorial-page-inner">
        <section className="editorial-page-hero">
          <p className="editorial-eyebrow">About the studio · Juba, South Sudan</p>
          <h1 className="editorial-page-title max-w-5xl">
            A creative home for sound, story, and <em>cultural expression.</em>
          </h1>
          <div className="mt-8 grid gap-8 border-t border-[#171713]/15 pt-6 md:grid-cols-[1fr_0.7fr]">
            <p className="max-w-3xl text-lg leading-8 text-[#171713]/75 sm:text-xl sm:leading-9">
              Taban Uncle Records exists to help artists, founders, and communities shape work that feels deliberate, magnetic, and deeply rooted in real identity.
            </p>
            <p className="text-sm leading-7 text-[#171713]/65">
              From recording sessions to photography, videography, and polished content systems, we balance art direction, technical care, and reliable delivery.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/booking" className="editorial-button-dark">
              Book a session <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/portfolio" className="editorial-button-outline">
              View selected work
            </Link>
          </div>
        </section>

        <section className="editorial-panel mt-16 grid gap-8 md:grid-cols-[0.6fr_1.4fr]">
          <div>
            <p className="editorial-eyebrow">Our approach</p>
            <h2 className="editorial-section-title mt-3">Listen.<br />Shape.<br /><em>Deliver.</em></h2>
          </div>
          <div className="divide-y divide-[#171713]/15 border-y border-[#171713]/15">
            {[
              "Listen closely to the artist, brand, or story behind the brief.",
              "Shape the creative direction around clarity, style, and audience intent.",
              "Deliver polished assets, content systems, and production-ready final work.",
            ].map((step, index) => (
              <div key={step} className="flex items-start gap-5 py-5">
                <span className="editorial-heading text-2xl text-[#80643a]">0{index + 1}</span>
                <p className="max-w-2xl text-base leading-7 text-[#171713]/75">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="editorial-eyebrow">What matters to us</p>
              <h2 className="editorial-section-title mt-3">The work is personal.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#171713]/65">A thoughtful process gives every voice, frame, and idea room to become its strongest self.</p>
          </div>
          <div className="grid border-y border-[#171713]/15 md:grid-cols-3 md:divide-x md:divide-[#171713]/15">
            {principles.map(({ label, value, icon: Icon }, index) => (
              <article key={label} className="py-6 md:px-6 md:first:pl-0 md:last:pr-0">
                <div className="flex items-center justify-between">
                  <span className="editorial-heading text-3xl text-[#80643a]">0{index + 1}</span>
                  <Icon className="h-5 w-5 text-[#80643a]" />
                </div>
                <p className="editorial-heading mt-6 text-2xl">{label}</p>
                <p className="mt-2 text-sm text-[#171713]/60">{value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-8">
            <p className="editorial-eyebrow">The people</p>
            <h2 className="editorial-section-title mt-3">Small team. Close collaboration.</h2>
          </div>
          <div className="grid gap-x-8 md:grid-cols-2">
            {team.map((member, index) => (
              <article key={member.id} className="flex items-start gap-5 border-t border-[#171713]/15 py-5">
                <span className="editorial-heading pt-2 text-2xl text-[#80643a]">0{index + 1}</span>
                <div className="flex min-w-0 items-start gap-4">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#d9d0c0]">
                    {member.imageUrl ? (
                      <Image src={member.imageUrl} alt={`${member.name} portrait`} fill sizes="80px" unoptimized className="object-cover" />
                    ) : (
                      <span className="editorial-heading text-3xl text-[#80643a]" aria-label={`${member.name} portrait not added`}>{member.name.slice(0, 1)}</span>
                    )}
                  </div>
                  <div className="pt-1">
                    <h3 className="editorial-heading text-2xl">{member.name}</h3>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#171713]/55">{member.title}</p>
                    {member.bio && <p className="mt-3 max-w-md text-sm leading-6 text-[#171713]/65">{member.bio}</p>}
                  </div>
                </div>
              </article>
            ))}
          </div>
          {team.length === 0 && <p className="border-t border-[#171713]/15 py-5 text-sm text-[#171713]/60">Team profiles are being updated. Check back soon.</p>}
        </section>
      </div>
    </div>
  );
}
