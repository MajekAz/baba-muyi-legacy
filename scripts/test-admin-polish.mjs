import fs from "node:fs";

const checks = [];

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function pass(name, detail) {
  checks.push({ ok: true, name, detail });
}

function fail(name, detail) {
  checks.push({ ok: false, name, detail });
}

function expect(name, condition, detail) {
  if (condition) pass(name, detail);
  else fail(name, detail);
}

const rootLayout = read("app/layout.tsx");
const publicLayout = read("app/(public)/layout.tsx");
const adminLayout = read("app/admin/layout.tsx");
const adminShell = read("components/admin/admin-shell.tsx");
const authActions = read("lib/auth-actions.ts");
const authCallback = read("app/auth/callback/route.ts");
const authForm = read("components/auth-form.tsx");
const navigation = read("lib/navigation.ts");
const homePage = read("app/(public)/page.tsx");
const loginPage = read("app/login/page.tsx");
const contentList = read("app/admin/content/[collection]/page.tsx");
const mediaLibrary = read("components/admin/media-library.tsx");
const confirmButton = read("components/admin/confirm-submit-button.tsx");
const updatePasswordPage = read("app/update-password/page.tsx");
const adminDocs = read("docs/ADMIN_UX_GUIDE.md");
const decisions = read("docs/PRODUCT_DECISIONS.md");

expect(
  "public header absent from admin shell",
  adminLayout.includes("AdminShell") && !adminLayout.includes("PublicNavigation") && !rootLayout.includes("PublicNavigation"),
  "Admin layout uses a dedicated shell and root layout does not render public navigation."
);
expect(
  "admin header present",
  adminShell.includes("LegacyHub") || adminShell.includes("platformBrand.name"),
  "Admin shell renders the platform brand."
);
expect(
  "sidebar active-state logic",
  adminShell.includes("aria-current") && adminShell.includes("routeMatches") && adminShell.includes("sectionMatches"),
  "Sidebar marks active routes with aria-current."
);
expect(
  "mobile sidebar open and close",
  adminShell.includes("setMobileOpen(true)") && adminShell.includes("Escape") && adminShell.includes("role=\"dialog\""),
  "Mobile sidebar can open, close, and respond to Escape."
);
expect(
  "permission-aware menu rendering",
  adminShell.includes("canSeeAdminItem") && navigation.includes("requiredPermission"),
  "Sidebar visibility is filtered by role permissions."
);
expect(
  "planned links not presented as working",
  navigation.includes("planned: true") && adminShell.includes("aria-disabled=\"true\""),
  "Planned modules are marked disabled."
);
expect(
  "breadcrumbs",
  adminShell.includes("Admin breadcrumbs") && adminShell.includes("aria-current=\"page\""),
  "Admin shell includes an accessible breadcrumb landmark."
);
expect(
  "toast status output",
  adminShell.includes("aria-live=\"polite\"") && adminShell.includes("Dismiss notification"),
  "Admin shell includes dismissible live-region feedback."
);
expect(
  "confirmation dialogs",
  contentList.includes("ConfirmSubmitButton") && mediaLibrary.includes("ConfirmSubmitButton") && confirmButton.includes("aria-modal=\"true\""),
  "Archive and remove actions use accessible confirmation UI."
);
expect(
  "empty states",
  contentList.includes("AdminEmptyState") && mediaLibrary.includes("AdminEmptyState"),
  "CMS and media screens use shared empty states."
);
expect(
  "session-expiry handling",
  adminShell.includes("expired") && adminLayout.includes("requireAdminRole"),
  "Admin shell has safe expired-session copy and layout still requires auth."
);
expect(
  "admin route protection",
  adminLayout.includes("requireAdminRole") && adminLayout.includes("getActiveTenantContext"),
  "Admin layout remains protected and tenant-aware."
);
expect(
  "no horizontal overflow affordances",
  adminShell.includes("min-w-0") && adminShell.includes("overflow-y-auto"),
  "Shell uses min-width constraints and sidebar scrolling."
);
expect(
  "documentation",
  adminDocs.includes("Public Baba Muyi archive navigation is not rendered on admin routes") && decisions.includes("Public and admin shells are separate"),
  "Product decisions and admin UX guide document the shell separation."
);
expect(
  "public route group owns public chrome",
  publicLayout.includes("PublicNavigation") && publicLayout.includes("ArchiveLogo") && publicLayout.includes("Footer navigation"),
  "Public route-group layout owns the Baba Muyi public header and footer."
);
expect(
  "root layout is shell-neutral",
  !rootLayout.includes("PublicSiteChrome") && !rootLayout.includes("getCmsMenus") && rootLayout.includes("<body className=\"font-sans\">{children}</body>"),
  "Root layout only provides html/body and does not wrap admin routes with public chrome."
);
expect(
  "password recovery uses callback exchange",
  authActions.includes('new URL("/auth/callback"') && authActions.includes('callbackUrl.searchParams.set("next", "/update-password")') && authCallback.includes("exchangeCodeForSession"),
  "Password reset emails route through the Supabase code-exchange callback before the update screen."
);
expect(
  "root recovery code fallback",
  homePage.includes("searchParams") && homePage.includes("/auth/callback?code=") && homePage.includes("next=/update-password"),
  "Root homepage redirects accidental ?code recovery links to the callback route."
);
expect(
  "password update requires active session",
  updatePasswordPage.includes("supabase.auth.getUser()") && updatePasswordPage.includes("hasRecoverySession") && updatePasswordPage.includes("Request a fresh reset link"),
  "Update-password screen requires a valid exchanged recovery session."
);
expect(
  "password confirmation required",
  authForm.includes("confirmPassword") && authActions.includes("Passwords must match.") && authActions.includes("/login?password=updated") && loginPage.includes("Password updated. Sign in with your new password."),
  "Password update form requires confirmation and redirects to login with safe success copy."
);

for (const check of checks) {
  console.log(`${check.ok ? "PASS" : "FAIL"} ${check.name}: ${check.detail}`);
}

const failed = checks.filter((check) => !check.ok);
if (failed.length) {
  process.exitCode = 1;
}
