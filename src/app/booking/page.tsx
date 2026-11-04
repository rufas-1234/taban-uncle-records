import { ArrowDown, ArrowUpRight, Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { BookingForm } from "@/components/booking-form";
import { EditorialPage } from "@/components/editorial-page";
import { formatPhoneNumber } from "@/lib/contact-details";

export default function BookingPage() {
  const email = process.env.NEXT_PUBLIC_BOOKING_EMAIL;
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const whatsappLinkNumber = whatsappNumber.replace(/\D/g, "");
  const callNumber = process.env.NEXT_PUBLIC_CALL_NUMBER ?? whatsappNumber;
  const callLinkNumber = callNumber.replace(/[^\d+]/g, "");
  const bookingMessage = encodeURIComponent("Hello Taban Uncle Records, I would like to ask about booking a project.");

  return (
    <EditorialPage
      eyebrow="Booking · Start a conversation"
      title={<>Every good project starts with a <em>brief.</em></>}
      description="Send a booking request through the form, or contact the studio directly by WhatsApp, email, or phone."
    >
      <section aria-label="Contact the studio directly" className="mt-8 grid gap-3 sm:grid-cols-3">
        {whatsappLinkNumber && (
          <a href={`https://wa.me/${whatsappLinkNumber}?text=${bookingMessage}`} target="_blank" rel="noopener noreferrer" className="flex min-h-24 flex-col justify-between gap-3 border border-[#171713]/25 px-5 py-4 transition hover:border-[#80643a] hover:text-[#80643a]">
            <span className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.14em]"><span className="flex items-center gap-3"><MessageCircle className="h-4 w-4" /> WhatsApp booking</span><ArrowUpRight className="h-4 w-4 shrink-0" /></span>
            <span className="pl-7 text-sm font-medium tracking-normal">{formatPhoneNumber(whatsappNumber)}</span>
          </a>
        )}
        {email && (
          <a href={`mailto:${email}?subject=${encodeURIComponent("Studio booking enquiry")}`} className="flex min-h-24 flex-col justify-between gap-3 border border-[#171713]/25 px-5 py-4 transition hover:border-[#80643a] hover:text-[#80643a]">
            <span className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.14em]"><span className="flex items-center gap-3"><Mail className="h-4 w-4" /> Booking email</span><ArrowUpRight className="h-4 w-4 shrink-0" /></span>
            <span className="break-all pl-7 text-sm font-medium lowercase tracking-normal">{email}</span>
          </a>
        )}
        {callLinkNumber && (
          <a href={`tel:${callLinkNumber}`} className="flex min-h-24 flex-col justify-between gap-3 border border-[#171713]/25 px-5 py-4 transition hover:border-[#80643a] hover:text-[#80643a]">
            <span className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.14em]"><span className="flex items-center gap-3"><Phone className="h-4 w-4" /> Call the studio</span><ArrowUpRight className="h-4 w-4 shrink-0" /></span>
            <span className="pl-7 text-sm font-medium tracking-normal">{formatPhoneNumber(callNumber)}</span>
          </a>
        )}
      </section>
      <p className="mt-5 text-xs uppercase tracking-[0.14em] text-[#171713]/50">Or send a booking request using the form below</p>
      <section className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.32fr]">
        <BookingForm />
        <aside className="space-y-6 lg:pt-8">
          <div className="border-t border-[#171713]/20 pt-4">
            <Clock3 className="h-4 w-4 text-[#80643a]" />
            <p className="editorial-eyebrow mt-3">Response time</p>
            <p className="mt-2 text-sm leading-6 text-[#171713]/70">We aim to reply within 1-2 business days.</p>
          </div>
          <div className="border-t border-[#171713]/20 pt-4">
            <MapPin className="h-4 w-4 text-[#80643a]" />
            <p className="editorial-eyebrow mt-3">Based in</p>
            <p className="mt-2 text-sm leading-6 text-[#171713]/70">Juba, South Sudan<br />Working everywhere.</p>
          </div>
          <div className="border-t border-[#171713]/20 pt-4">
            <ArrowDown className="h-4 w-4 text-[#80643a]" />
            <p className="editorial-eyebrow mt-3">Good to know</p>
            <p className="mt-2 text-sm leading-6 text-[#171713]/70">Sharing a rough timeline and any references helps us prepare for the first conversation.</p>
          </div>
        </aside>
      </section>
    </EditorialPage>
  );
}
