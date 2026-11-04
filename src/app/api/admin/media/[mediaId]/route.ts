import { adminJson, isPrismaError, requireAdminApi, validateJson } from "@/lib/admin-api";
import { isSameOriginRequest } from "@/lib/admin-auth";
import { mediaSchema } from "@/lib/admin-validation";
import { getPrismaClient } from "@/lib/prisma";

type MediaRouteContext = {
  params: Promise<{ mediaId: string }>;
};

export async function PATCH(request: Request, { params }: MediaRouteContext) {
  if (!isSameOriginRequest(request)) {
    return adminJson({ error: "Request origin was not accepted." }, 403);
  }

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const parsed = await validateJson(request, mediaSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const { mediaId } = await params;
    const media = await getPrismaClient().featuredMedia.update({
      where: { id: mediaId },
      data: parsed.data,
      include: { artist: { select: { id: true, name: true } } },
    });

    return adminJson({ data: media });
  } catch (error) {
    if (isPrismaError(error, "P2025")) {
      return adminJson({ error: "Culture media record was not found." }, 404);
    }
    if (isPrismaError(error, "P2002")) {
      return adminJson({ error: "This YouTube video is already in the culture archive." }, 409);
    }
    if (isPrismaError(error, "P2003")) {
      return adminJson({ error: "Choose an artist profile that still exists." }, 400);
    }

    console.error("Admin culture media could not be updated.", error);
    return adminJson({ error: "Culture media could not be saved right now." }, 503);
  }
}

export async function DELETE(request: Request, { params }: MediaRouteContext) {
  if (!isSameOriginRequest(request)) {
    return adminJson({ error: "Request origin was not accepted." }, 403);
  }

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const { mediaId } = await params;
    await getPrismaClient().featuredMedia.delete({ where: { id: mediaId } });
    return adminJson({ ok: true });
  } catch (error) {
    if (isPrismaError(error, "P2025")) {
      return adminJson({ error: "Culture media record was not found." }, 404);
    }

    console.error("Admin culture media could not be deleted.", error);
    return adminJson({ error: "Culture media could not be deleted right now." }, 503);
  }
}
