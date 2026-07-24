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

const routes = [
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

const home = read("app/(platform)/legacyhub/page.tsx");
const header = read("components/legacyhub/platform-header.tsx");
const shell = read("components/legacyhub/platform-shell.tsx");
const form = read("components/legacyhub/early-access-form.tsx");
const actions = read("lib/actions.ts");
const schemas = read("lib/validation/forms.ts");
const data = read("lib/legacyhub-platform.ts");

for (const [file, route] of routes) {
  const source = read(file);
  assert(exists(file), `${route} route`, `${file} exists.`);
  assert(source.includes("robots: { index: false, follow: true }"), `${route} noindex`, "Platform page remains noindex until launch approval.");
  assert(source.includes("canonical"), `${route} canonical`, "Route has canonical metadata.");
}

assert(exists("app/(platform)/layout.tsx"), "platform layout", "A dedicated platform layout exists.");
assert(!exists("app/(public)/legacyhub/page.tsx"), "Baba Muyi shell separation", "LegacyHub pages do not live under the public archive layout.");
assert(shell.includes("PlatformHeader") && shell.includes("PlatformFooter"), "shared shell", "Platform shell owns header and footer.");
assert(header.includes('href="/legacyhub"'), "logo route", "LegacyHub logo links to /legacyhub.");
assert(!header.includes('href="#'), "route navigation", "Primary platform navigation uses routes instead of homepage hash links.");
assert(header.includes("aria-current") && header.includes("usePathname"), "active navigation", "Desktop and mobile navigation expose active state.");
assert(header.includes("LegacyHub mobile platform navigation") && header.includes("<details"), "mobile navigation", "Mobile platform menu is a keyboard-accessible disclosure.");
assert(shell.includes("aria-label=\"Breadcrumb\"") && shell.includes('href="/legacyhub"') && shell.includes("LegacyHub"), "breadcrumbs", "Breadcrumb component provides LegacyHub page context.");

assert(home.includes("Learn about our mission") && home.includes("/legacyhub/mission"), "homepage mission preview", "Homepage links to mission page.");
assert(home.includes("Explore who LegacyHub is for") && home.includes("/legacyhub/who-it-is-for"), "homepage audience preview", "Homepage links to audience page.");
assert(home.includes("View all capabilities") && home.includes("/legacyhub/capabilities"), "homepage capability preview", "Homepage links to capabilities page.");
assert(home.includes("Discover the flagship archive") && home.includes("/legacyhub/flagship-archive"), "homepage flagship preview", "Homepage links to flagship page.");
assert(home.includes("View the LegacyHub roadmap") && home.includes("/legacyhub/roadmap"), "homepage roadmap preview", "Homepage links to roadmap page.");
assert(home.includes("Register your interest") && home.includes("/legacyhub/early-access"), "homepage early-access CTA", "Homepage links to full early-access form.");
assert(!home.includes("<EarlyAccessForm"), "homepage shortened", "Full early-access form is not embedded on the homepage.");
assert(read("app/(platform)/legacyhub/early-access/page.tsx").includes("<EarlyAccessForm"), "form destination", "Full form exists on /legacyhub/early-access.");

assert(data.includes("currentCapabilities") && data.includes("plannedCapabilities"), "content reuse", "Current and planned capabilities are stored in shared data.");
assert(read("app/(platform)/legacyhub/capabilities/page.tsx").includes("Planned</span>"), "planned labels", "Planned capabilities remain visibly labelled.");
assert(data.includes("/biography") && data.includes("/gallery") && data.includes("/tioluwa-lase-molue"), "real archive links", "Flagship archive links use existing public routes.");
assert(actions.includes('from("waiting_list").insert'), "interest storage", "Server action stores reviewed enquiries in waiting_list.");
assert(actions.includes("gte(\"created_at\", cutoff)") && actions.includes("Your interest is already recorded"), "duplicate prevention", "Server action prevents duplicate same-day early-access submissions.");
assert(schemas.includes("legacyHubInterestSchema") && schemas.includes("website: z.string().trim().max(0)"), "honeypot validation", "Honeypot spam field is rejected server-side.");
assert(form.includes("aria-live") && form.includes("early-access-status"), "form accessibility", "Form has persistent live status feedback.");
assert(!home.includes("Create account") && !home.includes("Start free trial") && !home.includes("Sign up"), "no fake onboarding", "No public account creation language appears on the homepage.");
assert(data.includes("platformRoutes"), "route map data", "Final platform route map is documented in code.");
assert(read("app/(platform)/legacyhub/privacy/page.tsx").includes("preliminary product privacy notice"), "privacy honesty", "Privacy page is marked preliminary.");
assert(read("app/(platform)/legacyhub/contact/page.tsx").includes("No telephone number"), "contact honesty", "Contact page does not invent support details.");

if (process.exitCode) {
  process.exit(process.exitCode);
}
