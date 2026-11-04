"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";

import { navItems } from "@/lib/site-data";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 text-[#171713] sm:px-6">
      <div className="mx-auto max-w-7xl rounded-2xl border border-[#171713]/10 bg-[#eeeae2]/35 p-2 shadow-lg shadow-black/5 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4 px-2 py-1">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#171713]/30 bg-[#171713]/5 text-[#80643a]">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="block whitespace-nowrap text-xs uppercase tracking-[0.2em] text-[#80643a]">
            Taban Uncle Records
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[#171713]/75 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[#80643a]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/booking"
            className="rounded-full bg-[#171713] px-5 py-2.5 text-sm font-medium text-[#eeeae2] transition hover:bg-[#80643a]"
          >
            Book a Session
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center rounded-full border border-[#171713]/20 p-2 transition hover:border-[#80643a] hover:text-[#80643a] lg:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <nav id="mobile-navigation" className="mt-2 border-t border-[#171713]/10 px-2 pt-2 lg:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm text-[#171713]/80 transition hover:bg-black/5 hover:text-[#80643a]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/booking"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 rounded-full bg-[#171713] px-5 py-3 text-center text-sm font-semibold text-[#eeeae2] transition hover:bg-[#80643a]"
            >
              Book a Session
            </Link>
          </div>
        </nav>
      )}
      </div>
    </header>
  );
}
