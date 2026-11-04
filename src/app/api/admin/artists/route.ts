import { randomUUID } from "node:crypto";

import { adminJson, isPrismaError, requireAdminApi, validateJson } from "@/lib/admin-api";
import { isSameOriginRequest } from "@/lib/admin-auth";
import { artistSchema } from "@/lib/admin-validation";
import { getPrismaClient } from "@/lib/prisma";

function createSlug(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || `artist-${randomUUID()}`;
}

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const artists = await getPrismaClient().featuredArtist.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { media: true } } },
    });

    return adminJson({ data: artists });
  } catch (error) {
    console.error("Admin artist list could not be loaded.", error);
    return adminJson({ error: "Artist records are temporarily unavailable." }, 503);
  }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return adminJson({ error: "Request origin was not accepted." }, 403);
  }

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const parsed = await validateJson(request, artistSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const artist = await getPrismaClient().featuredArtist.create({
      data: { ...parsed.data, slug: createSlug(parsed.data.name) },
    });

    return adminJson({ data: artist }, 201);
  } catch (error) {
    if (isPrismaError(error, "P2002")) {
      return adminJson({ error: "An artist with this name already exists." }, 409);
    }

    console.error("Admin artist could not be created.", error);
    return adminJson({ error: "Artist could not be saved right now." }, 503);
  }
}
