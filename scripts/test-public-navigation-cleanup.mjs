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

const bannedLinkedRoutes = [
  "/early-life",
  "/journey-to-bariga",
  "/community-leadership",
  "/bolekaja",
  "/tioluwa-lase-molue",
  "/transport-gallery",
  "/documents",
  "/family",
  "/archive/documents",
  "/stories",
  "/journey-map",
  "/routes-and-locations",
  "/transcripts",
  "/documentary-episodes",
  "/trailer-clips",
  "/english-documentary"
];

const routeTargets = read("lib/public-route-targets.ts");
const navigation = read("lib/navigation.ts");
const homepage = read("components/public-archive/homepage.tsx");
const homepageRoute = read("app/(public)/page.tsx");
const archiveContent = read("lib/baba-muyi-public-archive.ts");
const cmsStore = read("lib/cms-store.ts");
const cmsSeed = read("lib/cms-seed.ts");
const statusCard = read("components/status-card.tsx");
const publicMediaGrid = read("components/media/public-media-grid.tsx");
const mediaQueries = read("lib/media/queries.ts");
const sitemap = read("app/sitemap.ts");
const editorialContent = read("lib/baba-muyi-editorial-content-v1.ts");
const documentaryPage = read("components/public-archive/documentaries-public-page.tsx");
const nextConfig = read("next.config.ts");
const data = JSON.parse(read("data/cms.json"));
const sourceBundle = [
  routeTargets,
  navigation,
  homepage,
  homepageRoute,
  archiveContent,
  cmsStore,
  cmsSeed,
  statusCard,
  sitemap,
  editorialContent,
  documentaryPage,
  read("data/cms.json")
].join("\n");

assert(routeTargets.includes("/biography#early-life-the-roots-that-shaped-a-leader"), "early-life anchor", "Early Life routes point to the approved biography chapter anchor.");
assert(routeTargets.includes("/biography#from-iboogun-to-bariga-the-journey-that-changed-everything"), "bariga anchor", "Journey to Bariga routes point to the approved biography chapter anchor.");
assert(routeTargets.includes("/biography#beyond-business-a-leader-who-served-his-community"), "community anchor", "Community Leadership routes point to the approved biography chapter anchor.");
assert(routeTargets.includes("/biography#from-bolekaja-to-tioluwa-lase-a-legacy-on-the-roads-of-lagos"), "transport anchor", "Bolekaja and TIOLUWA LASE routes point to the approved biography transport chapter.");

for (const route of ["/early-life", "/journey-to-bariga", "/community-leadership", "/bolekaja", "/tioluwa-lase-molue"]) {
  const pagePath = `app/(public)${route}/page.tsx`;
  assert(existsSync(path.join(root, pagePath)) && read(pagePath).includes("permanentRedirect"), `redirect ${route}`, `${route} preserves the URL with a permanent redirect.`);
}

for (const route of ["/family", "/transport-gallery", "/documents", "/journey-map", "/transcripts"]) {
  const pagePath = `app/(public)${route}/page.tsx`;
  assert(existsSync(path.join(root, pagePath)) && read(pagePath).includes("permanentRedirect"), `redirect ${route}`, `${route} no longer renders a placeholder public page.`);
}

for (const [source, destination] of [
  ["/early-life", "/biography#early-life-the-roots-that-shaped-a-leader"],
  ["/journey-to-bariga", "/biography#from-iboogun-to-bariga-the-journey-that-changed-everything"],
  ["/community-leadership", "/biography#beyond-business-a-leader-who-served-his-community"],
  ["/bolekaja", "/biography#from-bolekaja-to-tioluwa-lase-a-legacy-on-the-roads-of-lagos"],
  ["/tioluwa-lase-molue", "/biography#from-bolekaja-to-tioluwa-lase-a-legacy-on-the-roads-of-lagos"],
  ["/family", "/gallery"],
  ["/transport-gallery", "/gallery"],
  ["/documents", "/gallery"],
  ["/journey-map", "/timeline"],
  ["/transcripts", "/documentaries"]
]) {
  assert(
    nextConfig.includes(`source: "${source}"`) && nextConfig.includes(`destination: "${destination}"`),
    `next redirect ${source}`,
    `${source} is registered as a Next.js server redirect to ${destination}.`
  );
}

const visibleMenuItems = (data.menuItems ?? []).filter((item) => item.status === "published" && !item.hidden && ["header", "mobile", "footer"].includes(item.location));
for (const route of bannedLinkedRoutes) {
  assert(!visibleMenuItems.some((item) => item.href === route), `menu excludes ${route}`, `No visible public CMS menu item links directly to ${route}.`);
}

