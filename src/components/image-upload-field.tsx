"use client";

import { useState } from "react";
import { uploadPresigned } from "@vercel/blob/client";
import { Upload, X } from "lucide-react";
import { FullFrameImage } from "@/components/full-frame-image";

const maxImageBytes = 5 * 1024 * 1024;
const imageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function validateImage(file: File) {
  if (file.size === 0 || file.size > maxImageBytes) {
    throw new Error("Images must be smaller than 5 MB.");
  }

  const extension = imageExtensions[file.type];
  if (!extension) {
    throw new Error("Use a JPEG, PNG, or WebP image.");
  }

  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const valid = file.type === "image/jpeg"
    ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    : file.type === "image/png"
      ? bytes.subarray(0, 8).join(",") === "137,80,78,71,13,10,26,10"
      : String.fromCharCode(...bytes.subarray(0, 4)) === "RIFF"
        && String.fromCharCode(...bytes.subarray(8, 12)) === "WEBP";

  if (!valid) {
    throw new Error("The image file does not match its file type.");
  }

  return extension;
}

function ImagePreview({ imageUrl }: { imageUrl: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div role="status" className="flex h-28 w-28 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-red-900/20 bg-red-950/5 px-2 text-center text-[10px] text-red-900">
        <span>Image preview unavailable.</span>
        <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="underline">Open image</a>
      </div>
    );
  }

  return (
    <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-[#171713]/15 bg-[#d9d0c0]">
      <FullFrameImage key={imageUrl} src={imageUrl} alt="Image preview" className="rounded-xl" onError={() => setFailed(true)} />
    </div>
  );
}

type ImageUploadFieldProps = {
  label: string;
  imageUrl: string;
  onChange: (imageUrl: string) => void;
};

export function ImageUploadField({ label, imageUrl, onChange }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File | undefined) {
    if (!file) return;
    setError("");
    setUploading(true);

    try {
      const extension = await validateImage(file);
      if (process.env.NODE_ENV === "production") {
        const blob = await uploadPresigned(
          `uploads/${crypto.randomUUID()}.${extension}`,
          file,
          {
            access: "public",
            handleUploadUrl: "/api/admin/images",
            multipart: file.size > 4.5 * 1024 * 1024,
          },
        );
        onChange(blob.url);
        return;
      }

      const formData = new FormData();
      formData.set("image", file);
      const response = await fetch("/api/admin/images", {
        method: "POST",
        body: formData,
        cache: "no-store",
      });
      const result: unknown = await response.json();

      if (!response.ok || typeof result !== "object" || result === null || !("imageUrl" in result) || typeof result.imageUrl !== "string") {
        const message =
          typeof result === "object" && result !== null && "error" in result && typeof result.error === "string"
            ? result.error
            : "The image could not be uploaded.";
        throw new Error(message);
      }

      onChange(result.imageUrl);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "The image could not be uploaded.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">
        {label}
        <input
          type="url"
          value={imageUrl.startsWith("/uploads/") ? "" : imageUrl}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Paste an HTTPS image link or upload a file"
          className="editorial-input mt-1"
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-full border border-[#171713]/20 px-4 py-2 text-[9px] uppercase tracking-[0.12em] text-[#171713]/75 transition hover:border-[#80643a] hover:text-[#80643a]">
          <Upload className="h-3.5 w-3.5" />
          {uploading ? "Uploading…" : "Upload image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={uploading}
            onChange={(event) => {
              void upload(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
        <span className="text-[9px] text-[#171713]/50">JPEG, PNG or WebP · up to 5 MB</span>
        {imageUrl && (
          <button type="button" onClick={() => onChange("")} className="inline-flex items-center gap-1 text-[9px] text-red-800">
            <X className="h-3 w-3" /> Remove
          </button>
        )}
      </div>
      {imageUrl && (
        <ImagePreview key={imageUrl} imageUrl={imageUrl} />
      )}
      {error && <p role="alert" className="text-xs text-red-800">{error}</p>}
    </div>
  );
}
