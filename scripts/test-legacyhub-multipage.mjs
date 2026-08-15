import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function pass(name, detail) {
  console.log(`PASS ${name}: ${detail}`);
}

function assert(condition, name, detail) {
  if (!condition) {
    console.error(`FAIL ${name}: ${detail}`);
    process.exitCode = 1;
    return;
  }
  pass(name, detail);
}

const routeFiles = [
  ["app/(platform)/legacyhub/page.tsx", "/legacyhub"],
  ["app/(platform)/legacyhub/mission/page.tsx", "/legacyhub/mission"],
  ["app/(platform)/legacyhub/who-it-is-for/page.tsx", "/legacyhub/who-it-is-for"],
  ["app/(platform)/legacyhub/capabilities/page.tsx", "/legacyhub/capabilities"],
  ["app/(platform)/legacyhub/flagship-archive/page.tsx", "/legacyhub/flagship-archive"],
  ["app/(platform)/legacyhub/roadmap/page.tsx", "/legacyhub/roadmap"],
  ["app/(platform)/legacyhub/about/page.tsx", "/legacyhub/about"],
  ["app/(platform)/legacyhub/early-access/page.tsx", "/legacyhub/early-access"],
  ["app/(platform)/legacyhub/privacy/page.tsx", "/legacyhub/privacy"],
  ["app/(platform)/legacyhub/contact/page.tsx", "/legacyhub/contact"]
];

const expectedNav = [
  ["Mission", "/legacyhub/mission"],
  ["Who It Is For", "/legacyhub/who-it-is-for"],
  ["Capabilities", "/legacyhub/capabilities"],
  ["Flagship Archive", "/legacyhub/flagship-archive"],
  ["Roadmap", "/legacyhub/roadmap"],
  ["About", "/legacyhub/about"],
  ["Early Access", "/legacyhub/early-access"]
];

const hashAnchors = [
  "#mission",
  "#who-it-is-for",
  "#capabilities",
  "#flagship-archive",
  "#roadmap",
  "#about",
  "#early-access"
];

const home = read("app/(platform)/legacyhub/page.tsx");
const header = read("components/legacyhub/platform-header.tsx");
const shell = read("components/legacyhub/platform-shell.tsx");
const publicLayout = read("app/(public)/layout.tsx");
const platformLayout = read("app/(platform)/layout.tsx");
const adminLayout = read("app/admin/layout.tsx");
const loginPage = read("app/login/page.tsx");
const platformData = read("lib/legacyhub-platform.ts");

for (const [file, route] of routeFiles) {
  const source = read(file);
  assert(exists(file), `${route} route`, `${file} exists and resolves as an App Router page.`);
  assert(source.includes("robots: { index: false, follow: true }"), `${route} noindex`, "Noindex remains enabled.");
  assert(source.includes("canonical"), `${route} canonical`, "Route has canonical metadata.");
}

for (const [label, href] of expectedNav) {
  assert(platformData.includes(`label: "${label}"`) && platformData.includes(`href: "${href}"`), `${label} navigation route`, `Primary nav points to ${href}.`);
  if (label !== "About") {
    assert(home.includes(`href: "${href}"`) || home.includes(`href=${href}`) || home.includes(`href="${href}"`), `${label} homepage link`, `Homepage links to ${href}.`);
  }
}

for (const anchor of hashAnchors) {
  assert(!header.includes(anchor) && !platformData.includes(anchor) && !home.includes(anchor), `${anchor} absent`, "Primary platform routing does not use homepage hash anchors.");
}

assert(header.includes("usePathname") && header.includes("aria-current"), "active route state", "Platform navigation uses pathname-based active state.");
assert(header.includes("LegacyHub mobile platform navigation") && header.includes("<details"), "mobile navigation", "Mobile platform nav is a disclosure using route links.");
assert(shell.includes("PlatformHeader") && shell.includes("PlatformFooter"), "platform shell", "Platform shell wraps platform pages.");
assert(platformLayout.includes("PlatformShell") && !platformLayout.includes("PublicNavigation"), "platform layout separation", "Platform routes use the platform shell.");
assert(publicLayout.includes("PublicNavigation") && !publicLayout.includes("PlatformHeader"), "public layout separation", "Baba Muyi public shell is separate.");
assert(adminLayout.includes("AdminShell") && !adminLayout.includes("PlatformShell") && !adminLayout.includes("PublicNavigation"), "admin shell separation", "Admin routes do not render public or platform chrome.");
assert(loginPage.includes("platformBrand") && loginPage.includes("PageShell") && !loginPage.includes("PublicNavigation") && !loginPage.includes("PlatformShell"), "auth shell separation", "Login remains LegacyHub-branded without public/platform shells.");

assert(!home.includes("<EarlyAccessForm"), "homepage form omitted", "Full early-access form is only on the dedicated page.");
assert(read("app/(platform)/legacyhub/early-access/page.tsx").includes("<EarlyAccessForm"), "early access form route", "Dedicated early-access page contains the full form.");
assert(!home.includes("audienceGroups.map"), "homepage audience list omitted", "Homepage does not render all audience content.");
assert(!home.includes("currentCapabilities") && !home.includes("plannedCapabilities"), "homepage capability lists omitted", "Homepage does not render the full current/planned capability lists.");
assert(!home.includes("processSteps.map") && !home.includes("milestoneFourAreas.map"), "homepage roadmap/process lists omitted", "Homepage does not render full process or roadmap lists.");

assert(read("app/(platform)/legacyhub/mission/page.tsx").includes("legacyHubValues") && read("app/(platform)/legacyhub/mission/page.tsx").includes("missionStatement"), "mission full content", "Mission page keeps mission and values content.");
assert(read("app/(platform)/legacyhub/who-it-is-for/page.tsx").includes("audienceGroups.map"), "audience full content", "Who It Is For page renders the full audience groups.");
assert(read("app/(platform)/legacyhub/capabilities/page.tsx").includes("currentCapabilities") && read("app/(platform)/legacyhub/capabilities/page.tsx").includes("plannedCapabilities"), "capabilities full content", "Capabilities page renders current and planned capabilities.");
assert(read("app/(platform)/legacyhub/flagship-archive/page.tsx").includes("flagshipPreviews"), "flagship full content", "Flagship page keeps Baba Muyi archive route previews.");
assert(read("app/(platform)/legacyhub/roadmap/page.tsx").includes("completedRoadmapStages") && read("app/(platform)/legacyhub/roadmap/page.tsx").includes("futurePhases"), "roadmap full content", "Roadmap page keeps roadmap content.");
assert(read("app/(platform)/legacyhub/about/page.tsx").includes("Why LegacyHub was created") && read("app/(platform)/legacyhub/about/page.tsx").includes("Tioluwalase Majekodunmi inspired the platform"), "about full content", "About page keeps platform/founder-context content.");
assert(read("app/(platform)/legacyhub/privacy/page.tsx").includes("preliminary product privacy notice"), "privacy route content", "Privacy route resolves with its preliminary privacy content.");
assert(read("app/(platform)/legacyhub/contact/page.tsx").includes("No telephone number"), "contact route content", "Contact route resolves without invented details.");
assert(!home.includes("Create account") && !home.includes("Start free trial") && !home.includes("Sign up"), "public registration disabled", "Homepage does not introduce registration language.");

if (process.exitCode) {
  process.exit(process.exitCode);
}
