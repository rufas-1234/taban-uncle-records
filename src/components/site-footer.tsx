"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  Mail,
  MapPin,
  Music2,
  Phone,
  Sparkles,
  Video,
} from "lucide-react";
import { formatPhoneNumber } from "@/lib/contact-details";

export function SiteFooter() {
  const bookingEmail = process.env.NEXT_PUBLIC_BOOKING_EMAIL;
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const whatsappLinkNumber = whatsappNumber.replace(/\D/g, "");
  const callNumber = process.env.NEXT_PUBLIC_CALL_NUMBER ?? whatsappNumber;
  const callLinkNumber = callNumber.replace(/[^\d+]/g, "");

  const socialLinks = [
    { label: "TikTok", href: "https://www.tiktok.com/@tabanuncle", Icon: Music2 },
    { label: "Facebook", href: "https://www.facebook.com/taban.sam.7", Icon: Sparkles },
    { label: "Instagram", href: "https://www.instagram.com", Icon: Camera },
    { label: "YouTube", href: "https://www.youtube.com", Icon: Video },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#171713] text-[#eeeae2]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(128,100,58,0.22),transparent_38%)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 border-b border-white/10 py-10 sm:flex-row sm:items-end sm:justify-between sm:py-12">
          <div className="max-w-2xl">
            <p className="text-[9px] uppercase tracking-[0.24em] text-[#c5a36d]">Bring your next idea to life</p>
            <h2 className="editorial-heading mt-3 text-3xl leading-tight sm:text-4xl">
              Let’s make something <em className="text-[#c5a36d]">meaningful.</em>
            </h2>
          </div>
          <Link
            href="/booking"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-[#c5a36d] px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#171713] transition hover:bg-[#eeeae2]"
          >
            Book a session <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.9fr_1fr] lg:gap-12 lg:py-14">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c5a36d]/45 bg-[#c5a36d]/10 text-[#c5a36d]">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-[#eeeae2]">Taban Uncle Records</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#eeeae2]/60">
              Cultural music, recording, photography, and stories from South Sudan — made with care in Juba and beyond.
            </p>
            <div className="mt-6 flex gap-2.5">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[#c5a36d] transition hover:border-[#c5a36d]/70 hover:bg-[#c5a36d]/10 hover:text-[#eeeae2]"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[9px] uppercase tracking-[0.2em] text-[#c5a36d]">Discover</h3>
            <ul className="mt-5 space-y-3 text-sm text-[#eeeae2]/65">
              <li><Link className="transition hover:text-white" href="/about">Our story</Link></li>
              <li><Link className="transition hover:text-white" href="/artists">Artists & culture</Link></li>
              <li><Link className="transition hover:text-white" href="/news">News & insights</Link></li>
              <li><Link className="transition hover:text-white" href="/events">Events</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[9px] uppercase tracking-[0.2em] text-[#c5a36d]">Studio</h3>
            <ul className="mt-5 space-y-3 text-sm text-[#eeeae2]/65">
              <li><Link className="transition hover:text-white" href="/services">Services</Link></li>
              <li><Link className="transition hover:text-white" href="/pricing">Pricing</Link></li>
              <li><Link className="transition hover:text-white" href="/portfolio">Portfolio</Link></li>
              <li><Link className="transition hover:text-white" href="/collections">Visual collections</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[9px] uppercase tracking-[0.2em] text-[#c5a36d]">Talk to us</h3>
            <ul className="mt-5 space-y-4 text-sm text-[#eeeae2]/65">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a36d]" />
                <span>Juba, South Sudan</span>
              </li>
              {bookingEmail && (
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a36d]" />
                  <a className="break-all transition hover:text-white" href={`mailto:${bookingEmail}`}>{bookingEmail}</a>
                </li>
              )}
              {whatsappLinkNumber && (
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a36d]" />
                  <a className="transition hover:text-white" href={`https://wa.me/${whatsappLinkNumber}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp · {formatPhoneNumber(whatsappNumber)}
                  </a>
                </li>
              )}
              {callLinkNumber && (
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a36d]" />
                  <a className="transition hover:text-white" href={`tel:${callLinkNumber}`}>Call · {formatPhoneNumber(callNumber)}</a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-5 text-[9px] uppercase tracking-[0.16em] text-[#eeeae2]/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Taban Uncle Records · Juba, South Sudan</span>
          <Link href="/admin/login" className="w-fit transition hover:text-[#c5a36d]">Studio admin</Link>
        </div>
      </div>
    </footer>
  );
}
