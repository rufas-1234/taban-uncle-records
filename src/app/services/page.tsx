import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

import { services } from "@/lib/site-data";

export default function ServicesPage() {
  return (
    <div className="editorial-page">
      <div className="editorial-page-inner">
        <section className="editorial-page-hero">
          <p className="editorial-eyebrow">What we do · Made around your vision</p>
          <h1 className="editorial-page-title max-w-5xl">
            Thoughtful production for every part of the <em>story.</em>
          </h1>
          <div className="mt-8 grid gap-8 border-t border-[#171713]/15 pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <p className="max-w-2xl text-lg leading-8 text-[#171713]/70">
              Recording, image-making, and campaign production—shaped around your goals, your audience, and the details that make the work yours.
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#171713]/50">{services.length} ways to create</p>
          </div>
        </section>

        <section className="mt-14 border-t border-[#171713]/20">
          {services.map((service, index) => (
            <article key={service.slug} className="grid gap-5 border-b border-[#171713]/20 py-7 md:grid-cols-[70px_0.85fr_1.15fr] md:gap-8">
              <span className="editorial-heading text-2xl text-[#80643a]">0{index + 1}</span>
              <div>
                <p className="editorial-eyebrow">{service.category}</p>
                <h2 className="editorial-heading mt-2 text-3xl leading-tight sm:text-4xl">{service.title}</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-[1fr_0.8fr]">
                <div>
                  <p className="text-sm leading-7 text-[#171713]/75">{service.description}</p>
                  <p className="mt-3 text-xs leading-6 text-[#171713]/60">{service.blurb}</p>
                </div>
                <ul className="space-y-2 border-l border-[#171713]/15 pl-4">
                  {service.deliverables.map((deliverable) => (
                    <li key={deliverable} className="flex gap-2 text-xs leading-5 text-[#171713]/65">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#80643a]" />
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-16 flex flex-col gap-6 border-y border-[#171713]/20 py-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="editorial-eyebrow">Have a different brief?</p>
            <h2 className="editorial-section-title mt-3">Let’s make a plan that fits.</h2>
          </div>
          <Link href="/booking" className="editorial-button-dark">
            Request a quote <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
