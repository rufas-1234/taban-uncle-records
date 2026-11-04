CREATE TYPE "ApprovalEmailStatus" AS ENUM ('NOT_SENT', 'SENT', 'FAILED', 'NOT_CONFIGURED');

ALTER TABLE "Booking"
ADD COLUMN "approvalEmailStatus" "ApprovalEmailStatus" NOT NULL DEFAULT 'NOT_SENT',
ADD COLUMN "approvalEmailSentAt" TIMESTAMPTZ(3);

UPDATE "Booking"
SET "approvalEmailStatus" = 'NOT_CONFIGURED'
WHERE "status" = 'ACCEPTED';
