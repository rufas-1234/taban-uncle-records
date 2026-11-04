import { randomUUID } from "node:crypto";

import { adminJson, isPrismaError, requireAdminApi, validateJson } from "@/lib/admin-api";
import { isSameOriginRequest } from "@/lib/admin-auth";
import {
  articleSchema,
  eventSchema,
  pricingSchema,
} from "@/lib/admin-validation";
import { getPrismaClient } from "@/lib/prisma";
import { z } from "zod";

const requestSchema = z.object({
  kind: z.enum(["pricing", "article", "event"]),
  id: z.string().optional(),
  data: z.unknown().optional(),
});

function invalid(error: z.ZodError) {
  return adminJson({ error: error.flatten().fieldErrors }, 400);
}

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
    const [pricing, articles, events] = await Promise.all([
      prisma.servicePricing.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }] }),
      prisma.editorialArticle.findMany({ orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }] }),
      prisma.studioEvent.findMany({ orderBy: [{ startsAt: "asc" }, { sortOrder: "asc" }] }),
    ]);

    return adminJson({ pricing, articles, events });
  } catch (error) {
    console.error("Admin studio content could not be loaded.", error);
    return adminJson({ error: "Studio content is temporarily unavailable." }, 503);
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
  if (update && !envelope.data.id) {
    return adminJson({ error: "A record id is required." }, 400);
  }
  if (!envelope.data.data) {
    return adminJson({ error: "Content data is required." }, 400);
  }

  try {
    const prisma = getPrismaClient();
    let data: unknown;

    if (envelope.data.kind === "pricing") {
      const parsed = pricingSchema.safeParse(envelope.data.data);
      if (!parsed.success) return invalid(parsed.error);
      const values = parsed.data;
      data = update
        ? await prisma.servicePricing.update({
            where: { id: envelope.data.id },
            data: { ...values, slug: createSlug(values.title) },
          })
        : await prisma.servicePricing.create({
            data: { ...values, slug: createSlug(values.title) },
          });
    } else if (envelope.data.kind === "article") {
      const parsed = articleSchema.safeParse(envelope.data.data);
      if (!parsed.success) return invalid(parsed.error);
      const values = parsed.data;
      data = update
        ? await prisma.editorialArticle.update({
            where: { id: envelope.data.id },
            data: { ...values, slug: createSlug(values.title) },
          })
        : await prisma.editorialArticle.create({
            data: { ...values, slug: createSlug(values.title) },
          });
    } else {
      const parsed = eventSchema.safeParse(envelope.data.data);
      if (!parsed.success) return invalid(parsed.error);
      const values = parsed.data;
      data = update
        ? await prisma.studioEvent.update({
            where: { id: envelope.data.id },
            data: { ...values, slug: createSlug(values.title) },
          })
        : await prisma.studioEvent.create({
            data: { ...values, slug: createSlug(values.title) },
          });
    }

    return adminJson({ data }, update ? 200 : 201);
  } catch (error) {
    if (isPrismaError(error, "P2002")) {
      return adminJson({ error: "A record with this title already exists." }, 409);
    }
    if (isPrismaError(error, "P2025")) {
      return adminJson({ error: "The record was not found." }, 404);
    }

    console.error("Admin studio content could not be saved.", error);
    return adminJson({ error: "Studio content could not be saved right now." }, 503);
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

  const envelope = await validateJson(
    request,
    requestSchema.pick({ kind: true, id: true }),
  );
  if (!envelope.ok) return envelope.response;
  if (!envelope.data.id) return adminJson({ error: "A record id is required." }, 400);

  try {
    const prisma = getPrismaClient();
    if (envelope.data.kind === "pricing") {
      await prisma.servicePricing.delete({ where: { id: envelope.data.id } });
    } else if (envelope.data.kind === "article") {
      await prisma.editorialArticle.delete({ where: { id: envelope.data.id } });
    } else {
      await prisma.studioEvent.delete({ where: { id: envelope.data.id } });
    }

    return adminJson({ ok: true });
  } catch (error) {
    if (isPrismaError(error, "P2025")) {
      return adminJson({ error: "The record was not found." }, 404);
    }

    console.error("Admin studio content could not be deleted.", error);
    return adminJson({ error: "Studio content could not be deleted right now." }, 503);
  }
}
