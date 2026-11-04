import Link from "next/link";
import { ArrowUpRight, Camera, Video } from "lucide-react";

import { FullFrameImage } from "@/components/full-frame-image";
import { getPublicPortfolio, type PublicPortfolioProject } from "@/lib/creative-content";

export const instant = false;

function CollectionGrid({
  title,
  eyebrow,
  description,
  projects,
  icon: Icon,
}: {
  title: string;
  eyebrow: string;
  description: string;
  projects: PublicPortfolioProject[];
  icon: typeof Camera;
}) {
  return (
    <section className="mt-20">
      <div className="mb-8 grid gap-5 border-b border-[#171713]/20 pb-6 sm:grid-cols-[1fr_0.7fr] sm:items-end">
        <div>
          <p className="editorial-eyebrow">{eyebrow}</p>
          <h2 className="editorial-section-title mt-3">{title}</h2>
        </div>
        <p className="max-w-lg text-sm leading-7 text-[#171713]/65">{description}</p>
      </div>
      {projects.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <article key={project.id} className="group">
              <Link href="/booking" className="block">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#d9d0c0]">
                  <FullFrameImage
                    src={project.imageUrl}
                    alt={`${project.title} — ${project.category}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="transition duration-700 group-hover:scale-[1.01]"
                  />
                  <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#eeeae2]/90 text-[#80643a]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/65 bg-black/10 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="editorial-eyebrow">{project.category}</p>
                  <h3 className="editorial-heading mt-2 text-2xl">{project.title}</h3>
                </div>
                <span className="editorial-heading pt-1 text-lg text-[#80643a]">0{index + 1}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#171713]/65">{project.description}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="border-b border-[#171713]/15 py-6 text-sm text-[#171713]/55">
          New {title.toLowerCase()} are being prepared. Check back soon.
        </p>
      )}
    </section>
  );
}

export default async function CollectionsPage() {
  const portfolio = await getPublicPortfolio();
  const photography = portfolio.filter((project) => project.type === "PHOTOGRAPHY");
  const videography = portfolio.filter((project) => project.type === "VIDEOGRAPHY");

  return (
    <div className="editorial-page">
      <div className="editorial-page-inner">
        <section className="editorial-page-hero">
          <p className="editorial-eyebrow">Taban Uncle · Visual stories</p>
          <h1 className="editorial-page-title max-w-5xl">
            Frames that hold a feeling. <em>Stories that move.</em>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#171713]/70">
            Explore selected photography and videography collections from the studio—portraits, gatherings,
            performances, and moments from South Sudan.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#photography" className="editorial-button-outline"><Camera className="h-4 w-4" /> Photography</a>
            <a href="#videography" className="editorial-button-outline"><Video className="h-4 w-4" /> Videography</a>
          </div>
        </section>

        <div id="photography" className="scroll-mt-24">
          <CollectionGrid
            title="Photography"
            eyebrow="Still images · Portraits, places & people"
            description="Portraits, event coverage, and visual collections made with care for the people and places in every frame."
            projects={photography}
            icon={Camera}
          />
        </div>
        <div id="videography" className="scroll-mt-24">
          <CollectionGrid
            title="Videography"
            eyebrow="Moving images · Music, events & stories"
            description="Music videos, live moments, and documentary-style stories shaped from first frame to final cut."
            projects={videography}
            icon={Video}
          />
        </div>

        <section className="mt-20 flex flex-col gap-5 border-y border-[#171713]/20 py-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="editorial-eyebrow">Have a story in mind?</p>
            <h2 className="editorial-section-title mt-3">Let’s make something worth keeping.</h2>
          </div>
          <Link href="/booking" className="editorial-button-dark">Book a visual session <ArrowUpRight className="h-4 w-4" /></Link>
        </section>
      </div>
    </div>
  );
}
