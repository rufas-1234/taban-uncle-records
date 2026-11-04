import { z } from "zod";
import { getYouTubeVideoId } from "@/lib/youtube";

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isYouTubeVideoUrl(value: string) {
  return getYouTubeVideoId(value) !== null;
}

const optionalHttpsUrl = z
  .union([
    z.literal(""),
    z.string().trim().url().max(2048).refine(isHttpsUrl, "Use a secure HTTPS link."),
  ])
  .transform((value) => value || null);

const optionalImageUrl = z
  .union([
    z.literal(""),
    z.string().trim().max(2048).refine(
      (value) => isHttpsUrl(value) || /^\/uploads\/[a-zA-Z0-9._-]+$/.test(value),
      "Use an HTTPS link or upload an image.",
    ),
  ])
  .transform((value) => value || null);

export const adminLoginSchema = z.object({
  email: z.string().trim().email().max(320).toLowerCase(),
  password: z.string().min(1).max(128),
});

export const publisherCreateSchema = z.object({
  email: z.string().trim().email().max(320).toLowerCase(),
  password: z.string().min(14).max(128),
});

export const publisherStatusSchema = z.object({
  id: z.string().min(1).max(64),
  isActive: z.boolean(),
});

export const bookingStatusSchema = z.object({
  id: z.string().min(1).max(64),
  status: z.enum(["NEW", "CONTACTED", "ACCEPTED", "DECLINED"]),
});

export const adminSetupSchema = z.object({
  setupToken: z.string().min(32).max(256),
  email: z.string().trim().email().max(320).toLowerCase(),
  password: z.string().min(14).max(128),
});

export const artistSchema = z.object({
  name: z.string().trim().min(2).max(160),
  culture: z.string().trim().min(2).max(100),
  role: z.string().trim().min(2).max(160),
  bio: z.string().trim().min(10).max(1500),
  imageUrl: optionalImageUrl,
  sourceUrl: optionalHttpsUrl,
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.number().int().min(0).max(10000),
});

export const mediaSchema = z.object({
  title: z.string().trim().min(2).max(180),
  mediaType: z.enum(["SONG", "MUSIC_COLLECTION", "PERFORMANCE", "CULTURE_STORY"]),
  culture: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(1500),
  youtubeUrl: z
    .union([
      z.literal(""),
      z.string().trim().url().max(512).refine(isYouTubeVideoUrl, "Use a valid public YouTube video URL."),
    ])
    .transform((value) => value || null),
  sourceName: z.union([z.literal(""), z.string().trim().min(2).max(160)]).transform((value) => value || null),
  imageUrl: optionalImageUrl,
  artistId: z.union([z.literal(""), z.string().trim().max(64)]).transform((value) => value || null),
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.number().int().min(0).max(10000),
});

export const pricingSchema = z.object({
  title: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(80),
  description: z.string().trim().min(10).max(1000),
  priceAmount: z.union([z.number().int().min(0).max(100000000), z.null()]),
  currency: z.string().trim().length(3).toUpperCase(),
  priceUnit: z.string().trim().min(2).max(80),
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.number().int().min(0).max(10000),
});

export const articleSchema = z.object({
  kind: z.enum(["NEWS", "INSIGHT"]),
  title: z.string().trim().min(2).max(180),
  excerpt: z.string().trim().min(10).max(500),
  body: z.string().trim().min(20).max(20000),
  imageUrl: optionalImageUrl,
  publishedAt: z.string().datetime({ offset: true }).transform((value) => new Date(value)),
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.number().int().min(0).max(10000),
});

export const eventSchema = z.object({
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().min(10).max(1500),
  startsAt: z.string().datetime({ offset: true }).transform((value) => new Date(value)),
  endsAt: z
    .union([z.literal(""), z.string().datetime({ offset: true })])
    .transform((value) => (value ? new Date(value) : null)),
  location: z.string().trim().min(2).max(200),
  imageUrl: optionalImageUrl,
  registrationUrl: optionalHttpsUrl,
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.number().int().min(0).max(10000),
});

export const teamMemberSchema = z.object({
  name: z.string().trim().min(2).max(160),
  title: z.string().trim().min(2).max(160),
  group: z.enum(["CORE_TEAM", "PRODUCER", "SESSION_MUSICIAN"]),
  bio: z.string().trim().max(1500),
  imageUrl: optionalImageUrl,
  published: z.boolean(),
  sortOrder: z.number().int().min(0).max(10000),
});

export const portfolioProjectSchema = z.object({
  title: z.string().trim().min(2).max(180),
  category: z.string().trim().min(2).max(100),
  type: z.enum(["MUSIC", "PHOTOGRAPHY", "VIDEOGRAPHY", "OTHER"]),
  description: z.string().trim().min(10).max(1500),
  imageUrl: z.string().trim().min(1).max(2048).refine(
    (value) => isHttpsUrl(value) || /^\/uploads\/[a-zA-Z0-9._-]+$/.test(value),
    "Add an HTTPS image link or upload a project image.",
  ),
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.number().int().min(0).max(10000),
});
