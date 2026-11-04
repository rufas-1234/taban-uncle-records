import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, BadgeDollarSign } from "lucide-react";

import { getPublicPricing } from "@/lib/studio-content";

function priceLabel(amount: number | null, currency: string) {
  if (amount === null) return "Request a quote";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

async function PricingList() {
  const prices = await getPublicPricing();

  return (
    <section className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {prices.map((item) => (
        <article key={item.id} className={`flex min-h-[270px] flex-col border p-6 sm:p-7 ${item.featured ? "border-[#80643a]/60 bg-[#80643a]/5" : "border-[#171713]/15"}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="editorial-eyebrow">{item.category}</p>
              <h2 className="editorial-heading mt-3 text-3xl leading-tight">{item.title}</h2>
            </div>
            <BadgeDollarSign className="h-5 w-5 shrink-0 text-[#80643a]" />
          </div>
          <p className="mt-4 text-sm leading-6 text-[#171713]/65">{item.description}</p>
          <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#171713]/15 pt-5">
            <div>
              <p className="editorial-heading text-2xl">{priceLabel(item.priceAmount, item.currency)}</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#171713]/50">{item.priceUnit}</p>
            </div>
            <Link href="/booking" aria-label={`Enquire about ${item.title}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171713] text-[#eeeae2] transition hover:bg-[#80643a]">
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      ))}
      {prices.length === 0 && (
        <div className="border border-[#171713]/15 p-7 sm:col-span-2 xl:col-span-3">
          <h2 className="editorial-heading text-3xl">Pricing is being prepared.</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#171713]/65">Contact the studio for a custom quote, or check back soon for the latest service rates.</p>
          <Link href="/booking" className="editorial-button-dark mt-5">Request a quote <ArrowRight className="h-4 w-4" /></Link>
        </div>
      )}
    </section>
  );
}

export default function PricingPage() {
  return (
    <div className="editorial-page">
      <div className="editorial-page-inner">
        <header className="editorial-page-hero">
          <p className="editorial-eyebrow">Studio services · Clear, considered pricing</p>
          <h1 className="editorial-page-title max-w-5xl">Good work, <em>well made.</em></h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#171713]/70">
            Recording, photography, film, and production rates are managed by the studio. If a service has no set rate, request a quote and we’ll scope it to your project.
          </p>
        </header>
        <Suspense fallback={<p className="py-12 text-sm text-[#171713]/60">Loading studio rates…</p>}>
          <PricingList />
        </Suspense>
      </div>
    </div>
  );
}
