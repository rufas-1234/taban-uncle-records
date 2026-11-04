import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { FullFrameImage } from "@/components/full-frame-image";
import { getPublicPortfolio } from "@/lib/creative-content";

export const instant = false;

export default async function PortfolioPage() {
  const portfolioItems = await getPublicPortfolio();

  return (
    <div className="editorial-page">
      <div className="editorial-page-inner">
        <section className="editorial-page-hero">
          <p className="editorial-eyebrow">Selected work · Sound meets image</p>
          <h1 className="editorial-page-title max-w-5xl">
            Stories made to move, <em>stay, and be remembered.</em>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#171713]/70">
            A collection of work across music, portraits, live moments, and moving image—each with its own point of view.
          </p>
        </section>

        <section className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2">
          {portfolioItems.map((item, index) => (
            <Link key={item.title} href="/booking" className={`group block ${index === 0 ? "sm:col-span-2" : ""}`}>
              <div
                role="img"
                aria-label={item.title}
                className={`editorial-work-image relative overflow-hidden bg-[#d9d0c0] ${index === 0 ? "aspect-[1.7/1]" : "aspect-[1.2/1]"}`}
              >
                <FullFrameImage src={item.imageUrl} alt={item.title} sizes="(max-width: 640px) 100vw, 50vw" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-[9px] uppercase tracking-[0.22em] text-white">{item.type}</span>
                <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-black/10 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-4 border-b border-[#171713]/20 pb-4">
                <div>
                  <p className="editorial-eyebrow">{item.category}</p>
                  <h2 className="editorial-heading mt-2 text-3xl sm:text-4xl">{item.title}</h2>
                </div>
                <span className="editorial-heading text-xl text-[#80643a]">0{index + 1}</span>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#171713]/65">{item.description}</p>
            </Link>
          ))}
        </section>
        {portfolioItems.length === 0 && (
          <p className="mt-14 border-t border-[#171713]/20 pt-6 text-sm text-[#171713]/60">
            New studio projects are being prepared. Check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
