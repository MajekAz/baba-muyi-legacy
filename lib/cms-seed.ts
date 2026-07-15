import { publicNavigation } from "@/lib/navigation";
import type { CmsContentRecord, CmsMenuItem, CmsPage, CmsStore } from "@/lib/cms-types";

const now = "2026-07-14T00:00:00.000Z";
export const defaultWorkspaceId = "workspace-baba-muyi-family-archive";
export const defaultLegacyProfileId = "legacy-profile-baba-muyi";

const pageSeeds: Array<Omit<CmsPage, "id" | "workspaceId" | "legacyProfileId" | "slug" | "status" | "visibility" | "verificationStatus" | "updatedAt"> & { path: string }> = [
  {
    path: "/",
    eyebrow: "Digital legacy archive",
    title: "Alhaji Tioluwalase \"Baba Muyi\" Majekodunmi",
    description: "A living archive for family history, enterprise, transport heritage, public memories, documentary material, and the values Baba Muyi carried through his life.",
    body: "This homepage introduces the archive’s purpose, principles, featured sections, and timeline preview for visitors.",
    cards: [
      { id: "family-stewardship", title: "Family stewardship", description: "Preserving family memory with care, consent, and context." },
      { id: "enterprise", title: "Enterprise", description: "Documenting the work, transport ventures, and people connected to the business." },
      { id: "service", title: "Service", description: "Recording community contribution, counsel, and leadership." },
      { id: "faith", title: "Faith", description: "Honouring values and lessons that shaped Baba Muyi's life." }
    ]
  },
  {
    path: "/biography",
    eyebrow: "Life story",
    title: "Full biography",
    description: "A chapter-led biography prepared for family-approved writing, photographs, source notes, and documentary references.",
    body: "Biography chapters are being carefully prepared for publication with source notes, family review, and appropriate permissions.",
    cards: [
      { id: "early-life", title: "Early life and family roots", description: "Birthplace, lineage, education, childhood stories, and formative influences.", href: "/early-life" },
      { id: "enterprise", title: "Enterprise and transport work", description: "Bolekaja, Molue history, routes, staff, and community impact.", href: "/bolekaja" },
      { id: "legacy", title: "Later years and legacy", description: "Family reflections, values, faith, counsel, and future lessons.", href: "/lessons" }
    ]
  },
  {
    path: "/timeline",
    eyebrow: "Chronology",
    title: "Interactive timeline",
    description: "Milestones support dates, locations, categories, media attachments, source notes, and publication state.",
    body: "Verified milestones from Baba Muyi’s life will appear here as the archive develops.",
    cards: []
  },
  {
    path: "/documentaries",
    eyebrow: "Film archive",
    title: "Documentary centre",
    description: "Manage documentaries, episodes, trailers, transcripts, subtitles, chapters, and streaming-provider playback IDs.",
    body: "Documentary material will be organised here with episodes, transcripts, viewing notes, and approved playback references.",
    cards: [
      { id: "episodes", title: "Episodes", description: "Episode metadata, chapters, release status, thumbnails, and playback IDs.", href: "/documentary-episodes" },
      { id: "transcripts", title: "Transcripts", description: "Searchable transcripts with timestamps and family-approved corrections.", href: "/transcripts" },
      { id: "production-notes", title: "Production notes", description: "Interview logs, credits, contributors, permissions, and review status." }
    ]
  },
  {
    path: "/gallery",
    eyebrow: "Visual archive",
    title: "Photo gallery",
    description: "Albums organise portraits, family images, transport photographs, scanned documents, and community submissions.",
    body: "Every image should have caption, alt text, copyright owner, privacy state, verification status, and source notes before publication.",
    cards: [
      { id: "portraits", title: "Portraits", description: "Approved portraits and captions.", href: "/portraits" },
      { id: "family", title: "Family", description: "Private-first family photographs.", href: "/family" },
      { id: "transport", title: "Transport heritage", description: "Bolekaja and Molue images by route, vehicle, era, and contributor.", href: "/transport-gallery" }
    ]
  },
  {
    path: "/family-tree",
    eyebrow: "Lineage",
    title: "Family tree",
    description: "A private-first family graph for relationships, photos, life dates, notes, and publication permissions.",
    body: "Family records will be handled carefully with privacy, consent, and special protection for living people.",
    cards: []
  },
  {
    path: "/lessons",
    eyebrow: "Values",
    title: "Lessons and values",
    description: "A curated collection of principles, advice, stories, and teachable moments for future generations.",
    body: "Lessons can link to biography chapters, stories, media, contributors, and documentary clips.",
    cards: []
  },
  {
    path: "/blog",
    eyebrow: "Editorial",
    title: "Blog",
    description: "Archive notes, curator updates, essays, documentary announcements, and historical context.",
    body: "Legacy articles and historical reflections will be published here.",
    cards: []
  },
  {
    path: "/archive",
    eyebrow: "Media",
    title: "Video and audio archive",
    description: "A searchable home for clips, interviews, voice notes, audio memories, and archival video references.",
    body: "Archive records track media type, storage bucket or external URL, privacy state, contributor, captions, transcripts, and deletion metadata.",
    cards: []
  },
  {
    path: "/tributes",
    eyebrow: "Community memories",
    title: "Share a Memory",
    description: "Public memories are submitted for review before publishing, with consent and moderation built into the workflow.",
    body: "Testimonials remain private until reviewed and approved by an authorised editor.",
    cards: []
  },
  {
    path: "/contact",
    eyebrow: "Contact",
    title: "Contact the archive",
    description: "A route for family, contributors, documentary participants, and future platform enquiries.",
    body: "Contact routes will support family, contributors, documentary participants, and archive enquiries.",
    cards: []
  },
  {
    path: "/curator",
    eyebrow: "Flagship archive",
    title: "About Baba Muyi Legacy and LegacyHub",
    description: "Baba Muyi Legacy is the first flagship archive created with LegacyHub.",
    body: "Baba Muyi Legacy is the first flagship archive created with LegacyHub, a platform designed to help families, communities and institutions preserve and share meaningful histories.",
    cards: [
      { id: "families", title: "Family histories", description: "LegacyHub supports family histories, parents, grandparents, and multi-generational memories." },
      { id: "leaders", title: "Leaders and founders", description: "Archive community leaders, entrepreneurs, founders, veterans, and cultural contributors." },
      { id: "institutions", title: "Institutions and organisations", description: "Support cultural institutions, organisations, and living or deceased legacy subjects." }
    ]
  }
];

