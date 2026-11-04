import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

import { FeaturedCultureSection } from "@/components/featured-culture-section";
import { YouTubeFeature } from "@/components/youtube-feature";
import { getLatestSongReleases } from "@/lib/culture-content";
import { getPublicTeam, type PublicTeamMember } from "@/lib/creative-content";

export const instant = false;

export default async function ArtistsPage() {
  const [team, latestSongs] = await Promise.all([getPublicTeam(), getLatestSongReleases()]);
  const coreTeam = team.filter((member) => member.group === "CORE_TEAM");
  const producers = team.filter((member) => member.group === "PRODUCER");
  const sessionMusicians = team.filter((member) => member.group === "SESSION_MUSICIAN");

  return (
    <div className="editorial-page">
      <div className="editorial-page-inner">
        <section className="editorial-page-hero">
          <p className="editorial-eyebrow">South Sudanese artists · Music, heritage, and community</p>
          <h1 className="editorial-page-title max-w-5xl">
            Many voices. A living <em>culture.</em>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#171713]/70">
            Discover Pojulu music and traditions alongside the artists, channels, and community storytellers
            carrying South Sudanese culture forward.
          </p>
        </section>
      </div>

      <Suspense
        fallback={
          <section className="bg-[#171713] px-5 py-20 text-[#eeeae2] sm:px-8 sm:py-28 lg:px-12">
            <p className="mx-auto max-w-[1500px] text-sm text-white/60">Loading cultural features…</p>
          </section>
        }
      >
        <FeaturedCultureSection featuredOnly={false} />
      </Suspense>

      <section className="bg-[#171713] px-5 py-16 text-[#eeeae2] sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-white/15 pb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#c5a36d]">Fresh from the studio</p>
              <h2 className="editorial-heading mt-3 text-4xl sm:text-6xl">Latest song releases.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/60">Recently published songs from artists and music channels, shared with their original video credits.</p>
          </div>
          {latestSongs.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {latestSongs.map((song) => <YouTubeFeature key={song.id} media={song} />)}
            </div>
          ) : (
            <p className="mt-8 text-sm text-white/60">No new songs have been published yet. Check back soon.</p>
          )}
        </div>
      </section>

      <div className="editorial-page-inner">
        <section className="mt-14 border-t border-[#171713]/20 pt-10">
          <p className="editorial-eyebrow">The studio team · The people behind the work</p>
          <h2 className="editorial-section-title mt-3">The people behind every project.</h2>
        </section>

        <section className="grid gap-x-8 md:grid-cols-2">
          {coreTeam.map((member, index) => (
            <article key={member.id} className="border-t border-[#171713]/20 py-7">
              <div className="flex items-start justify-between">
                <span className="editorial-heading text-3xl text-[#80643a]">0{index + 1}</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#171713]/50">Studio team</span>
              </div>
              <div className="relative mt-6 aspect-[4/5] w-full max-w-[320px] overflow-hidden bg-[#d9d0c0]">
                {member.imageUrl ? (
                  <Image src={member.imageUrl} alt={`${member.name} portrait`} fill sizes="(max-width: 768px) 100vw, 50vw" unoptimized className="object-cover" />
                ) : (
                  <div className="editorial-heading flex h-full items-center justify-center text-7xl text-[#80643a]/70" aria-label={`${member.name} portrait not added`}>
                    {member.name.slice(0, 1)}
                  </div>
                )}
              </div>
              <h2 className="editorial-heading mt-8 text-4xl sm:text-5xl">{member.name}</h2>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#80643a]">{member.title}</p>
              {member.bio && <p className="mt-5 max-w-xl text-sm leading-7 text-[#171713]/70">{member.bio}</p>}
            </article>
          ))}
        </section>
        {coreTeam.length === 0 && <p className="border-t border-[#171713]/20 py-7 text-sm text-[#171713]/60">Our studio team profiles are being updated.</p>}

        <StudioContributorSection
          eyebrow="Production team · Sound shaped together"
          title="Our producers."
          description="Meet the music producers who guide arrangements, recordings, and finished mixes."
          members={producers}
          emptyMessage="Producer profiles will appear here once they are added and published in the studio admin."
        />
        <StudioContributorSection
          eyebrow="Session players · The sound behind the songs"
          title="Keyboardists, guitarists & more."
          description="Discover the instrumentalists who bring each recording to life, from keys and guitar to the rhythm section."
          members={sessionMusicians}
          emptyMessage="Keyboardist, guitarist, and other session musician profiles will appear here once they are added and published in the studio admin."
        />

        <section className="mt-12 flex flex-col gap-5 border-y border-[#171713]/20 py-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="editorial-eyebrow">Work with the team</p>
            <h2 className="editorial-section-title mt-3">Bring your next idea into focus.</h2>
          </div>
          <Link href="/booking" className="editorial-button-dark">
            Start a conversation <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}

function StudioContributorSection({
  eyebrow,
  title,
  description,
  members,
  emptyMessage,
}: {
  eyebrow: string;
  title: string;
  description: string;
  members: PublicTeamMember[];
  emptyMessage: string;
}) {
  return (
    <section className="mt-16 border-t border-[#171713]/20 pt-8">
      <div className="mb-7 grid gap-4 sm:grid-cols-[1fr_0.8fr] sm:items-end">
        <div>
          <p className="editorial-eyebrow">{eyebrow}</p>
          <h2 className="editorial-section-title mt-3">{title}</h2>
        </div>
        <p className="max-w-lg text-sm leading-7 text-[#171713]/65">{description}</p>
      </div>
      {members.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <article key={member.id} className="border-t border-[#171713]/15 pt-4">
              <div className="relative aspect-square w-full max-w-[260px] overflow-hidden bg-[#d9d0c0]">
                {member.imageUrl ? (
                  <Image src={member.imageUrl} alt={`${member.name} portrait`} fill sizes="(max-width: 640px) 100vw, 33vw" unoptimized className="object-cover" />
                ) : (
                  <div className="editorial-heading flex h-full items-center justify-center text-6xl text-[#80643a]/70" aria-label={`${member.name} portrait not added`}>
                    {member.name.slice(0, 1)}
                  </div>
                )}
              </div>
              <h3 className="editorial-heading mt-4 text-2xl">{member.name}</h3>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#80643a]">{member.title}</p>
              {member.bio && <p className="mt-3 text-sm leading-6 text-[#171713]/65">{member.bio}</p>}
            </article>
          ))}
        </div>
      ) : (
        <p className="border-y border-[#171713]/15 py-5 text-sm text-[#171713]/55">{emptyMessage}</p>
      )}
    </section>
  );
}
