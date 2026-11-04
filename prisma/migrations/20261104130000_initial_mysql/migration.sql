-- CreateTable
CREATE TABLE `Booking` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(320) NOT NULL,
    `phone` VARCHAR(40) NULL,
    `service` VARCHAR(80) NOT NULL,
    `projectType` VARCHAR(160) NOT NULL,
    `message` VARCHAR(5000) NOT NULL,
    `status` ENUM('NEW', 'CONTACTED', 'ACCEPTED', 'DECLINED') NOT NULL DEFAULT 'NEW',
    `approvalEmailStatus` ENUM('NOT_SENT', 'SENT', 'FAILED', 'NOT_CONFIGURED') NOT NULL DEFAULT 'NOT_SENT',
    `approvalEmailSentAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Booking_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `Booking_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminAccount` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(320) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `role` ENUM('SENIOR_ADMIN', 'PUBLISHER') NOT NULL DEFAULT 'SENIOR_ADMIN',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AdminAccount_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeaturedArtist` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(180) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `culture` VARCHAR(100) NOT NULL,
    `role` VARCHAR(160) NOT NULL,
    `bio` VARCHAR(1500) NOT NULL,
    `imageUrl` VARCHAR(2048) NULL,
    `sourceUrl` VARCHAR(2048) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FeaturedArtist_slug_key`(`slug`),
    INDEX `FeaturedArtist_published_featured_sortOrder_idx`(`published`, `featured`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeaturedMedia` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(180) NOT NULL,
    `mediaType` ENUM('SONG', 'MUSIC_COLLECTION', 'PERFORMANCE', 'CULTURE_STORY') NOT NULL DEFAULT 'SONG',
    `culture` VARCHAR(100) NOT NULL,
    `description` VARCHAR(1500) NOT NULL,
    `youtubeUrl` VARCHAR(512) NULL,
    `sourceName` VARCHAR(160) NULL,
    `imageUrl` VARCHAR(2048) NULL,
    `artistId` VARCHAR(191) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FeaturedMedia_youtubeUrl_key`(`youtubeUrl`),
    INDEX `FeaturedMedia_published_featured_sortOrder_idx`(`published`, `featured`, `sortOrder`),
    INDEX `FeaturedMedia_artistId_idx`(`artistId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServicePricing` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(180) NOT NULL,
    `title` VARCHAR(160) NOT NULL,
    `category` VARCHAR(80) NOT NULL,
    `description` VARCHAR(1000) NOT NULL,
    `priceAmount` INTEGER NULL,
    `currency` VARCHAR(3) NOT NULL DEFAULT 'USD',
    `priceUnit` VARCHAR(80) NOT NULL DEFAULT 'per project',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ServicePricing_slug_key`(`slug`),
    INDEX `ServicePricing_published_featured_sortOrder_idx`(`published`, `featured`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EditorialArticle` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(180) NOT NULL,
    `kind` ENUM('NEWS', 'INSIGHT') NOT NULL,
    `title` VARCHAR(180) NOT NULL,
    `excerpt` VARCHAR(500) NOT NULL,
    `body` LONGTEXT NOT NULL,
    `imageUrl` VARCHAR(2048) NULL,
    `publishedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EditorialArticle_slug_key`(`slug`),
    INDEX `EditorialArticle_kind_published_publishedAt_idx`(`kind`, `published`, `publishedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudioEvent` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(180) NOT NULL,
    `title` VARCHAR(180) NOT NULL,
    `description` VARCHAR(1500) NOT NULL,
    `startsAt` DATETIME(3) NOT NULL,
    `endsAt` DATETIME(3) NULL,
    `location` VARCHAR(200) NOT NULL,
    `imageUrl` VARCHAR(2048) NULL,
    `registrationUrl` VARCHAR(2048) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StudioEvent_slug_key`(`slug`),
    INDEX `StudioEvent_published_startsAt_idx`(`published`, `startsAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeamMember` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(180) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `title` VARCHAR(160) NOT NULL,
    `group` ENUM('CORE_TEAM', 'PRODUCER', 'SESSION_MUSICIAN') NOT NULL DEFAULT 'CORE_TEAM',
    `bio` VARCHAR(1500) NOT NULL,
    `imageUrl` VARCHAR(2048) NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TeamMember_slug_key`(`slug`),
    INDEX `TeamMember_published_group_sortOrder_idx`(`published`, `group`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PortfolioProject` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(180) NOT NULL,
    `title` VARCHAR(180) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `type` ENUM('MUSIC', 'PHOTOGRAPHY', 'VIDEOGRAPHY', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `description` VARCHAR(1500) NOT NULL,
    `imageUrl` VARCHAR(2048) NOT NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PortfolioProject_slug_key`(`slug`),
    INDEX `PortfolioProject_published_featured_sortOrder_idx`(`published`, `featured`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FeaturedMedia` ADD CONSTRAINT `FeaturedMedia_artistId_fkey` FOREIGN KEY (`artistId`) REFERENCES `FeaturedArtist`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed starter service pricing
INSERT INTO `ServicePricing` (`id`, `slug`, `title`, `category`, `description`, `currency`, `priceUnit`, `published`, `sortOrder`, `updatedAt`)
VALUES
    ('price_music-recording', 'music-recording', 'Song recording', 'Recording', 'Studio recording and vocal capture for a song. Ask us to scope the session to your project.', 'USD', 'per song', true, 0, CURRENT_TIMESTAMP(3)),
    ('price_music-production', 'music-production', 'Music production', 'Audio', 'Creative production and arrangement shaped around your sound.', 'USD', 'per project', true, 1, CURRENT_TIMESTAMP(3)),
    ('price_mixing-mastering', 'mixing-mastering', 'Mixing & mastering', 'Audio', 'A polished mix and master prepared for your release.', 'USD', 'per song', true, 2, CURRENT_TIMESTAMP(3)),
    ('price_photography', 'photography', 'Photography', 'Photography', 'Portrait, editorial, brand, or event photography.', 'USD', 'per session', true, 3, CURRENT_TIMESTAMP(3)),
    ('price_videography', 'videography', 'Videography', 'Film', 'Filming and visual storytelling for events, campaigns, and artists.', 'USD', 'per project', true, 4, CURRENT_TIMESTAMP(3)),
    ('price_music-video', 'music-video-production', 'Music video production', 'Film', 'Concept-led music video production with planning, filming, and editing.', 'USD', 'per project', true, 5, CURRENT_TIMESTAMP(3));

-- Seed starter team profiles
INSERT INTO `TeamMember` (`id`, `slug`, `name`, `title`, `bio`, `published`, `sortOrder`, `updatedAt`)
VALUES
    ('team_taban-uncle', 'taban-uncle', 'Taban Uncle', 'Creative Director', 'Leads the studio’s artistic vision with an eye for authentic storytelling, polished production, and strong performer identity.', true, 0, CURRENT_TIMESTAMP(3)),
    ('team_aminah-j', 'aminah-j', 'Aminah J', 'Audio Producer', 'Transforms raw recordings into detail-rich final mixes with calm precision and creative confidence.', true, 1, CURRENT_TIMESTAMP(3)),
    ('team_kwame-d', 'kwame-d', 'Kwame D', 'Visual Storyteller', 'Builds moving visual stories by shaping atmosphere, rhythm, and narrative detail in every frame.', true, 2, CURRENT_TIMESTAMP(3)),
    ('team_studio-ops', 'studio-ops', 'Studio Ops', 'Client & Booking Coordinator', '', true, 3, CURRENT_TIMESTAMP(3));

-- Seed starter portfolio
INSERT INTO `PortfolioProject` (`id`, `slug`, `title`, `category`, `type`, `description`, `imageUrl`, `featured`, `published`, `sortOrder`, `updatedAt`)
VALUES
    ('portfolio_sound-of-juba', 'sound-of-juba', 'Sound of Juba', 'Music Production', 'MUSIC', 'A local artist showcase built around layered instruments and atmospheric storytelling.', 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80', true, true, 0, CURRENT_TIMESTAMP(3)),
    ('portfolio_city-frames', 'city-frames', 'City Frames', 'Photography', 'PHOTOGRAPHY', 'Candid portraits and district-wide storytelling through natural light and strong composition.', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', true, true, 1, CURRENT_TIMESTAMP(3)),
    ('portfolio_gathering-in-motion', 'gathering-in-motion', 'Gathering in Motion', 'Videography', 'VIDEOGRAPHY', 'A community-centered event video capturing movement, sound, and human connection.', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80', true, true, 2, CURRENT_TIMESTAMP(3)),
    ('portfolio_rhythm-and-pulse', 'rhythm-pulse', 'Rhythm & Pulse', 'Music Video', 'VIDEOGRAPHY', 'An artist-led music video blending performance footage with cinematic city visuals.', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80', false, true, 3, CURRENT_TIMESTAMP(3)),
    ('portfolio_studio-portraits', 'studio-portraits', 'Studio Portraits', 'Portraits', 'PHOTOGRAPHY', 'Studio portraits with warm light, subtle styling, and an art-directed visual finish.', 'https://images.unsplash.com/photo-1524504388940-b1c172265e1?auto=format&fit=crop&w=1200&q=80', false, true, 4, CURRENT_TIMESTAMP(3)),
    ('portfolio_after-hours-session', 'after-hours-session', 'After Hours Session', 'Recording', 'MUSIC', 'A nighttime session exploring intimate vocal textures and performance-led arrangement choices.', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80', false, true, 5, CURRENT_TIMESTAMP(3));
