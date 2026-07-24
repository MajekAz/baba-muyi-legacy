export const platformNavItems = [
  { label: "Mission", href: "/legacyhub/mission" },
  { label: "Who It Is For", href: "/legacyhub/who-it-is-for" },
  { label: "Capabilities", href: "/legacyhub/capabilities" },
  { label: "Flagship Archive", href: "/legacyhub/flagship-archive" },
  { label: "Roadmap", href: "/legacyhub/roadmap" },
  { label: "About", href: "/legacyhub/about" },
  { label: "Early Access", href: "/legacyhub/early-access" },
  { label: "Sign In", href: "/login" }
] as const;

export const missionStatement =
  "To preserve the stories, values, achievements, and memories of individuals, families, communities, and organisations for future generations through beautiful, secure, and collaborative digital archives.";

export const legacyHubValues = [
  ["Preserve before it is forgotten.", "Memories, photographs, documents, and voices can disappear quietly. LegacyHub is shaped around timely, careful preservation."],
  ["Tell authentic stories.", "Archives should be attributed, reviewed, and honest about what is known, what is private, and what still needs context."],
  ["Build for generations, not trends.", "The platform is designed for long-term stewardship rather than disposable pages or short campaign cycles."],
  ["Respect history and culture.", "Each archive carries family, community, religious, cultural, and emotional meaning that must be handled with care."],
  ["Make technology serve humanity.", "The product exists to support memory, dignity, collaboration, and responsible access."]
] as const;

export const audienceGroups = [
  ["Families preserving their history", "Families may preserve photographs, documents, biography chapters, values, recipes, letters, audio memories, and stories about parents, grandparents, and loved ones.", "Children, grandchildren, relatives, family friends, appointed editors, and trusted custodians can contribute.", "The public archive can become a respectful place to share approved memories, lessons, photographs, and family history.", "Roles, private drafts, review workflows, and publication controls help families protect sensitive or disputed material."],
  ["Traditional rulers and royal families", "Lineage, ceremonies, leadership records, cultural knowledge, images, public service, and community history can be preserved.", "Family historians, palace archivists, elders, photographers, and approved community contributors may participate.", "The public archive can present a carefully reviewed record of heritage, leadership, and cultural continuity.", "Editorial review and permission-aware access help separate public heritage from private family or community records."],
  ["Museums and heritage centres", "Collections, object stories, images, documents, oral histories, captions, provenance notes, and exhibitions can be prepared.", "Curators, archivists, researchers, volunteers, and rights holders can contribute within assigned roles.", "Public pages can introduce curated collections and invite visitors to explore approved material.", "Moderation and source notes help protect provenance, copyright, and cultural sensitivity."],
  ["Churches and mosques", "Founders, elders, sermons, photographs, milestones, building histories, programmes, and community testimony can be preserved.", "Leaders, historians, members, media teams, and approved volunteers can contribute material.", "The public archive can honour institutional memory and make selected teachings or milestones easier to find.", "Permissions help leaders decide what is public, private, under review, or not suitable for publication."],
  ["Schools and universities", "Founders, alumni stories, campus images, documents, house histories, awards, speeches, and milestone records can be gathered.", "Administrators, alumni, teachers, archivists, students, and approved historians can contribute.", "The archive can become a public heritage surface for alumni engagement and institutional memory.", "Review workflows help prevent inaccurate, private, or unapproved submissions from appearing publicly."],
  ["Veterans' associations", "Service stories, photographs, medals, records, interviews, remembrance events, and community contributions can be preserved.", "Veterans, families, association officers, historians, and approved researchers can contribute.", "Public pages can respectfully share service memories and remembrance material.", "Private controls and review steps protect sensitive records and living-person privacy."],
  ["Non-profits and community organisations", "Projects, founders, leaders, impact stories, photographs, reports, events, and community testimony can be recorded.", "Team members, volunteers, beneficiaries, donors, community leaders, and editors can contribute.", "A public archive can show continuity, accountability, and the people behind long-term community work.", "Role-based workflows keep public storytelling distinct from internal records and unreviewed submissions."],
  ["Founders, entrepreneurs, and family businesses", "Business origins, products, routes, staff memories, customer stories, photographs, values, and succession history can be preserved.", "Founders, family members, staff, customers, archivists, and approved editors can contribute.", "Public archives can preserve enterprise history while honouring the people and values behind the work.", "Private media, review workflows, and role controls protect commercial, family, and personal boundaries."]
] as const;

