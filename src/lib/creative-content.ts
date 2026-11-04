import { connection } from "next/server";

import { portfolioItems, team } from "@/lib/site-data";
import { getPrismaClient, hasMySqlConfiguration } from "@/lib/prisma";
import type { PortfolioType, TeamMemberGroup } from "@/generated/prisma/client";

export type PublicPortfolioProject = {
  id: string;
  title: string;
  category: string;
  type: PortfolioType;
  description: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

export type PublicTeamMember = {
  id: string;
  name: string;
  title: string;
  group: TeamMemberGroup;
  bio: string;
  imageUrl: string | null;
  published: boolean;
  sortOrder: number;
};

export async function getPublicPortfolio(): Promise<PublicPortfolioProject[]> {
  await connection();
  if (!hasMySqlConfiguration()) {
    return portfolioItems.map((item, index) => ({
      id: item.title,
      title: item.title,
      category: item.category,
      type: item.type.toUpperCase() as "MUSIC" | "PHOTOGRAPHY" | "VIDEOGRAPHY",
      description: item.description,
      imageUrl: item.image,
      featured: index < 3,
      published: true,
      sortOrder: index,
    }));
  }

  return getPrismaClient().portfolioProject.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { title: "asc" }],
  });
}

export async function getPublicTeam(): Promise<PublicTeamMember[]> {
  await connection();
  if (!hasMySqlConfiguration()) {
    return team.map((member, index) => ({
      id: member.name,
      name: member.name,
      title: member.title,
      group: "CORE_TEAM" as const,
      bio: "",
      imageUrl: null,
      published: true,
      sortOrder: index,
    }));
  }

  return getPrismaClient().teamMember.findMany({
    where: { published: true },
    orderBy: [{ group: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
}