const simplePages = [
  ["/early-life", "His Life", "Early Life", "A dedicated section for approved early-life material once family-reviewed content is supplied."],
  ["/journey-to-bariga", "His Life", "Journey to Bariga", "A reusable biography landing page for the Bariga journey chapter."],
  ["/community-leadership", "His Life", "Community Leadership", "Approved stories about service, leadership, and community memory."],
  ["/bolekaja", "Transport history", "Bolekaja transport history", "Oral history, vehicles, routes, staff, photographs, and the social context of Bolekaja transport."],
  ["/tioluwa-lase-molue", "Enterprise", "TIOLUWA LASE Molue history", "The TIOLUWA LASE Molue story, business operations, people, and memories from the road."],
  ["/routes-and-locations", "Transport Legacy", "Routes and Locations", "A route-focused section for approved transport locations."],
  ["/transport-gallery", "Transport Legacy", "Transport Gallery", "A gallery landing page for Bolekaja, Molue, route, and vehicle images."],
  ["/english-documentary", "Documentaries", "English Documentary", "A dedicated page for the approved English documentary record and playback details."],
  ["/documentary-episodes", "Documentaries", "Episodes", "A structured listing for documentary series episodes and chapters."],
  ["/trailer-clips", "Documentaries", "Trailers and Clips", "A page for trailers, short clips, and supporting video material."],
  ["/transcripts", "Documentaries", "Transcripts", "A searchable home for documentary transcripts and subtitles."],
  ["/portraits", "Gallery", "Portraits", "A focused gallery for approved portraits."],
  ["/family", "Gallery", "Family", "A private-first gallery area for approved family photographs."],
  ["/bolekaja-gallery", "Gallery", "Bolekaja", "A gallery for approved Bolekaja era photographs and captions."],
  ["/molue-gallery", "Gallery", "Molue", "A gallery for TIOLUWA LASE Molue era photographs and transport memories."],
  ["/community-gallery", "Gallery", "Community", "A gallery for approved community and leadership photographs."],
  ["/restored-images", "Gallery", "Restored Images", "Restored archive photographs, always linked to archival originals."],
  ["/children", "Family Legacy", "Children", "A privacy-protected section for approved family-member records."],
  ["/grandchildren", "Family Legacy", "Grandchildren", "A family section governed by visibility and consent settings."],
  ["/family-memories", "Family Legacy", "Family Memories", "Reviewed family stories, audio, photographs, and recollections."],
  ["/journey-map", "Routes", "Interactive journey and route map", "Journeys, routes, stops, landmarks, and transport memories."],
  ["/documents", "Sources", "Historical documents", "A controlled document archive for scans, letters, certificates, business records, and references."],
  ["/privacy", "Legal", "Privacy policy", "Draft privacy policy for the Baba Muyi Legacy archive."],
  ["/terms", "Legal", "Terms", "Draft terms for contributors and visitors."],
  ["/waiting-list", "Future SaaS", "Legacy platform waiting list", "The Baba Muyi archive is the proof of concept for a future family legacy platform."]
] as const;