for (const location of ["header", "mobile", "footer"]) {
  for (const label of ["Family", "Transport", "Documents"]) {
    const matches = visibleMenuItems.filter((item) => item.location === location && item.label === label);
    assert(matches.length > 0, `${location} gallery label ${label}`, `${label} is present in the ${location} Gallery navigation.`);
    assert(matches.every((item) => item.href === "/gallery"), `${location} gallery target ${label}`, `${label} points to /gallery in ${location} navigation.`);
  }
}

assert((data.menuItems ?? []).filter((item) => item.label === "Stories" && ["header", "mobile", "footer"].includes(item.location)).every((item) => item.hidden), "stories hidden", "Stories remains available as a route but is removed from public navigation until populated.");
assert(!navigation.includes('href: "/stories"'), "static navigation stories", "Static public navigation does not expose the empty Stories route.");
assert(navigation.includes('{ label: "Family", href: "/gallery" }') && navigation.includes('{ label: "Transport", href: "/gallery" }') && navigation.includes('{ label: "Documents", href: "/gallery" }'), "static gallery navigation", "Static Gallery dropdown sends Family, Transport, and Documents to /gallery.");
assert(archiveContent.includes('href: "/tributes"') && !archiveContent.includes('href: "/stories"'), "homepage stories card", "Homepage stories/tributes preview points to Tributes instead of the empty Stories page.");

assert(!homepageRoute.includes("heroImage={images[0]}"), "hero portrait removed", "Homepage no longer uses the first public media item as the Baba Muyi hero portrait.");
assert(!homepageRoute.includes("openGraphImage") && !homepageRoute.includes("summary_large_image"), "homepage social image removed", "Homepage metadata no longer uses an unverified first media item as OG/Twitter image.");
assert(homepageRoute.includes("galleryImages={images.slice(0, 3)}"), "homepage gallery slice", "Homepage gallery previews use the filtered public media set.");
assert(mediaQueries.includes("isKnownUnverifiedBabaMuyiPublicMedia") && mediaQueries.includes('title === "my pix"') && mediaQueries.includes('altText === "my pix archive image"') && mediaQueries.includes("48497ddc-9fec-42d2-974b-eb87569a5c3f-my-pix.jpeg"), "my pix filter", "Known unverified My Pix media is excluded from public media rendering before signed URLs are created.");
assert(publicMediaGrid.includes("Images awaiting archive approval") && publicMediaGrid.includes("Approved family photographs and historical images will appear here as they are reviewed, identified, and cleared for public archive use."), "gallery empty state", "Gallery empty state remains dignified when no approved public images are available.");

for (const phrase of ["PLANNED CONTENT MODEL READY", "planned content model", "Under editorial review", "reusable biography landing page", "archive section will open", "model ready"]) {
  assert(!sourceBundle.toLowerCase().includes(phrase.toLowerCase()), `phrase removed: ${phrase}`, `${phrase} is absent from public fallback/rendering sources.`);
}

for (const route of ["/documents", "/archive/documents", "/transport-gallery", "/bolekaja", "/tioluwa-lase-molue", "/journey-map", "/family-tree", "/waiting-list"]) {
  assert(!sitemap.includes(`"${route}"`), `sitemap excludes ${route}`, `${route} is not advertised as an independent public sitemap destination.`);
}

assert(editorialContent.includes('href: "/gallery"') && !editorialContent.includes('href: "/transport-gallery"'), "editorial gallery links", "Editorial gallery cards link to populated Gallery rather than placeholder category pages.");
assert(editorialContent.includes('href: "/documentaries"') && !editorialContent.includes('href: "/transcripts"'), "editorial documentary links", "Documentary support card links back to populated Documentaries.");
assert(cmsStore.includes("normalizePublicHref") && cmsStore.includes("isHiddenPublicNavigationHref"), "remote menu normalization", "CMS-driven menus are normalized for local and Supabase menu sources.");
assert(statusCard.includes("Archive note") && !statusCard.includes("Planned content model ready"), "status card copy", "StatusCard no longer renders internal product terminology by default.");
assert(sourceBundle.includes("youtube-nocookie.com/embed/BW_t_CwFV60?start=72&rel=0"), "documentary preserved", "Approved documentary embed one remains intact.");
assert(sourceBundle.includes("youtube-nocookie.com/embed/pszhSQ9SaJo?start=19&rel=0"), "documentary two preserved", "Approved documentary embed two remains intact.");

if (process.exitCode) {
  process.exit(process.exitCode);
}
