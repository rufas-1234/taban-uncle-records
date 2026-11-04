"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";

const slides = [
  {
    eyebrow: "Pojulu Cultural Festival · Juba, South Sudan",
    title: <>Culture is a sound<br />you can <em>feel.</em></>,
    description: "Honouring Pojulu heritage and the many voices that make South Sudan sing.",
    image: "/images/pojulu-cultural-festival.jpg",
    imageAlt: "Pojulu Cultural Festival emblem, shared by its official Facebook page",
    imageSize: "contain",
    href: "/artists",
    action: "Explore the culture archive",
  },
  {
    eyebrow: "Recording · Production · Sound",
    title: <>Make room for<br />your <em>real sound.</em></>,
    description: "A considered recording and production home for artists, songs, and stories from Juba and beyond.",
    image: "/images/studio-recording.jpg",
    imageAlt: "Microphone ready for a recording session in a dark studio",
    imageSize: "cover",
    href: "/services",
    action: "Explore studio services",
  },
  {
    eyebrow: "Photography · Film · Story",
    title: <>Keep the moment.<br />Tell the <em>story.</em></>,
    description: "Portraits, music films, and event coverage made with intention and a local point of view.",
    image: "/images/juba-live-event.jpg",
    imageAlt: "Crowd gathered together at a live music event",
    imageSize: "cover",
    href: "/portfolio",
    action: "See selected work",
  },
];

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const next = useCallback(() => setActive((index) => (index + 1) % slides.length), []);
  const previous = useCallback(
    () => setActive((index) => (index - 1 + slides.length) % slides.length),
    [],
  );

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (paused || reducedMotion.matches) return;
    const timer = window.setInterval(next, 7000);
    return () => window.clearInterval(timer);
  }, [next, paused]);

  const slide = slides[active];

  return (
    <section
      aria-label="Studio highlights"
      aria-roledescription="carousel"
      className="relative isolate overflow-hidden bg-[#171713] text-[#eeeae2]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_72%_40%,rgba(198,165,107,.24),transparent_44%)]" />
      <div className="mx-auto grid min-h-[min(760px,calc(100svh-76px))] max-w-[1500px] items-center gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-16 lg:px-12">
        <div className="relative z-10 order-2 lg:order-1">
          <p className="flex items-center gap-3 text-[9px] uppercase tracking-[0.26em] text-[#c5a36d] sm:text-[10px]">
            <span className="h-px w-8 bg-[#c5a36d]" />
            {slide.eyebrow}
          </p>
          <h1 className="editorial-heading mt-7 text-[clamp(3.2rem,8vw,7.8rem)] leading-[0.82] tracking-[-0.075em]">
            {slide.title}
          </h1>
          <p className="mt-7 max-w-lg text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
            {slide.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href={slide.href} className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#c5a36d] px-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#171713] transition hover:bg-[#eeeae2]">
              {slide.action}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/booking" className="text-[10px] uppercase tracking-[0.16em] text-white/70 underline decoration-white/30 underline-offset-4 transition hover:text-white">
              Start a project
            </Link>
          </div>
          <div className="mt-12 flex items-center gap-4">
            <button type="button" onClick={previous} aria-label="Previous slide" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 transition hover:border-[#c5a36d] hover:text-[#c5a36d]">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2" role="group" aria-label="Choose a slide">
              {slides.map((item, index) => (
                <button
                  type="button"
                  key={item.eyebrow}
                  onClick={() => setActive(index)}
                  aria-label={`Show slide ${index + 1}: ${item.eyebrow}`}
                  aria-current={index === active}
                  className={`h-1.5 rounded-full transition-all ${index === active ? "w-9 bg-[#c5a36d]" : "w-4 bg-white/35 hover:bg-white/70"}`}
                />
              ))}
            </div>
            <button type="button" onClick={next} aria-label="Next slide" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 transition hover:border-[#c5a36d] hover:text-[#c5a36d]">
              <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Play slides" : "Pause slides"} className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:text-white">
              {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
            <span className="ml-auto hidden items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/45 sm:flex">
              <ArrowDown className="h-3.5 w-3.5" /> Scroll to explore
            </span>
          </div>
        </div>

        <div className="relative order-1 h-[min(58svh,440px)] min-h-[260px] overflow-hidden rounded-[1.4rem] border border-white/15 bg-[#292821] lg:order-2 lg:h-[min(72svh,610px)]">
          {slides.map((item, index) => (
            <div
              key={item.eyebrow}
              role="img"
              aria-label={item.imageAlt}
              className={`hero-slider-visual absolute inset-0 bg-center bg-no-repeat transition-opacity duration-700 ${index === active ? "opacity-100" : "pointer-events-none opacity-0"}`}
              style={{ backgroundImage: `url("${item.image}")`, backgroundSize: item.imageSize }}
              aria-hidden={index !== active}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/5" />
            </div>
          ))}
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
            <span className="max-w-[72%] text-[9px] uppercase leading-5 tracking-[0.16em] text-white/80">
              Inspired by the stories, people, and culture of South Sudan
            </span>
            <a href="https://www.facebook.com/profile.php?id=61585510990428&sk=photos" target="_blank" rel="noopener noreferrer" className="text-[8px] uppercase tracking-[0.14em] text-white/70 underline underline-offset-4 hover:text-white">
              Festival page
            </a>
          </div>
          <span className="absolute right-5 top-5 rounded-full border border-white/25 bg-black/15 px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] text-white backdrop-blur">
            0{active + 1} / 0{slides.length}
          </span>
        </div>
      </div>
    </section>
  );
}
