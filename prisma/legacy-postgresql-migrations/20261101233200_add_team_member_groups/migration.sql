CREATE TYPE "TeamMemberGroup" AS ENUM ('CORE_TEAM', 'PRODUCER', 'SESSION_MUSICIAN');

ALTER TABLE "TeamMember"
ADD COLUMN "group" "TeamMemberGroup" NOT NULL DEFAULT 'CORE_TEAM';

DROP INDEX "TeamMember_published_sortOrder_idx";

CREATE INDEX "TeamMember_published_group_sortOrder_idx"
ON "TeamMember"("published", "group", "sortOrder");
