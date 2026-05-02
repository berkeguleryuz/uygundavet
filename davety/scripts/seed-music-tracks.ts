/**
 * Seeds the music_track catalog with the curated initial set.
 *
 * Run once after the migration:
 *   npx tsx scripts/seed-music-tracks.ts
 *
 * Idempotent. Existing rows matched by slug are updated.
 *
 * License note: every track listed here must be license-cleared. The
 * urls below point to placeholder R2 keys that the team uploads under
 * `system/music/`. Replace with the real CDN url before going live.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SeedTrack {
  slug: string;
  title: string;
  artist: string;
  url: string;
  moods: string[];
  tier: "free" | "basic" | "pro" | "premium";
  durationSec: number;
  licensor?: string;
  licenseUrl?: string;
}

const TRACKS: SeedTrack[] = [
  {
    slug: "soft-piano-romance",
    title: "Soft Piano Romance",
    artist: "DavetYolla Library",
    url: "https://cdn.davetyolla.com/music/soft-piano-romance.mp3",
    moods: ["romantic", "elegant"],
    tier: "free",
    durationSec: 145,
    licensor: "Pixabay",
    licenseUrl: "https://pixabay.com/service/license-summary/",
  },
  {
    slug: "warm-acoustic-guitar",
    title: "Warm Acoustic Guitar",
    artist: "DavetYolla Library",
    url: "https://cdn.davetyolla.com/music/warm-acoustic-guitar.mp3",
    moods: ["romantic", "joyful"],
    tier: "free",
    durationSec: 132,
    licensor: "Pixabay",
    licenseUrl: "https://pixabay.com/service/license-summary/",
  },
  {
    slug: "string-quartet-vow",
    title: "String Quartet Vow",
    artist: "DavetYolla Library",
    url: "https://cdn.davetyolla.com/music/string-quartet-vow.mp3",
    moods: ["elegant", "ceremonial"],
    tier: "free",
    durationSec: 168,
    licensor: "Free Music Archive",
    licenseUrl: "https://freemusicarchive.org/License/",
  },
  {
    slug: "boho-clap-along",
    title: "Boho Clap Along",
    artist: "DavetYolla Library",
    url: "https://cdn.davetyolla.com/music/boho-clap-along.mp3",
    moods: ["joyful", "celebration"],
    tier: "free",
    durationSec: 120,
    licensor: "Pixabay",
  },
  {
    slug: "henna-night-percussion",
    title: "Henna Night Percussion",
    artist: "DavetYolla Library",
    url: "https://cdn.davetyolla.com/music/henna-night-percussion.mp3",
    moods: ["traditional", "celebration"],
    tier: "basic",
    durationSec: 154,
    licensor: "DavetYolla Original",
  },
  {
    slug: "anatolian-strings",
    title: "Anatolian Strings",
    artist: "DavetYolla Library",
    url: "https://cdn.davetyolla.com/music/anatolian-strings.mp3",
    moods: ["traditional", "elegant"],
    tier: "basic",
    durationSec: 187,
    licensor: "DavetYolla Original",
  },
  {
    slug: "cinematic-rise",
    title: "Cinematic Rise",
    artist: "DavetYolla Library",
    url: "https://cdn.davetyolla.com/music/cinematic-rise.mp3",
    moods: ["dramatic", "elegant"],
    tier: "pro",
    durationSec: 212,
    licensor: "Pixabay",
  },
  {
    slug: "glass-bells-glow",
    title: "Glass Bells Glow",
    artist: "DavetYolla Library",
    url: "https://cdn.davetyolla.com/music/glass-bells-glow.mp3",
    moods: ["romantic", "dreamy"],
    tier: "pro",
    durationSec: 175,
  },
  {
    slug: "lounge-jazz-after",
    title: "Lounge Jazz After-Party",
    artist: "DavetYolla Library",
    url: "https://cdn.davetyolla.com/music/lounge-jazz-after.mp3",
    moods: ["joyful", "afterparty"],
    tier: "premium",
    durationSec: 240,
    licensor: "DavetYolla Original",
  },
  {
    slug: "synth-vow-modern",
    title: "Synth Vow (Modern)",
    artist: "DavetYolla Library",
    url: "https://cdn.davetyolla.com/music/synth-vow-modern.mp3",
    moods: ["modern", "elegant"],
    tier: "premium",
    durationSec: 198,
  },
];

async function main() {
  let inserted = 0;
  let updated = 0;
  for (const t of TRACKS) {
    const existing = await prisma.musicTrack.findUnique({
      where: { slug: t.slug },
    });
    if (existing) {
      await prisma.musicTrack.update({
        where: { slug: t.slug },
        data: {
          title: t.title,
          artist: t.artist,
          url: t.url,
          moods: t.moods,
          tier: t.tier,
          durationSec: t.durationSec,
          licensor: t.licensor ?? null,
          licenseUrl: t.licenseUrl ?? null,
          enabled: true,
        },
      });
      updated += 1;
    } else {
      await prisma.musicTrack.create({
        data: {
          slug: t.slug,
          title: t.title,
          artist: t.artist,
          url: t.url,
          moods: t.moods,
          tier: t.tier,
          durationSec: t.durationSec,
          licensor: t.licensor ?? null,
          licenseUrl: t.licenseUrl ?? null,
          enabled: true,
        },
      });
      inserted += 1;
    }
  }
  console.log(
    `[seed-music] ${inserted} inserted, ${updated} updated, ${TRACKS.length} total`
  );
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
