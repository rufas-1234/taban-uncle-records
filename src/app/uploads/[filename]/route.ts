import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

const imageTypes: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

type UploadRouteContext = {
  params: Promise<{ filename: string }>;
};

export async function GET(_request: Request, { params }: UploadRouteContext) {
  const { filename } = await params;
  const match = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.(jpg|png|webp)$/i.exec(filename);
  if (!match) return new NextResponse(null, { status: 404 });

  try {
    const image = await readFile(path.join(process.cwd(), "public", "uploads", filename));
    return new NextResponse(new Uint8Array(image), {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": imageTypes[match[2].toLowerCase()],
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
      return new NextResponse(null, { status: 404 });
    }

    console.error("Uploaded image could not be served.", error);
    return new NextResponse(null, { status: 500 });
  }
}
