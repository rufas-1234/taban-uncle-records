import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { issueSignedToken } from "@vercel/blob";
import { handleUploadPresigned, type HandleUploadPresignedBody } from "@vercel/blob/client";

import { adminJson, requireAdminApi } from "@/lib/admin-api";
import { isSameOriginRequest } from "@/lib/admin-auth";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const allowedContentTypes = ["image/jpeg", "image/png", "image/webp"];
const allowedTypes = new Map([
  ["image/jpeg", { extension: "jpg", signature: (bytes: Buffer) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff }],
  ["image/png", { extension: "png", signature: (bytes: Buffer) => bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) }],
  ["image/webp", { extension: "webp", signature: (bytes: Buffer) => bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP" }],
]);

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return adminJson({ error: "Request origin was not accepted." }, 403);
  }

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  if (request.headers.get("content-type")?.includes("application/json")) {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      return adminJson({ error: "Connect a Vercel Blob store before uploading images." }, 503);
    }

    try {
      const body = await request.json() as HandleUploadPresignedBody;
      const result = await handleUploadPresigned({
        body,
        request,
        getSignedToken: async (pathname) => {
          if (!/^uploads\/[a-zA-Z0-9._-]+\.(jpg|png|webp)$/.test(pathname)) {
            throw new Error("Invalid upload path.");
          }

          const validUntil = Date.now() + 10 * 60 * 1000;
          const token = await issueSignedToken({
            pathname,
            operations: ["put"],
            allowedContentTypes,
            maximumSizeInBytes: MAX_IMAGE_BYTES,
            validUntil,
            token: blobToken,
          });

          return {
            token,
            urlOptions: {
              allowedContentTypes,
              maximumSizeInBytes: MAX_IMAGE_BYTES,
              addRandomSuffix: true,
              allowOverwrite: false,
              validUntil,
            },
          };
        },
      });

      return adminJson(result);
    } catch (error) {
      console.error("Admin image upload authorization failed.", error);
      return adminJson({ error: "Image upload could not be authorized." }, 503);
    }
  }

  if (process.env.NODE_ENV === "production") {
    return adminJson({ error: "Production image uploads must use Vercel Blob." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_BYTES + 64 * 1024) {
    return adminJson({ error: "Images must be smaller than 5 MB." }, 413);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return adminJson({ error: "Choose an image file to upload." }, 400);
  }

  const file = formData.get("image");
  if (!(file instanceof File)) {
    return adminJson({ error: "Choose an image file to upload." }, 400);
  }
  if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
    return adminJson({ error: "Images must be smaller than 5 MB." }, 400);
  }

  const imageType = allowedTypes.get(file.type);
  if (!imageType) {
    return adminJson({ error: "Use a JPEG, PNG, or WebP image." }, 415);
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    if (!imageType.signature(bytes)) {
      return adminJson({ error: "The image file does not match its file type." }, 400);
    }

    const filename = `${randomUUID()}.${imageType.extension}`;
    const uploadDirectory = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(path.join(uploadDirectory, filename), bytes, { flag: "wx" });

    return adminJson({ imageUrl: `/uploads/${filename}` }, 201);
  } catch (error) {
    console.error("Admin image upload could not be completed.", error);
    return adminJson({ error: "Image upload is temporarily unavailable." }, 503);
  }
}
