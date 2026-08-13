import type { NavItem } from "@/lib/navigation";

export const biographyChapterTargets = {
  earlyLife: "/biography#early-life-the-roots-that-shaped-a-leader",
  journeyToBariga: "/biography#from-iboogun-to-bariga-the-journey-that-changed-everything",
  transportLegacy: "/biography#from-bolekaja-to-tioluwa-lase-a-legacy-on-the-roads-of-lagos",
  communityLeadership: "/biography#beyond-business-a-leader-who-served-his-community",
  familyResponsibility: "/biography#family-responsibility-and-sacrifice",
  enduringLegacy: "/biography#an-enduring-legacy"
} as const;

export const publicRouteRedirectTargets: Record<string, string> = {
  "/early-life": biographyChapterTargets.earlyLife,
  "/journey-to-bariga": biographyChapterTargets.journeyToBariga,
  "/community-leadership": biographyChapterTargets.communityLeadership,
  "/bolekaja": biographyChapterTargets.transportLegacy,
  "/tioluwa-lase-molue": biographyChapterTargets.transportLegacy,
  "/routes-and-locations": "/timeline",
  "/journey-map": "/timeline",
  "/family": "/gallery",
  "/transport-gallery": "/gallery",
  "/bolekaja-gallery": "/gallery",
  "/molue-gallery": "/gallery",
  "/community-gallery": "/gallery",
  "/restored-images": "/gallery",
  "/portraits": "/gallery",
  "/documents": "/gallery",
  "/english-documentary": "/documentaries",
  "/documentary-episodes": "/documentaries",
  "/trailer-clips": "/documentaries",
  "/transcripts": "/documentaries",
  "/family-memories": "/tributes"
};

const hiddenPublicNavigationHrefs = new Set(["/stories"]);

export function normalizePublicHref(href: string) {
  return publicRouteRedirectTargets[href] ?? href;
}

export function isHiddenPublicNavigationHref(href: string) {
  return hiddenPublicNavigationHrefs.has(href);
}

export function normalizePublicNavigationItems<T extends NavItem>(items: T[]): T[] {
  return items
    .filter((item) => !isHiddenPublicNavigationHref(item.href))
    .map((item) => ({
      ...item,
      href: normalizePublicHref(item.href),
      children: item.children
        ?.filter((child) => !isHiddenPublicNavigationHref(child.href))
        .map((child) => ({ ...child, href: normalizePublicHref(child.href) }))
    }));
}
