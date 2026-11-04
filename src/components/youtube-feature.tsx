"use client";

import { useState } from "react";
import { ArrowUpRight, Music2, Play } from "lucide-react";

import { FullFrameImage } from "@/components/full-frame-image";
import type { CultureMediaRecord } from "@/lib/culture-seed";
import { getYouTubeVideoId } from "@/lib/youtube";

const mediaLabels: Record<CultureMediaRecord["mediaType"], string> = {
  SONG: "Song",
  MUSIC_COLLECTION: "Music collection",
  PERFORMANCE: "Traditional performance",
  CULTURE_STORY: "Culture story",
};

export function YouTubeFeature({ media }: { media: CultureMediaRecord }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const videoId = getYouTubeVideoId(media.youtubeUrl ?? "");
  const thumbnailUrl = videoId ? media.imageUrl ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;

  return (
    <article className="overflow-hidden border border-white/15 bg-[#201f1b]">
      <div className="relative aspect-video bg-[#302e27]">
        {videoId && isPlaying ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
            title={media.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : videoId && thumbnailFailed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-5 text-center text-sm text-white/75">
            <p>Video thumbnail unavailable.</p>
            <button type="button" onClick={() => setIsPlaying(true)} className="inline-flex items-center gap-2 text-[#c5a36d]">
              <Play className="h-4 w-4" /> Play video
            </button>
          </div>
        ) : videoId && thumbnailUrl ? (
          <>
            <FullFrameImage src={thumbnailUrl} alt={`${media.title} video thumbnail`} sizes="(max-width: 768px) 100vw, 50vw" onError={() => setThumbnailFailed(true)} />
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/20 text-white transition hover:bg-black/35"
              aria-label={`Play ${media.title}`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/75 bg-black/30 backdrop-blur">
                <Play className="ml-1 h-5 w-5 fill-current" />
              </span>
            </button>
          </>
        ) : media.imageUrl ? (
          <FullFrameImage src={media.imageUrl} alt={`${media.title} cover image`} sizes="(max-width: 768px) 100vw, 50vw" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#292821] text-[#c5a36d]">
            <Music2 className="h-8 w-8" />
            <span className="text-[9px] uppercase tracking-[0.2em]">{mediaLabels[media.mediaType]}</span>
          </div>
        )}
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#c5a36d]">
            {media.culture} · {mediaLabels[media.mediaType]}
          </span>
          <span className="text-[9px] uppercase tracking-[0.16em] text-white/45">
            {media.artist?.name ?? media.sourceName ?? "Community feature"}
          </span>
        </div>
        <h3 className="editorial-heading mt-3 text-2xl leading-tight text-[#eeeae2] sm:text-3xl">
          {media.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-[#eeeae2]/65">{media.description}</p>
        {media.youtubeUrl && (
          <a
            href={media.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-[#c5a36d] transition hover:text-[#eeeae2]"
          >
            View original on YouTube <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
