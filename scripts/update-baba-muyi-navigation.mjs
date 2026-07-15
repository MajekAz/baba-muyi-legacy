import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";

const envFiles = [".env.local", ".env"];

for (const file of envFiles) {
  if (!existsSync(file)) continue;

  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
    }
  }
}

function requireSecret(name) {
  const value = process.env[name]?.trim();
  if (!value || value.startsWith("your-") || value.includes("placeholder")) {
    throw new Error(`${name} is required and must not be a placeholder.`);
  }
  return value;
}

const desiredMenus = {
  header: "Header Menu",
  mobile: "Mobile Menu",
  footer: "Footer Menu"
};

const desiredItems = [
  {
    label: "Home",
    slug: "home",
    url: "/",
    children: []
  },
  {
    label: "His Story",
    slug: "his-story",
    url: "/biography",
    children: [
      ["Biography", "biography", "/biography"],
      ["Timeline", "timeline", "/timeline"],
      ["Early Life", "early-life", "/early-life"],
      ["Journey to Bariga", "journey-to-bariga", "/journey-to-bariga"],
      ["Community Leadership", "community-leadership", "/community-leadership"]
    ]
  },
  {
    label: "Transport Legacy",
    slug: "transport-legacy",
    url: "/bolekaja",
    children: [
      ["Bolekaja Era", "bolekaja-era", "/bolekaja"],
      ["TIOLUWA LASE Molue Era", "tioluwa-lase-molue-era", "/tioluwa-lase-molue"],
      ["Routes and Locations", "routes-and-locations", "/routes-and-locations"],
      ["Transport Gallery", "transport-gallery", "/transport-gallery"]
    ]
  },
  {
    label: "Media",
    slug: "media",
    url: "/documentaries",
    children: [
      ["Documentary", "documentary", "/documentaries"],
      ["Photo Archive", "photo-archive", "/gallery"],
      ["Audio", "audio", "/archive"],
      ["Historical Documents", "historical-documents", "/documents"]
    ]
  },
  {
    label: "Legacy",
    slug: "legacy",
    url: "/family-tree",
    children: [
      ["Family Legacy", "family-legacy", "/family-tree"],
      ["Lessons", "lessons", "/lessons"],
      ["Community Memories", "community-memories", "/family-memories"],
      ["Digital Archive", "digital-archive", "/archive"]
    ]
  },
  {
    label: "About",
    slug: "about",
    url: "/curator",
    children: [
      ["About Baba Muyi", "about-baba-muyi", "/biography"],
      ["About the Curator", "about-the-curator", "/curator"],
      ["About the Legacy Project", "about-the-legacy-project", "/about"],
      ["About LegacyHub", "about-legacyhub", "/legacyhub"]
    ]
  }
];

