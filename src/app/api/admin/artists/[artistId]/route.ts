import { adminJson, isPrismaError, requireAdminApi, validateJson } from "@/lib/admin-api";
import { isSameOriginRequest } from "@/lib/admin-auth";
import { artistSchema } from "@/lib/admin-validation";
import { getPrismaClient } from "@/lib/prisma";

type ArtistRouteContext = {
  params: Promise<{ artistId: string }>;
};

export async function PATCH(request: Request, { params }: ArtistRouteContext) {
  if (!isSameOriginRequest(request)) {
    return adminJson({ error: "Request origin was not accepted." }, 403);
  }

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const parsed = await validateJson(request, artistSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const { artistId } = await params;
    const artist = await getPrismaClient().featuredArtist.update({
      where: { id: artistId },
      data: parsed.data,
    });

    return adminJson({ data: artist });
  } catch (error) {
    if (isPrismaError(error, "P2025")) {
      return adminJson({ error: "Artist was not found." }, 404);
    }
    if (isPrismaError(error, "P2002")) {
      return adminJson({ error: "An artist with this name already exists." }, 409);
    }

    console.error("Admin artist could not be updated.", error);
    return adminJson({ error: "Artist could not be saved right now." }, 503);
  }
}

export async function DELETE(request: Request, { params }: ArtistRouteContext) {
  if (!isSameOriginRequest(request)) {
    return adminJson({ error: "Request origin was not accepted." }, 403);
  }

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const { artistId } = await params;
    await getPrismaClient().featuredArtist.delete({ where: { id: artistId } });
    return adminJson({ ok: true });
  } catch (error) {
    if (isPrismaError(error, "P2025")) {
      return adminJson({ error: "Artist was not found." }, 404);
    }

    console.error("Admin artist could not be deleted.", error);
    return adminJson({ error: "Artist could not be deleted right now." }, 503);
  }
}
