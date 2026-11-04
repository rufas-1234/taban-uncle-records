import { connection } from "next/server";

import { getPrismaClient, hasMySqlConfiguration } from "@/lib/prisma";
import {
  initialCultureArtists,
  initialCultureMedia,
  type CultureArtistRecord,
  type CultureMediaRecord,
} from "@/lib/culture-seed";

function getStarterContent() {
  const artists: CultureArtistRecord[] = initialCultureArtists.map((artist) => ({
    ...artist,
    id: artist.slug,
  }));
  const artistsBySlug = new Map(artists.map((artist) => [artist.slug, artist]));

  const media: CultureMediaRecord[] = initialCultureMedia.map((item) => {
    const artist = item.artistSlug ? artistsBySlug.get(item.artistSlug) : undefined;
    if (item.artistSlug && !artist) {
      throw new Error(`Starter media references unknown artist slug "${item.artistSlug}".`);
    }

    return {
      id: item.youtubeUrl,
      title: item.title,
      mediaType: item.mediaType,
      culture: item.culture,
      description: item.description,
      youtubeUrl: item.youtubeUrl,
      sourceName: item.sourceName,
      imageUrl: item.imageUrl,
      featured: item.featured,
      published: item.published,
      sortOrder: item.sortOrder,
      artist: artist ? { id: artist.id, name: artist.name } : null,
    };
  });

  return { artists, media };
}

export async function getPublicCultureContent() {
  await connection();

  if (!hasMySqlConfiguration()) {
    return getStarterContent();
  }

  const prisma = getPrismaClient();
  const adminCount = await prisma.adminAccount.count();

  if (adminCount === 0) {
    return getStarterContent();
  }

  const [artists, media] = await Promise.all([
    prisma.featuredArtist.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        slug: true,
        name: true,
        culture: true,
        role: true,
        bio: true,
        imageUrl: true,
        sourceUrl: true,
        featured: true,
        published: true,
        sortOrder: true,
      },
    }),
    prisma.featuredMedia.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        artist: {
          select: { id: true, name: true },
        },
      },
    }),
  ]);

  return { artists, media };
}

export async function getLatestSongReleases(limit = 6) {
  await connection();

  if (!hasMySqlConfiguration()) {
    return getStarterContent().media
      .filter((item) => item.published && item.mediaType === "SONG")
      .slice(0, limit);
  }

  const prisma = getPrismaClient();
  if ((await prisma.adminAccount.count()) === 0) {
    return getStarterContent().media
      .filter((item) => item.published && item.mediaType === "SONG")
      .slice(0, limit);
  }

  return prisma.featuredMedia.findMany({
    where: { published: true, mediaType: "SONG" },
    orderBy: [{ createdAt: "desc" }, { title: "asc" }],
    take: limit,
    include: {
      artist: { select: { id: true, name: true } },
    },
  });
}
