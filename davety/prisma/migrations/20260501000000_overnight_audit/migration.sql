-- Overnight audit migration. Adds new columns and the music_track table
-- for guest tokens, password protection, archive scheduling, asset
-- variant tracking, multi-event guest groups, and the music library.
--
-- Run: npx prisma migrate deploy
-- Safe to run on existing data: every new column is nullable or has a
-- default, no destructive operations.

-- 1) InvitationDesign new columns
ALTER TABLE "invitation_design"
  ADD COLUMN IF NOT EXISTS "passwordHash" TEXT,
  ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "archivedAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "invitation_design_expiresAt_idx"
  ON "invitation_design"("expiresAt");
CREATE INDEX IF NOT EXISTS "invitation_design_customDomain_idx"
  ON "invitation_design"("customDomain");

-- 2) Asset.variantKeys
ALTER TABLE "asset"
  ADD COLUMN IF NOT EXISTS "variantKeys" JSONB;

-- 3) Guest extensions
ALTER TABLE "guest"
  ADD COLUMN IF NOT EXISTS "token" TEXT,
  ADD COLUMN IF NOT EXISTS "plusOneMax" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "groupLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "eventDays" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

CREATE UNIQUE INDEX IF NOT EXISTS "guest_token_key" ON "guest"("token")
  WHERE "token" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "guest_designId_attending_idx"
  ON "guest"("designId", "attending");

-- 4) MusicTrack catalog table
CREATE TABLE IF NOT EXISTS "music_track" (
  "id"           TEXT PRIMARY KEY,
  "slug"         TEXT NOT NULL UNIQUE,
  "title"        TEXT NOT NULL,
  "artist"       TEXT NOT NULL,
  "url"          TEXT NOT NULL,
  "moods"        TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "tier"         TEXT NOT NULL DEFAULT 'free',
  "durationSec"  INTEGER,
  "licensor"     TEXT,
  "licenseUrl"   TEXT,
  "enabled"      BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL
);
CREATE INDEX IF NOT EXISTS "music_track_enabled_tier_idx"
  ON "music_track"("enabled", "tier");
