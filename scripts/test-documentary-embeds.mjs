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

const componentPath = "components/public-archive/documentaries-public-page.tsx";
const routePath = "app/(public)/documentaries/page.tsx";
const sourcePath = "lib/baba-muyi-editorial-content-v1.ts";
const seedPath = "lib/cms-seed.ts";
const dataPath = "data/cms.json";

assert(existsSync(path.join(root, componentPath)), "documentary component", "Documentary-specific public renderer exists.");

const component = read(componentPath);
const route = read(routePath);
const source = read(sourcePath);
const seed = read(seedPath);
const data = read(dataPath);
const combined = [component, route, source, seed, data].join("\n");

assert(route.includes("DocumentariesPublicPage") && !route.includes("CmsPublicPage path=\"/documentaries\""), "route renderer", "Documentaries route uses the YouTube-aware renderer.");
assert(component.includes("getPublishedCmsContent(\"documentary\", \"/documentaries\")"), "cms precedence", "Renderer reads scoped published documentary records.");
assert(component.includes("BW_t_CwFV60") && source.includes("BW_t_CwFV60") && seed.includes("BW_t_CwFV60") && data.includes("BW_t_CwFV60"), "video one id", "Approved Video 1 ID is present across renderer and fallback records.");
assert(component.includes("pszhSQ9SaJo") && source.includes("pszhSQ9SaJo") && seed.includes("pszhSQ9SaJo") && data.includes("pszhSQ9SaJo"), "video two id", "Approved Video 2 ID is present across renderer and fallback records.");
assert(component.includes("start=72&rel=0") && component.includes("start=19&rel=0"), "start times", "Approved start-time parameters are preserved.");
assert(!component.includes("loop=") && !component.includes("playlist=") && !combined.includes("YouTube API key"), "no loop playlist api", "No loop, playlist workaround, or YouTube API key is introduced.");
assert((component.match(/youtube-nocookie\.com/g) ?? []).length >= 2, "privacy-enhanced embeds", "Iframe embeds use youtube-nocookie.com.");
assert(!component.includes("youtube.com/embed/"), "standard embed absent", "Standard youtube.com embed host is not used for iframe playback.");
assert(component.includes("watch?v=BW_t_CwFV60&t=72s") && component.includes("watch?v=pszhSQ9SaJo&t=19s"), "fallback links", "Both public YouTube fallback links are available.");
const iframeTitles = [...component.matchAll(/iframeTitle: "([^"]+)"/g)].map((match) => match[1]);
assert(iframeTitles.length === 2 && new Set(iframeTitles).size === 2 && component.includes("title={video.iframeTitle}"), "iframe titles", "Players use unique meaningful iframe titles.");
assert(component.includes("aspect-video w-full"), "responsive embeds", "Players use responsive 16:9 embed containers.");
assert(!/autoplay=1|autoplay;\s*encrypted/i.test(component), "no autoplay parameter", "No autoplay query parameter is added.");
assert(component.includes("allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\""), "iframe permissions", "Iframe allow list matches YouTube playback needs without adding scripts.");
assert(component.includes("rel=\"noopener noreferrer\"") && component.includes("target=\"_blank\""), "external link safety", "External fallback links use safe target and rel attributes.");
assert(component.includes("Approved documentary recordings are available below"), "public wording", "Page no longer suggests approved playback is unavailable.");
assert(combined.includes("The Biography of Alhaji Tioluwalase “Baba Muyi” Majekodunmi — Humanity, Compassion and Discipline"), "video one readable title", "Video 1 uses the approved readable title without changing meaning.");
assert(combined.includes("The Legacy of Alhaji Tioluwalase “Baba Muyi” Majekodunmi — From Bariga Forest to Fleet"), "video two readable title", "Video 2 uses the approved normalized title without adding facts.");
assert(!combined.includes("Transcript available") && !combined.includes("Subtitles available"), "no fake transcript subtitle claims", "No transcript or subtitle availability is invented.");
assert(!combined.includes("signedUrl") && !combined.includes("supabase.co/storage"), "no signed storage URLs", "Documentary embed work does not use signed Supabase storage URLs.");
assert(!combined.includes("BIOGRAPHY_EDITORIAL_PACK_v2"), "no biography v2 work", "Biography v2 work was not started.");
assert(!combined.includes("supabase/migrations") && !/create table|alter table/i.test(combined), "no schema work", "Documentary embed files contain no schema or migration work.");
assert(source.includes("Baba Muyi Documentaries | Tioluwalase Majekodunmi"), "metadata title", "Documentary metadata uses the approved Baba Muyi title.");
assert(source.includes("Watch approved documentary records exploring Baba Muyi’s biography"), "metadata description", "Documentary metadata uses the approved description.");

if (process.exitCode) {
  process.exit(process.exitCode);
}
