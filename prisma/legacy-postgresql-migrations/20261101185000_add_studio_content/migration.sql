CREATE TYPE "ArticleKind" AS ENUM ('NEWS', 'INSIGHT');

CREATE TABLE "ServicePricing" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "category" VARCHAR(80) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "priceAmount" INTEGER,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "priceUnit" VARCHAR(80) NOT NULL DEFAULT 'per project',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "ServicePricing_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EditorialArticle" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "kind" "ArticleKind" NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "excerpt" VARCHAR(500) NOT NULL,
    "body" TEXT NOT NULL,
    "imageUrl" VARCHAR(2048),
    "publishedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "EditorialArticle_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StudioEvent" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "description" VARCHAR(1500) NOT NULL,
    "startsAt" TIMESTAMPTZ(3) NOT NULL,
    "endsAt" TIMESTAMPTZ(3),
    "location" VARCHAR(200) NOT NULL,
    "imageUrl" VARCHAR(2048),
    "registrationUrl" VARCHAR(2048),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "StudioEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ServicePricing_slug_key" ON "ServicePricing"("slug");
CREATE INDEX "ServicePricing_published_featured_sortOrder_idx" ON "ServicePricing"("published", "featured", "sortOrder");
CREATE UNIQUE INDEX "EditorialArticle_slug_key" ON "EditorialArticle"("slug");
CREATE INDEX "EditorialArticle_kind_published_publishedAt_idx" ON "EditorialArticle"("kind", "published", "publishedAt");
CREATE UNIQUE INDEX "StudioEvent_slug_key" ON "StudioEvent"("slug");
CREATE INDEX "StudioEvent_published_startsAt_idx" ON "StudioEvent"("published", "startsAt");

INSERT INTO "ServicePricing" ("id", "slug", "title", "category", "description", "currency", "priceUnit", "published", "sortOrder", "updatedAt")
VALUES
    ('price_music-recording', 'music-recording', 'Song recording', 'Recording', 'Studio recording and vocal capture for a song. Ask us to scope the session to your project.', 'USD', 'per song', true, 0, CURRENT_TIMESTAMP),
    ('price_music-production', 'music-production', 'Music production', 'Audio', 'Creative production and arrangement shaped around your sound.', 'USD', 'per project', true, 1, CURRENT_TIMESTAMP),
    ('price_mixing-mastering', 'mixing-mastering', 'Mixing & mastering', 'Audio', 'A polished mix and master prepared for your release.', 'USD', 'per song', true, 2, CURRENT_TIMESTAMP),
    ('price_photography', 'photography', 'Photography', 'Photography', 'Portrait, editorial, brand, or event photography.', 'USD', 'per session', true, 3, CURRENT_TIMESTAMP),
    ('price_videography', 'videography', 'Videography', 'Film', 'Filming and visual storytelling for events, campaigns, and artists.', 'USD', 'per project', true, 4, CURRENT_TIMESTAMP),
    ('price_music-video', 'music-video-production', 'Music video production', 'Film', 'Concept-led music video production with planning, filming, and editing.', 'USD', 'per project', true, 5, CURRENT_TIMESTAMP);
