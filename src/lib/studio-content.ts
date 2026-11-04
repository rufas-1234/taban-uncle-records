import { connection } from "next/server";

import { getPrismaClient } from "@/lib/prisma";

export async function getPublicPricing() {
  await connection();
  return getPrismaClient().servicePricing.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { title: "asc" }],
  });
}

export async function getPublicArticles(kind?: "NEWS" | "INSIGHT") {
  await connection();
  return getPrismaClient().editorialArticle.findMany({
    where: { published: true, ...(kind ? { kind } : {}) },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { sortOrder: "asc" }],
  });
}

export async function getUpcomingEvents(limit?: number) {
  await connection();
  return getPrismaClient().studioEvent.findMany({
    where: { published: true, startsAt: { gte: new Date() } },
    orderBy: [{ startsAt: "asc" }, { featured: "desc" }, { sortOrder: "asc" }],
    ...(limit ? { take: limit } : {}),
  });
}
