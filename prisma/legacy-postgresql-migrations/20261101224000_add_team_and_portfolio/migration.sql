CREATE TYPE "PortfolioType" AS ENUM ('MUSIC', 'PHOTOGRAPHY', 'VIDEOGRAPHY', 'OTHER');

CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "bio" VARCHAR(1500) NOT NULL DEFAULT '',
    "imageUrl" VARCHAR(2048),
    "published" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PortfolioProject" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "type" "PortfolioType" NOT NULL DEFAULT 'OTHER',
    "description" VARCHAR(1500) NOT NULL,
    "imageUrl" VARCHAR(2048) NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "PortfolioProject_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TeamMember_slug_key" ON "TeamMember"("slug");
CREATE INDEX "TeamMember_published_sortOrder_idx" ON "TeamMember"("published", "sortOrder");
CREATE UNIQUE INDEX "PortfolioProject_slug_key" ON "PortfolioProject"("slug");
CREATE INDEX "PortfolioProject_published_featured_sortOrder_idx" ON "PortfolioProject"("published", "featured", "sortOrder");

INSERT INTO "TeamMember" ("id", "slug", "name", "title", "bio", "published", "sortOrder", "updatedAt")
VALUES
    ('team_taban-uncle', 'taban-uncle', 'Taban Uncle', 'Creative Director', 'Leads the studio’s artistic vision with an eye for authentic storytelling, polished production, and strong performer identity.', true, 0, CURRENT_TIMESTAMP),
    ('team_aminah-j', 'aminah-j', 'Aminah J', 'Audio Producer', 'Transforms raw recordings into detail-rich final mixes with calm precision and creative confidence.', true, 1, CURRENT_TIMESTAMP),
    ('team_kwame-d', 'kwame-d', 'Kwame D', 'Visual Storyteller', 'Builds moving visual stories by shaping atmosphere, rhythm, and narrative detail in every frame.', true, 2, CURRENT_TIMESTAMP),
    ('team_studio-ops', 'studio-ops', 'Studio Ops', 'Client & Booking Coordinator', '', true, 3, CURRENT_TIMESTAMP);

INSERT INTO "PortfolioProject" ("id", "slug", "title", "category", "type", "description", "imageUrl", "featured", "published", "sortOrder", "updatedAt")
VALUES
    ('portfolio_sound-of-juba', 'sound-of-juba', 'Sound of Juba', 'Music Production', 'MUSIC', 'A local artist showcase built around layered instruments and atmospheric storytelling.', 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80', true, true, 0, CURRENT_TIMESTAMP),
    ('portfolio_city-frames', 'city-frames', 'City Frames', 'Photography', 'PHOTOGRAPHY', 'Candid portraits and district-wide storytelling through natural light and strong composition.', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', true, true, 1, CURRENT_TIMESTAMP),
    ('portfolio_gathering-in-motion', 'gathering-in-motion', 'Gathering in Motion', 'Videography', 'VIDEOGRAPHY', 'A community-centered event video capturing movement, sound, and human connection.', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80', true, true, 2, CURRENT_TIMESTAMP),
    ('portfolio_rhythm-and-pulse', 'rhythm-pulse', 'Rhythm & Pulse', 'Music Video', 'VIDEOGRAPHY', 'An artist-led music video blending performance footage with cinematic city visuals.', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80', false, true, 3, CURRENT_TIMESTAMP),
    ('portfolio_studio-portraits', 'studio-portraits', 'Studio Portraits', 'Portraits', 'PHOTOGRAPHY', 'Studio portraits with warm light, subtle styling, and an art-directed visual finish.', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80', false, true, 4, CURRENT_TIMESTAMP),
    ('portfolio_after-hours-session', 'after-hours-session', 'After Hours Session', 'Recording', 'MUSIC', 'A nighttime session exploring intimate vocal textures and performance-led arrangement choices.', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80', false, true, 5, CURRENT_TIMESTAMP);
