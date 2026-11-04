import { ArrowRight, BarChart3, BriefcaseBusiness, CalendarClock, FolderKanban } from "lucide-react";
import Link from "next/link";

const overviewCards = [
  { label: "Open enquiries", value: "18", detail: "Across recording and content work" },
  { label: "Active projects", value: "06", detail: "In production or review" },
  { label: "Upcoming sessions", value: "03", detail: "Booked this month" },
  { label: "Revenue pipeline", value: "$12.4k", detail: "Estimated client value" },
];

const workflowItems = [
  "Client intake and onboarding",
  "Project scoping and deliverables",
  "Creative production milestones",
  "Invoicing and follow-up tracking",
];

export default function DashboardPage() {
  return (
    <div className="editorial-page">
      <div className="editorial-page-inner">
        <section className="editorial-page-hero">
          <div className="flex flex-wrap items-center gap-3">
            <p className="editorial-eyebrow">Studio dashboard · Concept preview</p>
            <span className="rounded-full border border-[#80643a]/35 px-3 py-1 text-[9px] uppercase tracking-[0.18em] text-[#80643a]">Sample data</span>
          </div>
          <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="editorial-page-title mt-0">Operations <em>overview.</em></h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#171713]/60">
                This concept preview uses illustrative figures and is not connected to studio or client records.
              </p>
            </div>
            <Link href="/booking" className="editorial-button-dark">
              New enquiry <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="grid border-b border-[#171713]/20 sm:grid-cols-2 lg:grid-cols-4">
          {overviewCards.map((card, index) => (
            <article key={card.label} className={`py-5 ${index % 2 === 0 ? "sm:border-r" : ""} border-[#171713]/15 lg:border-r lg:px-5 lg:first:pl-0 lg:last:border-r-0`}>
              <p className="editorial-eyebrow">{card.label}</p>
              <p className="editorial-heading mt-4 text-4xl">{card.value}</p>
              <p className="mt-2 text-xs text-[#171713]/55">{card.detail}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3 border-b border-[#171713]/20 pb-4">
              <BarChart3 className="h-4 w-4 text-[#80643a]" />
              <p className="editorial-eyebrow">Pipeline snapshot · Sample</p>
            </div>
            <div className="mt-7 space-y-6">
              {[
                { name: "Brand campaigns", value: 72 },
                { name: "Artist projects", value: 64 },
                { name: "Events & coverage", value: 48 },
              ].map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-[#171713]/55">{item.value}%</span>
                  </div>
                  <div className="h-px bg-[#171713]/15">
                    <div className="h-px bg-[#80643a]" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 border-b border-[#171713]/20 pb-4">
              <FolderKanban className="h-4 w-4 text-[#80643a]" />
              <p className="editorial-eyebrow">Core workflow</p>
            </div>
            <ol className="divide-y divide-[#171713]/15">
              {workflowItems.map((item, index) => (
                <li key={item} className="flex items-center gap-4 py-4">
                  <span className="editorial-heading text-xl text-[#80643a]">0{index + 1}</span>
                  <span className="text-sm text-[#171713]/75">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-14 grid gap-6 border-t border-[#171713]/20 pt-6 md:grid-cols-3">
          {[
            { title: "Booking overview", description: "Track client leads, project scope, and studio availability.", icon: CalendarClock },
            { title: "Client projects", description: "Organize deliverables, files, and production milestones.", icon: BriefcaseBusiness },
            { title: "Reporting", description: "Surface studio metrics and planning signals.", icon: BarChart3 },
          ].map(({ title, description, icon: Icon }) => (
            <article key={title}>
              <Icon className="h-4 w-4 text-[#80643a]" />
              <h2 className="editorial-heading mt-4 text-2xl">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#171713]/60">{description}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
