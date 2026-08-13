import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => readFileSync(path.join(root, file), "utf8");

function assert(condition, label, detail) {
  if (!condition) {
    console.error(`FAIL ${label}: ${detail}`);
    process.exitCode = 1;
    return;
  }
  console.log(`PASS ${label}: ${detail}`);
}

function publicRouteFile(href) {
  const pathname = href.split("#")[0];
  if (pathname === "/") return "app/(public)/page.tsx";
  return `app/(public)${pathname}/page.tsx`;
}

function collectHrefs(source) {
  return [...source.matchAll(/href:\s*"([^"]+)"/g)].map((match) => match[1]);
}

const home = read("app/(public)/page.tsx");
const publicLayout = read("app/(public)/layout.tsx");
const platformLayout = read("app/(platform)/layout.tsx");
const adminLayout = read("app/admin/layout.tsx");
const homepage = read("components/public-archive/homepage.tsx");
const archiveContent = read("lib/baba-muyi-public-archive.ts");
const navigation = read("lib/navigation.ts");
const publicNavigationSource = navigation.split("export const adminNavigation")[0];
const packageJson = read("package.json");

assert(existsSync(path.join(root, "app/(public)/page.tsx")), "homepage route", "Baba Muyi homepage route exists.");
assert(home.includes("BabaMuyiCinematicHome"), "cinematic homepage", "Homepage uses the Milestone 4 cinematic archive component.");
assert(home.includes('getHomepagePreviewRecords("timeline", context)') && home.includes("publicOnly: true"), "published timeline source", "Timeline preview uses scoped published CMS records.");
assert(home.includes('getHomepagePreviewRecords("lessons", context)') && home.includes("publicOnly: true"), "published lessons source", "Lessons preview uses scoped published CMS records.");
assert(home.includes('getHomepagePreviewRecords("stories", context)') && home.includes("publicOnly: true"), "published stories source", "Stories preview uses scoped published CMS records.");
assert(home.includes("getPublicMediaRecords({ type: \"image\" })"), "public media source", "Hero image uses existing public Media Library query.");
assert(home.includes("getActiveCmsWorkspaceContext"), "tenant scoping", "Homepage reads active workspace and legacy-profile context.");

assert(publicLayout.includes("PublicNavigation") && publicLayout.includes("robots:") && publicLayout.includes("index: false"), "public shell noindex", "Baba Muyi public shell remains separate and noindex.");
assert(!publicLayout.includes("PlatformHeader") && !publicLayout.includes("AdminShell"), "shell separation", "Public layout does not import platform or admin shells.");
assert(platformLayout.includes("PlatformShell") && !platformLayout.includes("PublicNavigation"), "platform shell separation", "LegacyHub platform shell remains separate.");
assert(adminLayout.includes("AdminShell") && !adminLayout.includes("PublicNavigation"), "admin shell separation", "Admin shell remains separate.");

assert((homepage.match(/<h1/g) ?? []).length === 1, "single h1", "Cinematic homepage component defines exactly one h1.");
assert(homepage.includes("break-words") && homepage.includes("motion-reduce"), "responsive safeguards", "Hero heading wraps and motion respects reduced-motion.");
assert(home.includes("type=\"application/ld+json\"") && home.includes("JSON.stringify(homepageJsonLd())"), "structured data", "Homepage emits JSON-LD through a serialized schema object.");
assert(!homepage.includes("dangerouslySetInnerHTML"), "safe rendering", "Homepage component does not render raw unsanitised HTML.");
assert(!/storage\/v1\/object|token=|SUPABASE_SERVICE_ROLE_KEY|LEGACYHUB_OWNER_PASSWORD/.test(homepage + archiveContent), "private media and secrets", "Homepage/content config contains no private storage URLs or secrets.");
assert(!/register|sign up|create account|create workspace/i.test(homepage + archiveContent), "no public registration", "Homepage does not introduce public registration or workspace creation.");
assert(
  home.includes("The Life of Alhaji Tioluwalase Majekodunmi") &&
  home.includes("Explore the life, transport history, family story, values and enduring legacy"),
  "homepage metadata",
  "Homepage metadata uses the approved editorial title and description."
);

const hrefs = new Set([...collectHrefs(archiveContent), ...collectHrefs(publicNavigationSource)]);
const internalPublicHrefs = [...hrefs].filter((href) => href.startsWith("/") && !href.startsWith("/legacyhub") && href !== "/admin");
const missing = internalPublicHrefs.filter((href) => !existsSync(path.join(root, publicRouteFile(href))));
assert(missing.length === 0, "public navigation links", missing.length ? `Missing route files: ${missing.join(", ")}` : "All public archive links resolve to existing route files.");

assert(
  navigation.includes('label: "Biography"') &&
  navigation.includes('label: "Timeline"') &&
  navigation.includes('label: "Gallery"') &&
  navigation.includes('label: "Documentary"') &&
  navigation.includes('label: "Legacy"') &&
  navigation.includes('label: "About"'),
  "information architecture",
  "Fallback public navigation matches the simplified public archive route structure."
);
assert(!homepage.includes("Portrait under editorial review"), "hero fallback", "Hero does not render an empty portrait placeholder when no approved public portrait exists.");
assert(
  archiveContent.includes("The Legacy of Alhaji Tioluwalase") &&
  archiveContent.includes("Entrepreneur. Community Leader. Family Patriarch. A Life Preserved for Future Generations.") &&
  homepage.includes("The Man Behind the Legacy") &&
  homepage.includes("A Life Through Time") &&
  homepage.includes("His Story on Film") &&
  homepage.includes("Moments Preserved") &&
  homepage.includes("Wisdom That Endures") &&
  homepage.includes("Voices of Those He Touched") &&
  homepage.includes("Preserving a Life for Future Generations"),
  "approved editorial content",
  "Homepage uses approved editorial section titles and hero copy."
);
assert(homepage.includes("The documentary area is reserved for approved film records"), "publication safeguard copy", "Documentary section explains publication safeguards.");
assert(homepage.includes("Relatives, friends, neighbours, associates, and community members are invited"), "memory contribution copy", "Memory section invites reviewed public contributions respectfully.");

assert(packageJson.includes("\"test:milestone4-public-home\""), "package script", "Milestone 4 public homepage test command is registered.");

if (process.exitCode) {
  process.exit(process.exitCode);
}
