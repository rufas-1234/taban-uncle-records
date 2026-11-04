"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";

import { getYouTubeVideoId } from "@/lib/youtube";

export function YouTubeVideoPreview({
  url,
  title,
  coverImageUrl,
}: {
  url: string;
  title: string;
  coverImageUrl?: string;
}) {
  const [playingVideoId, setPlayingVideoId] = useState("");
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const videoId = getYouTubeVideoId(url);

  if (!url) {
    return <p className="text-xs text-[#171713]/50">YouTube link optional. Add one to show a video preview.</p>;
  }

  if (!videoId) {
    return <p role="status" className="text-xs text-red-800">Enter a valid public YouTube video link to preview it.</p>;
  }

  const thumbnailUrl = coverImageUrl || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="max-w-xl overflow-hidden border border-[#171713]/15 bg-[#171713]">
      <div className="relative aspect-video">
        {playingVideoId === videoId ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
            title={`${title || "YouTube video"} preview`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : thumbnailFailed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center text-sm text-white/75">
            <p>Thumbnail unavailable. You can still open or play the linked video.</p>
            <button type="button" onClick={() => setPlayingVideoId(videoId)} className="inline-flex items-center gap-2 text-[#c5a36d]">
              <Play className="h-4 w-4" /> Play preview
            </button>
          </div>
        ) : (
          <>
            <Image
              key={thumbnailUrl}
              src={thumbnailUrl}
              alt={`${title || "YouTube video"} thumbnail`}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 560px"
              className="object-cover"
              onError={() => setThumbnailFailed(true)}
            />
            <button
              type="button"
              onClick={() => setPlayingVideoId(videoId)}
              className="absolute inset-0 flex items-center justify-center bg-black/20 text-white transition hover:bg-black/35"
              aria-label={`Play preview${title ? ` of ${title}` : ""}`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/75 bg-black/30 backdrop-blur">
                <Play className="ml-1 h-5 w-5 fill-current" />
              </span>
            </button>
          </>
        )}
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-2 text-[9px] uppercase tracking-[0.14em] text-[#c5a36d]">
        Open video on YouTube <ArrowUpRight className="h-3 w-3" />
      </a>
    </div>
  );
}
