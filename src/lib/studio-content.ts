import { connection } from "next/server";

import { getPrismaClient, hasMySqlConfiguration } from "@/lib/prisma";

export async function getPublicPricing() {
  await connection();
  if (!hasMySqlConfiguration()) {
    return [];
  }

  return getPrismaClient().servicePricing.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { title: "asc" }],
  });
}

export async function getPublicArticles(kind?: "NEWS" | "INSIGHT") {
  await connection();
  if (!hasMySqlConfiguration()) {
    return [];
  }

  return getPrismaClient().editorialArticle.findMany({
    where: { published: true, ...(kind ? { kind } : {}) },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { sortOrder: "asc" }],
  });
}

export async function getUpcomingEvents(limit?: number) {
  await connection();
  if (!hasMySqlConfiguration()) {
    return [];
  }

  return getPrismaClient().studioEvent.findMany({
    where: { published: true, startsAt: { gte: new Date() } },
    orderBy: [{ startsAt: "asc" }, { featured: "desc" }, { sortOrder: "asc" }],
    ...(limit ? { take: limit } : {}),
  });
}
