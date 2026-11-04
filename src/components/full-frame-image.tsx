"use client";

import Image from "next/image";

export function FullFrameImage({
  src,
  alt,
  sizes = "100vw",
  className = "",
  onError,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  onError?: () => void;
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden bg-[#d9d0c0] ${className}`}>
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        unoptimized
        aria-hidden="true"
        className="scale-110 object-cover blur-xl opacity-45"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/10" />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized
        className="object-contain"
        onError={onError}
      />
    </div>
  );
}
