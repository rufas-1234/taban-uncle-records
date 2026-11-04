import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ArrowUpRight, AudioLines, Camera, Sparkles, Video } from "lucide-react";

import { FeaturedCultureSection } from "@/components/featured-culture-section";
import { FullFrameImage } from "@/components/full-frame-image";
import { HeroSlider } from "@/components/hero-slider";
import { HomeUpdates } from "@/components/home-updates";
import { getPublicPortfolio } from "@/lib/creative-content";
import { artists, services, stats } from "@/lib/site-data";

export const instant = false;

const disciplines = ["Sound", "Image", "Culture", "Story"];

export default async function Home() {
  const portfolio = await getPublicPortfolio();
  const featuredWork = portfolio.filter((item) => item.featured).slice(0, 3);

  return (
    <div className="overflow-hidden bg-[#eeeae2] text-[#171713]">
      <HeroSlider />

      <section aria-label="Studio disciplines" className="overflow-hidden border-y border-[#171713]/15 py-5">
        <div className="flex min-w-max animate-editorial-marquee items-center gap-7">
          {[...disciplines, ...disciplines, ...disciplines].map((discipline, index) => (
            <span key={`${discipline}-${index}`} className="flex items-center gap-7">
              <span className="editorial-heading text-3xl tracking-[-0.04em] sm:text-4xl">{discipline}</span>
              <Sparkles aria-hidden="true" className="h-4 w-4 text-[#a77b3f]" />
            </span>
          ))}
        </div>
      </section>

      <Suspense
        fallback={
          <section className="bg-[#171713] px-5 py-20 text-[#eeeae2] sm:px-8 sm:py-28 lg:px-12">
            <div className="mx-auto max-w-[1500px]">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#c5a36d]">Culture archive</p>
              <p className="mt-5 text-sm text-white/60">Loading featured voices and performances…</p>
            </div>
          </section>
        }
      >
        <FeaturedCultureSection />
      </Suspense>
      <Suspense
        fallback={
          <section className="bg-[#171713] px-5 py-20 text-[#eeeae2] sm:px-8 sm:py-28 lg:px-12">
            <p className="mx-auto max-w-[1500px] text-sm text-white/60">Loading studio updates…</p>
          </section>
        }
      >
        <HomeUpdates />
      </Suspense>

      <section className="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#80643a]">A little about us</p>
            <h2 className="editorial-heading mt-5 max-w-lg text-5xl leading-[0.88] tracking-[-0.06em] sm:text-7xl">
              Made to be <em>felt.</em>
            </h2>
          </div>
          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-lg leading-8 text-[#171713]/75 sm:text-xl sm:leading-9">
              We bring artists, ideas, and culture into focus through considered music production and visual storytelling. One close-knit team, from the first conversation to the final frame.
            </p>
            <Link href="/about" className="mt-7 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] transition hover:text-[#80643a]">
              Meet the studio <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="mt-14 grid grid-cols-2 border-y border-[#171713]/15 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={stat.label} className={`py-5 ${index % 2 === 0 ? "border-r" : ""} border-[#171713]/15 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0`}>
              <p className="editorial-heading text-3xl sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-[9px] uppercase tracking-[0.18em] text-[#171713]/60 sm:text-[10px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#171713] px-5 py-20 text-[#eeeae2] sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#c5a36d]">Selected stories</p>
              <h2 className="editorial-heading mt-4 text-5xl tracking-[-0.06em] sm:text-7xl">A few things we made.</h2>
            </div>
            <Link href="/portfolio" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#eeeae2]/70 transition hover:text-[#c5a36d]">
              All projects <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:gap-10">
            {featuredWork.map((item, index) => (
              <Link key={item.title} href="/portfolio" className={`group block ${index === 0 ? "md:col-span-2" : ""}`}>
                <div
                  role="img"
                  aria-label={item.title}
                  className={`editorial-work-image relative overflow-hidden bg-[#292821] ${index === 0 ? "aspect-[1.65/1]" : "aspect-[1.25/1]"}`}
                >
                  <FullFrameImage src={item.imageUrl} alt={item.title} sizes="(max-width: 768px) 100vw, 75vw" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/10 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-4 flex items-start justify-between gap-4 border-b border-white/20 pb-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.22em] text-[#c5a36d]">{item.category}</p>
                    <h3 className="editorial-heading mt-2 text-2xl sm:text-3xl">{item.title}</h3>
                  </div>
                  <span className="pt-1 text-xs text-[#eeeae2]/55">0{index + 1}</span>
                </div>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#eeeae2]/65">{item.description}</p>
              </Link>
            ))}
          </div>
          {featuredWork.length === 0 && (
            <p className="mt-8 border-t border-white/20 pt-5 text-sm text-white/60">
              New studio projects are being prepared. Check back soon.
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#80643a]">What we do</p>
            <h2 className="editorial-heading mt-4 max-w-md text-5xl leading-[0.9] tracking-[-0.06em] sm:text-6xl">
              One studio. Many ways to <em>create.</em>
            </h2>
            <Link href="/services" className="mt-7 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] transition hover:text-[#80643a]">
              Explore services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="border-t border-[#171713]/20">
            {services.slice(0, 5).map((service, index) => (
              <Link
                href="/services"
                key={service.slug}
                className="group flex items-center justify-between gap-5 border-b border-[#171713]/20 py-5 transition hover:px-2"
              >
                <div className="flex items-center gap-5 sm:gap-8">
                  <span className="text-[10px] text-[#171713]/40">0{index + 1}</span>
                  <div>
                    <span className="editorial-heading text-2xl sm:text-3xl">{service.title}</span>
                    <span className="ml-3 hidden text-[9px] uppercase tracking-[0.18em] text-[#80643a] sm:inline">{service.category}</span>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[#171713]/45 transition group-hover:text-[#80643a]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#d9d0c0] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full border border-[#171713]/10 sm:right-0" />
        <div className="relative mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#80643a]">The studio team</p>
            <h2 className="editorial-heading mt-4 max-w-3xl text-5xl leading-[0.88] tracking-[-0.06em] sm:text-7xl">
              Good work comes from good <em>people.</em>
            </h2>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {artists.map((artist) => (
                <div key={artist.name}>
                  <p className="editorial-heading text-xl">{artist.name}</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#171713]/55">{artist.role}</p>
                </div>
              ))}
            </div>
          </div>
          <Link href="/artists" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] transition hover:text-[#80643a]">
            Meet the artists <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="bg-[#eeeae2] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] flex-col items-start justify-between gap-8 border-t border-[#171713]/20 pt-8 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#80643a]">Have something in mind?</p>
            <h2 className="editorial-heading mt-4 max-w-3xl text-5xl leading-[0.9] tracking-[-0.06em] sm:text-7xl">
              Let&apos;s make it <em>mean something.</em>
            </h2>
          </div>
          <Link href="/booking" className="inline-flex items-center gap-3 rounded-full bg-[#171713] px-6 py-4 text-xs uppercase tracking-[0.16em] text-[#eeeae2] transition hover:bg-[#80643a]">
            Start a project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mx-auto mt-16 flex max-w-[1500px] flex-wrap gap-x-7 gap-y-3 border-t border-[#171713]/15 pt-5 text-[9px] uppercase tracking-[0.2em] text-[#171713]/55 sm:text-[10px]">
          <span className="inline-flex items-center gap-2"><AudioLines className="h-3.5 w-3.5" /> Audio</span>
          <span className="inline-flex items-center gap-2"><Camera className="h-3.5 w-3.5" /> Photography</span>
          <span className="inline-flex items-center gap-2"><Video className="h-3.5 w-3.5" /> Film</span>
          <span className="ml-auto">Juba, South Sudan · Working everywhere</span>
        </div>
      </section>
    </div>
  );
}
