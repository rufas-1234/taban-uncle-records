CREATE SCHEMA IF NOT EXISTS "public";

CREATE TYPE "BookingStatus" AS ENUM ('NEW', 'CONTACTED', 'ACCEPTED', 'DECLINED');

CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "service" VARCHAR(80) NOT NULL,
    "projectType" VARCHAR(160) NOT NULL,
    "message" VARCHAR(5000) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Booking_status_createdAt_idx" ON "Booking"("status", "createdAt");
CREATE INDEX "Booking_email_idx" ON "Booking"("email");