export const currentCapabilities = [
  "Secure authentication",
  "Role-based permissions",
  "Collaborative CMS",
  "Publishing and review workflows",
  "Media library",
  "Photo, audio, document, and video archive",
  "Albums and galleries",
  "Audit logs",
  "Workspace and legacy-profile separation",
  "Private and public content controls"
] as const;

export const plannedCapabilities = [
  "Family and relationship graph",
  "Documentary centre",
  "Community contributions",
  "Advanced search",
  "Interactive maps and timelines",
  "Custom domains",
  "Subscription plans",
  "Self-service onboarding",
  "AI-assisted archive tools"
] as const;

export const processSteps = [
  "Create a legacy archive",
  "Invite trusted contributors",
  "Add stories, photographs, audio, video, and documents",
  "Review and approve submissions",
  "Publish a beautiful public archive",
  "Preserve it for future generations"
] as const;

export const collaborationSteps = [
  "Create or join an archive",
  "Receive an assigned role",
  "Add content",
  "Submit for review",
  "Review and approve",
  "Publish"
] as const;

export const flagshipPreviews = [
  ["Biography", "Structured chapters for life story material approved for public release.", "/biography"],
  ["Historical timeline", "A public timeline for milestones and archive context.", "/timeline"],
  ["TIOLUWA LASE transport legacy", "Transport heritage routes, stories, and public memory.", "/tioluwa-lase-molue"],
  ["Photo archive", "Published photographs and albums from the archive team.", "/gallery"],
  ["Documentary stories", "Documentary-related routes and production material when published.", "/documentaries"],
  ["Family and community memories", "Reviewed memories, family history, and community reflections.", "/stories"],
  ["Values and life lessons", "Lessons and values preserved for future generations.", "/lessons"]
] as const;

export const completedRoadmapStages = [
  ["Completed", "Foundation", "Workspace-aware architecture, Supabase foundation, permissions, documentation, and owner bootstrap."],
  ["Completed", "CMS Core", "Biography, timeline, stories, lessons, and blog workflows with review and publishing."],
  ["Completed", "Media Library", "Secure uploads, albums, private media, signed previews, public gallery/archive, and storage policy tests."],
  ["Completed", "Production Polish", "Administration shell separation, publishing UX, media workflow polish, and acceptance checks."],
  ["In progress", "Phase 2 Platform Website", "Multi-page LegacyHub public platform experience with early-access interest workflow."]
] as const;

export const milestoneFourAreas = [
  "Cinematic homepage",
  "Interactive biography",
  "Historical timeline",
  "TIOLUWA LASE transport legacy",
  "Documentary centre",
  "Family gallery",
  "Community memories",
  "Rich storytelling"
] as const;

export const futurePhases = [
  "Team and collaboration",
  "Family and relationship graph",
  "Documentary centre",
  "Multi-tenant customer onboarding",
  "Custom domains",
  "Commercial plans and billing",
  "LegacyHub Cloud"
] as const;

export const platformRoutes = [
  "/legacyhub",
  "/legacyhub/mission",
  "/legacyhub/who-it-is-for",
  "/legacyhub/capabilities",
  "/legacyhub/flagship-archive",
  "/legacyhub/roadmap",
  "/legacyhub/about",
  "/legacyhub/early-access",
  "/legacyhub/privacy",
  "/legacyhub/contact"
] as const;