const supabase = createClient(
  requireSecret("NEXT_PUBLIC_SUPABASE_URL"),
  requireSecret("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const workspaceSlug = process.env.LEGACYHUB_WORKSPACE_SLUG?.trim() || "baba-muyi-family-archive";
const legacyProfileSlug = process.env.LEGACYHUB_LEGACY_PROFILE_SLUG?.trim() || "baba-muyi";

function pickExisting(items, usedIds, item, parentItemId) {
  const parentMatches = (candidate) => (candidate.parent_item_id ?? null) === (parentItemId ?? null);
  const exactSlug = items.find((candidate) => !usedIds.has(candidate.id) && parentMatches(candidate) && candidate.slug === item.slug);
  if (exactSlug) return exactSlug;

  const exactUrl = items.find((candidate) => !usedIds.has(candidate.id) && candidate.url === item.url);
  if (exactUrl) return exactUrl;

  return items.find((candidate) => !usedIds.has(candidate.id) && parentMatches(candidate) && candidate.label === item.label) ?? null;
}

async function upsertMenu(location, workspaceId, legacyProfileId) {
  const { data: existingMenus, error: menuReadError } = await supabase
    .from("menus")
    .select("id, slug")
    .eq("workspace_id", workspaceId)
    .eq("legacy_profile_id", legacyProfileId)
    .eq("location", location);

  if (menuReadError) throw menuReadError;

  let menu = existingMenus?.[0] ?? null;

  if (menu) {
    const { error } = await supabase
      .from("menus")
      .update({ name: desiredMenus[location], publish_state: "published" })
      .eq("id", menu.id);
    if (error) throw error;
  } else {
    const { data, error } = await supabase
      .from("menus")
      .insert({
        workspace_id: workspaceId,
        legacy_profile_id: legacyProfileId,
        name: desiredMenus[location],
        slug: location,
        location,
        publish_state: "published"
      })
      .select("id, slug")
      .single();
    if (error) throw error;
    menu = data;
  }

  const duplicateMenus = (existingMenus ?? []).filter((candidate) => candidate.id !== menu.id);
  for (const duplicate of duplicateMenus) {
    const { error } = await supabase.from("menus").update({ publish_state: "archived" }).eq("id", duplicate.id);
    if (error) throw error;
  }

  const { data: existingItems, error: itemReadError } = await supabase
    .from("menu_items")
    .select("id, label, slug, url, parent_item_id")
    .eq("menu_id", menu.id);

  if (itemReadError) throw itemReadError;

  const usedIds = new Set();
  const activeIds = new Set();
  const parentIds = new Map();

  for (const [index, item] of desiredItems.entries()) {
    const existing = pickExisting(existingItems ?? [], usedIds, item, null);
    const payload = {
      menu_id: menu.id,
      parent_item_id: null,
      label: item.label,
      slug: item.slug,
      url: item.url,
      link_type: "internal",
      sort_order: (index + 1) * 10,
      publish_state: "published",
      visibility: "public",
      open_in_new_tab: false,
      required_role: null
    };

    let id = existing?.id;
    if (id) {
      usedIds.add(id);
      const { error } = await supabase.from("menu_items").update(payload).eq("id", id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from("menu_items").insert(payload).select("id").single();
      if (error) throw error;
      id = data.id;
    }

    activeIds.add(id);
    parentIds.set(item.slug, id);
  }

  for (const parent of desiredItems) {
    const parentItemId = parentIds.get(parent.slug);
    for (const [childIndex, [label, slug, url]] of parent.children.entries()) {
      const item = { label, slug, url };
      const existing = pickExisting(existingItems ?? [], usedIds, item, parentItemId);
      const payload = {
        menu_id: menu.id,
        parent_item_id: parentItemId,
        label,
        slug,
        url,
        link_type: "internal",
        sort_order: (childIndex + 1) * 10,
        publish_state: "published",
        visibility: "public",
        open_in_new_tab: false,
        required_role: null
      };

      let id = existing?.id;
      if (id) {
        usedIds.add(id);
        const { error } = await supabase.from("menu_items").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("menu_items").insert(payload).select("id").single();
        if (error) throw error;
        id = data.id;
      }

      activeIds.add(id);
    }
  }

  const inactiveIds = (existingItems ?? [])
    .map((item) => item.id)
    .filter((id) => !activeIds.has(id));

  if (inactiveIds.length) {
    const { error } = await supabase
      .from("menu_items")
      .update({ publish_state: "archived" })
      .in("id", inactiveIds);
    if (error) throw error;
  }

  return {
    location,
    activeItems: activeIds.size,
    archivedItems: inactiveIds.length,
    archivedDuplicateMenus: duplicateMenus.length
  };
}

async function main() {
  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("id, name, slug")
    .eq("slug", workspaceSlug)
    .single();
  if (workspaceError) throw workspaceError;

  const { data: legacyProfile, error: legacyProfileError } = await supabase
    .from("legacy_profiles")
    .select("id, display_name, slug")
    .eq("workspace_id", workspace.id)
    .eq("slug", legacyProfileSlug)
    .single();
  if (legacyProfileError) throw legacyProfileError;

  const results = [];
  for (const location of Object.keys(desiredMenus)) {
    results.push(await upsertMenu(location, workspace.id, legacyProfile.id));
  }

  console.log(JSON.stringify({
    workspace: workspace.name,
    legacyProfile: legacyProfile.display_name,
    results
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ error: error.message, code: error.code ?? null }, null, 2));
  process.exit(1);
});
