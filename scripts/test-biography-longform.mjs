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

function stripTags(value) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function slugify(value) {
  return stripTags(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const componentPath = "components/public-archive/biography-longform-page.tsx";
const wrapperPath = "components/public-archive/biography-public-page.tsx";
const sourcePath = "lib/biography-editorial-pack-v1.ts";
const routePath = "app/(public)/biography/page.tsx";

assert(existsSync(path.join(root, componentPath)), "long-form component", "Biography-specific long-form renderer exists.");

const component = read(componentPath);
const wrapper = read(wrapperPath);
const source = read(sourcePath);
const route = read(routePath);

const expectedChapters = [
  "A Life Worth Remembering",
  "Early Life: The Roots That Shaped a Leader",
  "From Iboogun to Bariga: The Journey That Changed Everything",
  "Building a Dream: The Birth of an Entrepreneur",
  "From Bolekaja to TIOLUWA LASE: A Legacy on the Roads of Lagos",
  "Beyond Business: A Leader Who Served His Community",
  "Family, Responsibility and Sacrifice",
  "The Price of Blind Trust",
  "Later Years: Resilience Through Change",
  "An Enduring Legacy"
];

const sourceH2s = [...source.matchAll(/<h2>(.*?)<\/h2>/g)].map((match) => stripTags(match[1]).replace(/^Chapter\s+\w+:\s*/, ""));
assert(sourceH2s.length === 10, "source chapter count", `Found ${sourceH2s.length} approved h2 chapters.`);
assert(JSON.stringify(sourceH2s) === JSON.stringify(expectedChapters), "source chapter order", "Approved biography chapter order is unchanged.");

for (const chapter of expectedChapters) {
  assert(component.includes(chapter), `chapter listed: ${chapter}`, "Chapter appears in the long-form contents contract.");
}

const expectedAnchors = expectedChapters.map(slugify);
for (const anchor of expectedAnchors) {
  assert(component.includes(anchor), `chapter anchor: ${anchor}`, "Stable chapter anchor is generated from the approved chapter title.");
}

assert(wrapper.includes("BiographyLongformPage") && !wrapper.includes("<CmsPublicPage path=\"/biography\""), "route renderer", "Biography route uses the long-form renderer instead of the generic CMS card renderer.");
assert(component.includes('getPublicCmsCoreRecords("biography"') && component.includes("workspaceId") && component.includes("legacyProfileId"), "tenant scoping", "Long-form renderer keeps scoped public biography queries.");
assert(component.includes('href={`#${chapter.id}`}'), "contents links", "Contents links target stable chapter anchors.");
assert(component.includes("Previous chapter") && component.includes("Next chapter") && component.includes("Back to contents"), "chapter navigation", "Previous, next, and back-to-contents controls are present.");
assert(component.includes("scroll-mt-28"), "anchor offset", "Chapter anchors account for fixed public navigation.");
assert(component.includes("<details") && component.includes("Biography chapters"), "mobile contents", "Mobile contents use an accessible details/summary control.");
assert(component.includes("readingTimeLabel") && component.includes("chapters.length || expectedBiographyChapters.length"), "reading metadata", "Hero supports reading-time and chapter-count metadata.");
assert((component.match(/<h1/g) ?? []).length === 1, "single h1", "Long-form page defines one page-level h1.");
assert(component.includes("dangerouslySetInnerHTML") && component.includes("chapter.bodyHtml"), "approved body rendering", "Only parsed approved chapter body HTML is rendered.");
assert(!component.includes("<Image") && !component.includes("Portrait under editorial review") && !component.includes("placeholder"), "no image placeholder", "No empty image placeholder or unapproved portrait is rendered.");
assert(!component.includes("BIOGRAPHY_EDITORIAL_PACK_v2") && !component.includes("canonical") && !component.includes("openGraph") && !component.includes("twitter"), "metadata task untouched", "Long-form component does not begin canonical/social metadata work.");
assert(!/supabase\/migrations|database\.types|create table|alter table/i.test(component), "no schema work", "Long-form component contains no schema or migration work.");
assert(route.includes("generateMetadata") && route.includes("openGraph") && route.includes("twitter"), "metadata preserved", "Existing biography route metadata remains in the route file.");
assert(source.includes("Biography Editorial Pack v1.0") && component.includes("Biography Editorial Pack v1.0"), "source note", "Public source note remains the approved editorial version label.");
assert(!component.includes("lib/biography-editorial-pack-v1") && !component.includes("biography-editorial-pack-v1.ts"), "no filenames rendered", "Internal implementation filenames are not rendered.");

if (process.exitCode) {
  process.exit(process.exitCode);
}
