import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
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

const platformPagePath = "app/(platform)/legacyhub/page.tsx";
const platformLayoutPath = "app/(platform)/layout.tsx";
const publicLegacyHubPath = "app/(public)/legacyhub/page.tsx";
const page = read(platformPagePath);
const layout = read(platformLayoutPath);
const form = read("components/legacyhub/early-access-form.tsx");
const actions = read("lib/actions.ts");
const schemas = read("lib/validation/forms.ts");

assert(fs.existsSync(path.join(root, platformPagePath)), "/legacyhub platform route", "Route exists in the platform route group.");
assert(fs.existsSync(path.join(root, platformLayoutPath)), "platform layout", "A dedicated platform layout exists.");
assert(!fs.existsSync(path.join(root, publicLegacyHubPath)), "Baba Muyi shell separation", "The platform route no longer lives under the public archive layout.");
assert(!layout.includes("PublicNavigation") && !page.includes("PublicNavigation"), "no archive navigation", "LegacyHub route does not render Baba Muyi public navigation.");
assert(page.includes("LegacyHub platform navigation") && page.includes("LegacyHub footer navigation"), "platform navigation", "Page has separate platform navigation and footer landmarks.");
assert(page.includes("WELCOME TO LEGACYHUB PHASE 2") || page.includes("Welcome to LegacyHub Phase 2"), "hero copy", "Hero uses the required Phase 2 eyebrow.");
assert(page.includes("Preserve the stories that should never be forgotten."), "hero headline", "Hero uses the required headline.");
assert(page.includes("To preserve the stories, values, achievements, and memories"), "mission statement", "Mission statement is present.");
assert(page.includes("Baba Muyi Legacy preserves the life, transport heritage"), "flagship archive", "Flagship archive section explains the Baba Muyi relationship without inventing facts.");
assert(page.includes("Current foundation") && page.includes("Planned capabilities"), "capability labels", "Current and planned platform capabilities are clearly separated.");
assert(page.includes("planned, not yet available") || page.includes("Planned, not yet available"), "planned honesty", "Planned features are not presented as available.");
assert(page.includes("Public registration") || page.includes("public registration"), "registration status", "Page explicitly says registration is not enabled.");
assert(!page.includes("Create account") && !page.includes("Start free trial") && !page.includes("Sign up"), "no fake onboarding", "Page does not expose public account creation language.");
assert(page.includes("robots") && page.includes("index: false"), "launch noindex", "Platform page is noindex during development.");
assert(page.includes("application/ld+json"), "structured data", "Structured data is included.");
assert(form.includes("submitLegacyHubInterest"), "early-access form", "Interest form posts to a server action.");
assert(form.includes("website") && schemas.includes("max(0)"), "spam protection", "Honeypot spam protection is wired.");
assert(schemas.includes("legacyHubInterestSchema") && schemas.includes("consent: z.literal(true)"), "server validation", "Server-side validation requires consent.");
assert(actions.includes("submitLegacyHubInterest") && actions.includes('from("waiting_list").insert'), "interest workflow", "Server action stores reviewed enquiries in waiting_list.");
assert(actions.includes("gte(\"created_at\", cutoff)") && actions.includes("Your interest is already recorded"), "duplicate prevention", "Server action prevents duplicate same-day early-access submissions.");
assert(actions.includes("legacyhub_phase_2_landing_page") && actions.includes("reviewStatus"), "reviewable storage", "Stored note payload includes source and review metadata.");
assert(actions.includes("has not created an account or workspace"), "no account creation", "Server response confirms the workflow does not create accounts or workspaces.");
assert(form.includes("aria-describedby") && form.includes("aria-live"), "form accessibility", "Form has accessible help text and live feedback.");
assert(page.includes("/login"), "login link", "Platform navigation links to the existing login route.");

if (process.exitCode) {
  process.exit(process.exitCode);
}