function slugFromPath(path: string) {
  return path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "-");
}

const pages: CmsPage[] = [
  ...pageSeeds,
  ...simplePages.map(([path, eyebrow, title, description]) => ({
    path,
    eyebrow,
    title,
    description,
    body: "Approved material for this section is being prepared for publication.",
    cards: [
      {
        id: `${slugFromPath(path)}-cms-ready`,
        title: "Content in preparation",
        description: "Family-reviewed material will appear here when it is ready."
      }
    ]
  }))
].map((page) => ({
  ...page,
  id: `page-${slugFromPath(page.path)}`,
  workspaceId: defaultWorkspaceId,
  legacyProfileId: defaultLegacyProfileId,
  slug: slugFromPath(page.path),
  status: "published",
  visibility: "public",
  verificationStatus: "unverified",
  updatedAt: now
}));

const content: CmsContentRecord[] = [
  {
    id: "timeline-family-roots",
    workspaceId: defaultWorkspaceId,
    legacyProfileId: defaultLegacyProfileId,
    kind: "timeline_event",
    title: "Family roots and formation",
    slug: "family-roots",
    summary: "A curated chapter for childhood, family lineage, education, early influences, and the people who shaped his character.",
    body: "Approved timeline details, sources, images, and locations will be added as the archive develops.",
    status: "published",
    visibility: "public",
    verificationStatus: "unverified",
    sortOrder: 1,
    relatedPath: "/timeline",
    dateLabel: "Early years",
    category: "family",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "timeline-transport-enterprise",
    workspaceId: defaultWorkspaceId,
    legacyProfileId: defaultLegacyProfileId,
    kind: "timeline_event",
    title: "Building transport ventures",
    slug: "transport-enterprise",
    summary: "A dedicated record for Bolekaja history, TIOLUWA LASE Molue stories, vehicle records, routes, drivers, conductors, and community impact.",
    body: "Connect this event to transport photographs, documentary clips, and verified memories.",
    status: "published",
    visibility: "public",
    verificationStatus: "unverified",
    sortOrder: 2,
    relatedPath: "/timeline",
    dateLabel: "Enterprise years",
    category: "transport",
    updatedAt: now,
    createdAt: now
  },
  {
    id: "lesson-family-stewardship",
    workspaceId: defaultWorkspaceId,
    legacyProfileId: defaultLegacyProfileId,
    kind: "lesson",
    title: "Family stewardship",
    slug: "family-stewardship",
    summary: "Preserve memory with respect, context, and responsibility.",
    body: "Lessons can be expanded with family-approved stories and linked media.",
    status: "published",
    visibility: "public",
    verificationStatus: "family_memory",
    sortOrder: 1,
    relatedPath: "/lessons",
    category: "values",
    updatedAt: now,
    createdAt: now
  },
  {
    id: "blog-cms-first",
    workspaceId: defaultWorkspaceId,
    legacyProfileId: defaultLegacyProfileId,
    kind: "blog_post",
    title: "Building the Baba Muyi archive carefully",
    slug: "cms-first",
    summary: "A curator note about preparing public archive pages with care and review.",
    body: "Legacy articles and historical reflections will be published here when approved.",
    status: "draft",
    visibility: "public",
    verificationStatus: "unverified",
    sortOrder: 1,
    relatedPath: "/blog",
    category: "curator-note",
    updatedAt: now,
    createdAt: now
  }
];

