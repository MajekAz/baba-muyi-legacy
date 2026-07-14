const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";

const routes = [
  "/",
  "/biography",
  "/timeline",
  "/early-life",
  "/journey-to-bariga",
  "/community-leadership",
  "/documentaries",
  "/english-documentary",
  "/documentary-episodes",
  "/trailer-clips",
  "/transcripts",
  "/gallery",
  "/portraits",
  "/family",
  "/bolekaja-gallery",
  "/molue-gallery",
  "/community-gallery",
  "/restored-images",
  "/archive",
  "/documents",
  "/bolekaja",
  "/tioluwa-lase-molue",
  "/routes-and-locations",
  "/transport-gallery",
  "/journey-map",
  "/family-tree",
  "/children",
  "/grandchildren",
  "/family-memories",
  "/lessons",
  "/tributes",
  "/blog",
  "/curator",
  "/contact",
  "/privacy",
  "/terms",
  "/waiting-list",
  "/login",
  "/forgot-password",
  "/reset-password",
  "/update-password",
  "/unauthorised",
  "/admin",
  "/admin/content",
  "/admin/media",
  "/admin/documentaries",
  "/admin/access",
  "/admin/menus",
  "/admin/menus/header",
  "/admin/menus/mobile",
  "/admin/menus/footer",
  "/admin/menus/secondary",
  "/admin/menus/admin",
  "/admin/content/biography",
  "/admin/media/albums",
  "/api/health"
];

let failures = 0;

for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`, {
    redirect: "manual"
  });

  const ok = response.status >= 200 && response.status < 400;
  console.log(`${ok ? "PASS" : "FAIL"} ${route} ${response.status}`);

  if (!ok) {
    failures += 1;
  }
}

if (failures > 0) {
  process.exitCode = 1;
}
