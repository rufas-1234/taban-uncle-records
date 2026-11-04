import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";

import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  hashAdminPassword,
  isAdminSessionConfigured,
  isSameOriginRequest,
  shouldUseSecureCookie,
} from "@/lib/admin-auth";
import { adminJson, isPrismaError, validateJson } from "@/lib/admin-api";
import { adminSetupSchema } from "@/lib/admin-validation";
import { initialCultureArtists, initialCultureMedia } from "@/lib/culture-seed";
import { getPrismaClient } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return adminJson({ error: "Request origin was not accepted." }, 403);
  }

  const parsed = await validateJson(request, adminSetupSchema);
  if (!parsed.ok) return parsed.response;

  const expectedToken = process.env.ADMIN_SETUP_TOKEN;
  if (!expectedToken || expectedToken.length < 32 || !isAdminSessionConfigured()) {
    return adminJson(
      { error: "Set ADMIN_SETUP_TOKEN and ADMIN_SESSION_SECRET before creating an admin account." },
      503,
    );
  }

  const supplied = Buffer.from(parsed.data.setupToken);
  const expected = Buffer.from(expectedToken);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return adminJson({ error: "The setup token is invalid." }, 401);
  }

  try {
    const prisma = getPrismaClient();
    const passwordHash = await hashAdminPassword(parsed.data.password);
    const account = await prisma.$transaction(
      async (transaction) => {
        if ((await transaction.adminAccount.count()) > 0) {
          return null;
        }

        const admin = await transaction.adminAccount.create({
          data: { email: parsed.data.email, passwordHash },
          select: { id: true },
        });
        const artistIds = new Map<string, string>();
        for (const artistData of initialCultureArtists) {
          const artist = await transaction.featuredArtist.upsert({
            where: { slug: artistData.slug },
            create: { ...artistData },
            update: {},
            select: { id: true },
          });
          artistIds.set(artistData.slug, artist.id);
        }

        for (const media of initialCultureMedia) {
          const artistId = media.artistSlug ? artistIds.get(media.artistSlug) : null;
          if (media.artistSlug && !artistId) {
            throw new Error(`Starter media references unknown artist slug "${media.artistSlug}".`);
          }

          await transaction.featuredMedia.upsert({
            where: { youtubeUrl: media.youtubeUrl },
            create: {
              title: media.title,
              mediaType: media.mediaType,
              culture: media.culture,
              description: media.description,
              youtubeUrl: media.youtubeUrl,
              sourceName: media.sourceName,
              imageUrl: media.imageUrl,
              artistId,
              featured: media.featured,
              published: media.published,
              sortOrder: media.sortOrder,
            },
            update: {},
          });
        }

        return admin;
      },
      { isolationLevel: "Serializable" },
    );

    if (!account) {
      return adminJson({ error: "Admin setup has already been completed." }, 409);
    }

    const token = createAdminSessionToken(account.id);
    (await cookies()).set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: shouldUseSecureCookie(request),
      sameSite: "strict",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });

    return adminJson({ ok: true }, 201);
  } catch (error) {
    if (isPrismaError(error, "P2002") || isPrismaError(error, "P2034")) {
      return adminJson({ error: "Admin setup has already been completed or is in progress." }, 409);
    }

    console.error("Initial admin setup could not be completed.", error);
    return adminJson({ error: "Admin setup is temporarily unavailable." }, 503);
  }
}
