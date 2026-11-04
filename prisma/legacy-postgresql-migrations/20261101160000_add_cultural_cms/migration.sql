CREATE TYPE "FeaturedMediaType" AS ENUM ('SONG', 'PERFORMANCE', 'CULTURE_STORY');

CREATE TABLE "AdminAccount" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "AdminAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FeaturedArtist" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "culture" VARCHAR(100) NOT NULL,
    "role" VARCHAR(160) NOT NULL,
    "bio" VARCHAR(1500) NOT NULL,
    "imageUrl" VARCHAR(2048),
    "sourceUrl" VARCHAR(2048),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "FeaturedArtist_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FeaturedMedia" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "mediaType" "FeaturedMediaType" NOT NULL DEFAULT 'SONG',
    "culture" VARCHAR(100) NOT NULL,
    "description" VARCHAR(1500) NOT NULL,
    "youtubeUrl" VARCHAR(2048) NOT NULL,
    "sourceName" VARCHAR(160) NOT NULL,
    "imageUrl" VARCHAR(2048),
    "artistId" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "FeaturedMedia_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "FeaturedMedia_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "FeaturedArtist"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "AdminAccount_email_key" ON "AdminAccount"("email");
CREATE UNIQUE INDEX "FeaturedArtist_slug_key" ON "FeaturedArtist"("slug");
CREATE INDEX "FeaturedArtist_published_featured_sortOrder_idx" ON "FeaturedArtist"("published", "featured", "sortOrder");
CREATE UNIQUE INDEX "FeaturedMedia_youtubeUrl_key" ON "FeaturedMedia"("youtubeUrl");
CREATE INDEX "FeaturedMedia_published_featured_sortOrder_idx" ON "FeaturedMedia"("published", "featured", "sortOrder");
CREATE INDEX "FeaturedMedia_artistId_idx" ON "FeaturedMedia"("artistId");
