import { adminJson, isPrismaError, requireAdminApi, validateJson } from "@/lib/admin-api";
import { isSameOriginRequest } from "@/lib/admin-auth";
import { mediaSchema } from "@/lib/admin-validation";
import { getPrismaClient } from "@/lib/prisma";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const media = await getPrismaClient().featuredMedia.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { artist: { select: { id: true, name: true } } },
    });

    return adminJson({ data: media });
  } catch (error) {
    console.error("Admin culture media list could not be loaded.", error);
    return adminJson({ error: "Culture media records are temporarily unavailable." }, 503);
  }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return adminJson({ error: "Request origin was not accepted." }, 403);
  }

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const parsed = await validateJson(request, mediaSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const media = await getPrismaClient().featuredMedia.create({ data: parsed.data });
    return adminJson({ data: media }, 201);
  } catch (error) {
    if (isPrismaError(error, "P2002")) {
      return adminJson({ error: "This YouTube video is already in the culture archive." }, 409);
    }
    if (isPrismaError(error, "P2003")) {
      return adminJson({ error: "Choose an artist profile that still exists." }, 400);
    }

    console.error("Admin culture media could not be created.", error);
    return adminJson({ error: "Culture media could not be saved right now." }, 503);
  }
}
