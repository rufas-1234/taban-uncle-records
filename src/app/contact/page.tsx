import { ArrowRight, ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { EditorialPage } from "@/components/editorial-page";
import { formatPhoneNumber } from "@/lib/contact-details";

export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_BOOKING_EMAIL;
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const whatsappLinkNumber = whatsappNumber.replace(/\D/g, "");
  const callNumber = process.env.NEXT_PUBLIC_CALL_NUMBER ?? whatsappNumber;
  const callLinkNumber = callNumber.replace(/[^\d+]/g, "");

  return (
    <EditorialPage
      eyebrow="Contact · Juba, South Sudan"
      title={<>Good things begin with a <em>hello.</em></>}
      description="Have a project in mind, want to collaborate, or just need to ask a question? We’re listening."
    >
      <section className="mt-12 grid gap-12 md:grid-cols-[1fr_0.7fr]">
        <div className="space-y-8">
          {email && <div className="border-t border-[#171713]/20 pt-5">
            <div className="flex items-center gap-3 text-[#80643a]">
              <Mail className="h-4 w-4" />
              <p className="editorial-eyebrow">Email</p>
            </div>
            <a href={`mailto:${email}`} className="editorial-heading mt-3 inline-block text-2xl transition hover:text-[#80643a] sm:text-3xl">
              {email}
            </a>
          </div>}
          {whatsappLinkNumber && <div className="border-t border-[#171713]/20 pt-5">
            <div className="flex items-center gap-3 text-[#80643a]">
              <MessageCircle className="h-4 w-4" />
              <p className="editorial-eyebrow">WhatsApp booking</p>
            </div>
            <a href={`https://wa.me/${whatsappLinkNumber}`} target="_blank" rel="noopener noreferrer" className="editorial-heading mt-3 inline-flex flex-wrap items-center gap-2 text-2xl transition hover:text-[#80643a] sm:text-3xl">
              {formatPhoneNumber(whatsappNumber)} <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>}
          {callLinkNumber && <div className="border-t border-[#171713]/20 pt-5">
            <div className="flex items-center gap-3 text-[#80643a]">
              <Phone className="h-4 w-4" />
              <p className="editorial-eyebrow">Call the studio</p>
            </div>
            <a href={`tel:${callLinkNumber}`} className="editorial-heading mt-3 inline-block text-2xl transition hover:text-[#80643a] sm:text-3xl">
              {formatPhoneNumber(callNumber)}
            </a>
          </div>}
          <div className="border-t border-[#171713]/20 pt-5">
            <div className="flex items-center gap-3 text-[#80643a]">
              <MapPin className="h-4 w-4" />
              <p className="editorial-eyebrow">Studio</p>
            </div>
            <p className="editorial-heading mt-3 text-2xl sm:text-3xl">Juba, South Sudan</p>
            <p className="mt-2 text-sm text-[#171713]/60">Working with people and ideas everywhere.</p>
          </div>
        </div>

        <aside className="border-y border-[#171713]/20 py-6">
          <p className="editorial-eyebrow">The first conversation</p>
          <h2 className="editorial-section-title mt-3 text-4xl">No big pitch needed.</h2>
          <p className="mt-4 text-sm leading-7 text-[#171713]/65">
            A rough idea, a date, or a few questions are enough to get started. We’ll help shape the rest together.
          </p>
          <Link href="/booking" className="editorial-button-dark mt-6">
            Share a project brief <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </section>
    </EditorialPage>
  );
}
