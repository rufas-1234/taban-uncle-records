import { randomUUID } from "node:crypto";
import { z } from "zod";

import { adminJson, isPrismaError, requireAdminApi, validateJson } from "@/lib/admin-api";
import { isSameOriginRequest } from "@/lib/admin-auth";
import { portfolioProjectSchema, teamMemberSchema } from "@/lib/admin-validation";
import { getPrismaClient } from "@/lib/prisma";

const requestSchema = z.object({
  kind: z.enum(["team", "portfolio"]),
  id: z.string().optional(),
  data: z.unknown().optional(),
});

function createSlug(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || `item-${randomUUID()}`;
}

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const prisma = getPrismaClient();
    const [team, portfolio] = await Promise.all([
      prisma.teamMember.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
      prisma.portfolioProject.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }] }),
    ]);

    return adminJson({ team, portfolio });
  } catch (error) {
    console.error("Admin team and portfolio content could not be loaded.", error);
    return adminJson({ error: "Team and portfolio content is temporarily unavailable." }, 503);
  }
}

async function save(request: Request, update: boolean) {
  if (!isSameOriginRequest(request)) {
    return adminJson({ error: "Request origin was not accepted." }, 403);
  }

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const envelope = await validateJson(request, requestSchema);
  if (!envelope.ok) return envelope.response;
  if (update && !envelope.data.id) return adminJson({ error: "A record id is required." }, 400);
  if (!envelope.data.data) return adminJson({ error: "Content data is required." }, 400);

  try {
    const prisma = getPrismaClient();
    let data: unknown;

    if (envelope.data.kind === "team") {
      const parsed = teamMemberSchema.safeParse(envelope.data.data);
      if (!parsed.success) return adminJson({ error: parsed.error.flatten().fieldErrors }, 400);
      data = update
        ? await prisma.teamMember.update({
            where: { id: envelope.data.id },
            data: { ...parsed.data, slug: createSlug(parsed.data.name) },
          })
        : await prisma.teamMember.create({
            data: { ...parsed.data, slug: createSlug(parsed.data.name) },
          });
    } else {
      const parsed = portfolioProjectSchema.safeParse(envelope.data.data);
      if (!parsed.success) return adminJson({ error: parsed.error.flatten().fieldErrors }, 400);
      data = update
        ? await prisma.portfolioProject.update({
            where: { id: envelope.data.id },
            data: { ...parsed.data, slug: createSlug(parsed.data.title) },
          })
        : await prisma.portfolioProject.create({
            data: { ...parsed.data, slug: createSlug(parsed.data.title) },
          });
    }

    return adminJson({ data }, update ? 200 : 201);
  } catch (error) {
    if (isPrismaError(error, "P2002")) {
      return adminJson({ error: "A team member or project with this name already exists." }, 409);
    }
    if (isPrismaError(error, "P2025")) {
      return adminJson({ error: "The record was not found." }, 404);
    }

    console.error("Admin team or portfolio content could not be saved.", error);
    return adminJson({ error: "Team or portfolio content could not be saved right now." }, 503);
  }
}

export function POST(request: Request) {
  return save(request, false);
}

export function PATCH(request: Request) {
  return save(request, true);
}

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) {
    return adminJson({ error: "Request origin was not accepted." }, 403);
  }

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const envelope = await validateJson(request, requestSchema.pick({ kind: true, id: true }));
  if (!envelope.ok) return envelope.response;
  if (!envelope.data.id) return adminJson({ error: "A record id is required." }, 400);

  try {
    const prisma = getPrismaClient();
    if (envelope.data.kind === "team") {
      await prisma.teamMember.delete({ where: { id: envelope.data.id } });
    } else {
      await prisma.portfolioProject.delete({ where: { id: envelope.data.id } });
    }

    return adminJson({ ok: true });
  } catch (error) {
    if (isPrismaError(error, "P2025")) return adminJson({ error: "The record was not found." }, 404);

    console.error("Admin team or portfolio content could not be deleted.", error);
    return adminJson({ error: "Team or portfolio content could not be deleted right now." }, 503);
  }
}