function flattenMenu(items: typeof publicNavigation, location: CmsMenuItem["location"]) {
  const flattened: CmsMenuItem[] = [];
  items.forEach((item, index) => {
    const id = `${location}-${slugFromPath(item.href)}`;
    flattened.push({
      id,
      workspaceId: defaultWorkspaceId,
      legacyProfileId: defaultLegacyProfileId,
      label: item.label,
      href: item.href,
      slug: slugFromPath(item.href),
      location,
      sortOrder: index + 1,
      status: "published",
      visibility: "public",
      linkType: "internal",
      openInNewTab: false,
      hidden: false
    });
    item.children?.forEach((child, childIndex) => {
      flattened.push({
        id: `${id}-${slugFromPath(child.href)}`,
        workspaceId: defaultWorkspaceId,
        legacyProfileId: defaultLegacyProfileId,
        parentId: id,
        label: child.label,
        href: child.href,
        slug: slugFromPath(child.href),
        location,
        sortOrder: childIndex + 1,
        status: "published",
        visibility: "public",
        linkType: "internal",
        openInNewTab: false,
        hidden: false
      });
    });
  });
  return flattened;
}

export const initialCmsStore: CmsStore = {
  version: 1,
  activeWorkspaceId: defaultWorkspaceId,
  activeLegacyProfileId: defaultLegacyProfileId,
  updatedAt: now,
  workspaces: [
    {
      id: defaultWorkspaceId,
      name: "Baba Muyi Family Archive",
      slug: "baba-muyi-family-archive",
      status: "active",
      createdAt: now,
      updatedAt: now
    }
  ],
  legacyProfiles: [
    {
      id: defaultLegacyProfileId,
      workspaceId: defaultWorkspaceId,
      slug: "baba-muyi",
      type: "individual",
      fullName: "Alhaji Tioluwalase \"Baba Muyi\" Majekodunmi",
      displayName: "Baba Muyi",
      knownAs: "Baba Muyi",
      deathYear: 2008,
      status: "draft",
      visibility: "preview",
      verificationStatus: "family_memory",
      createdAt: now,
      updatedAt: now
    }
  ],
  pages,
  content,
  menuItems: [
    ...flattenMenu(publicNavigation, "header"),
    ...flattenMenu(publicNavigation, "mobile"),
    ...flattenMenu(publicNavigation, "footer"),
    {
      id: "admin-dashboard",
      workspaceId: defaultWorkspaceId,
      legacyProfileId: defaultLegacyProfileId,
      label: "Dashboard",
      href: "/admin",
      slug: "dashboard",
      location: "admin",
      sortOrder: 1,
      status: "published",
      visibility: "private",
      linkType: "internal",
      openInNewTab: false,
      hidden: false
    }
  ]
};
