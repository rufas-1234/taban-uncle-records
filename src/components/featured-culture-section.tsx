import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { getPublicCultureContent } from "@/lib/culture-content";
import { YouTubeFeature } from "@/components/youtube-feature";

export async function FeaturedCultureSection({ featuredOnly = true }: { featuredOnly?: boolean }) {
  const { artists, media } = await getPublicCultureContent();
  const visibleArtists = featuredOnly ? artists.filter((artist) => artist.featured) : artists;
  const visibleMedia = featuredOnly ? media.filter((item) => item.featured).slice(0, 5) : media;

  return (
    <section className="bg-[#171713] px-5 py-20 text-[#eeeae2] sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-8 border-b border-white/15 pb-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#c5a36d]">
              Voices, rhythms & culture
            </p>
            <h2 className="editorial-heading mt-4 max-w-3xl text-5xl leading-[0.9] tracking-[-0.06em] sm:text-7xl">
              Rooted in Pojulu. Open to every <em>culture.</em>
            </h2>
          </div>
          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-sm leading-7 text-[#eeeae2]/65 sm:text-base">
              A growing archive of South Sudanese voices and traditions, starting with Pojulu music and
              community life. Each feature links back to its original publisher; popularity is never
              claimed without a source.
            </p>
            <Link
              href="/artists"
              className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#c5a36d] transition hover:text-white"
            >
              Explore artists and culture <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {visibleArtists.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {visibleArtists.map((artist) => (
              <a
                key={artist.id}
                href={artist.sourceUrl ?? "/artists"}
                target={artist.sourceUrl ? "_blank" : undefined}
                rel={artist.sourceUrl ? "noopener noreferrer" : undefined}
                className="group flex max-w-xl items-start gap-4 border border-white/15 px-4 py-4 transition hover:border-[#c5a36d]/70 sm:px-5"
              >
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#c5a36d]/50 bg-white/5 text-lg text-[#c5a36d]">
                  {artist.imageUrl ? (
                    <Image src={artist.imageUrl} alt={`${artist.name} portrait`} fill unoptimized className="object-cover" />
                  ) : (
                    <span className="editorial-heading">{artist.name.slice(0, 1)}</span>
                  )}
                </span>
                <span>
                  <span className="flex items-center gap-2 text-sm text-white">
                    {artist.name}
                    <ArrowUpRight className="h-3 w-3 text-[#c5a36d] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                  <span className="mt-1 block text-[9px] uppercase tracking-[0.16em] text-white/50">
                    {artist.culture} · {artist.role}
                  </span>
                </span>
              </a>
            ))}
          </div>
        )}

        {visibleMedia.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {visibleMedia.map((item) => (
              <YouTubeFeature key={item.id} media={item} />
            ))}
          </div>
        ) : (
          <p className="mt-10 border border-white/15 p-6 text-sm text-white/60">
            No published community features yet. Check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
