import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const SOURCE_PATH = path.join(process.cwd(), "content-source", "approved-content.json");
const REQUIRED_ROOT_ARRAYS = [
  "legacyProfiles",
  "mediaAlbums",
  "mediaItems",
  "biographyChapters",
  "timelineEvents",
  "documentaries",
  "documentaryEpisodes",
  "familyMembers",
  "familyRelationships",
  "lessons",
  "blogPosts"
];

const tableMap = {
  legacyProfiles: {
    table: "legacy_profiles",
    conflict: "slug"
  },
  mediaAlbums: {
    table: "media_albums",
    conflict: "legacy_profile_id,slug"
  },
  mediaItems: {
    table: "media_items",
    conflict: "stable_id"
  },
  biographyChapters: {
    table: "biography_chapters",
    conflict: "legacy_profile_id,slug"
  },
  timelineEvents: {
    table: "timeline_events",
    conflict: "stable_id"
  },
  documentaries: {
    table: "documentaries",
    conflict: "legacy_profile_id,slug"
  },
  documentaryEpisodes: {
    table: "documentary_episodes",
    conflict: "documentary_id,episode_number"
  },
  familyMembers: {
    table: "family_members",
    conflict: "stable_id"
  },
  familyRelationships: {
    table: "family_relationships",
    conflict: "stable_id"
  },
  lessons: {
    table: "lessons",
    conflict: "stable_id"
  },
  blogPosts: {
    table: "blog_posts",
    conflict: "legacy_profile_id,slug"
  }
};

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required for content import.`);
  }
  return value;
}

function assertAllowedPublishState(item, collectionName) {
  if (item.publish_state === "published" && item.verification_status !== "verified") {
    throw new Error(
      `${collectionName}:${item.slug ?? item.stable_id ?? item.title} is marked published without verified status.`
    );
  }
}

function assertMetadata(item, collectionName) {
  const id = item.slug ?? item.stable_id ?? item.title ?? "unknown item";
  const missing = [];

  if (!item.privacy_state) missing.push("privacy_state");
  if (!item.verification_status) missing.push("verification_status");
  if (!item.source_reference) missing.push("source_reference");
  if (!item.copyright_status) missing.push("copyright_status");

  if (missing.length > 0) {
    throw new Error(`${collectionName}:${id} is missing required metadata: ${missing.join(", ")}.`);
  }

  assertAllowedPublishState(item, collectionName);
}

async function readSource() {
  let raw;
  try {
    raw = await readFile(SOURCE_PATH, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Approved content file not found: ${SOURCE_PATH}`);
    }
    throw error;
  }

  const source = JSON.parse(raw);
  for (const key of REQUIRED_ROOT_ARRAYS) {
    if (!Array.isArray(source[key])) {
      source[key] = [];
    }
  }
  return source;
}

async function upsertCollection(supabase, collectionName, rows) {
  if (rows.length === 0) {
    return { inserted: 0, skipped: true };
  }

  rows.forEach((row) => assertMetadata(row, collectionName));

  const config = tableMap[collectionName];
  const { error } = await supabase.from(config.table).upsert(rows, {
    onConflict: config.conflict,
    ignoreDuplicates: false
  });

  if (error) {
    throw new Error(`${collectionName} import failed: ${error.message}`);
  }

  return { inserted: rows.length, skipped: false };
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const source = await readSource();

  if (dryRun) {
    for (const key of REQUIRED_ROOT_ARRAYS) {
      source[key].forEach((row) => assertMetadata(row, key));
      console.log(`${key}: ${source[key].length} item(s) validated`);
    }
    console.log("Dry run complete. No Supabase writes performed.");
    return;
  }

  const supabase = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  for (const key of REQUIRED_ROOT_ARRAYS) {
    const result = await upsertCollection(supabase, key, source[key]);
    console.log(`${key}: ${result.inserted} item(s) ${result.skipped ? "skipped" : "upserted"}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
