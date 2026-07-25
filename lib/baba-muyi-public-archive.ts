export const babaMuyiArchiveFacts = {
  fullName: 'Alhaji Tioluwalase "Baba Muyi" Majekodunmi',
  archiveName: "Baba Muyi Legacy",
  relationship: "A LegacyHub Digital Archive",
  legacyLine: "A father, entrepreneur, community leader, philanthropist, and family legacy preserved for future generations.",
  introduction:
    "Baba Muyi Legacy preserves the life, values, transport heritage, family story, and public memories of Alhaji Tioluwalase \"Baba Muyi\" Majekodunmi through a careful family-led archive.",
  curatorLine:
    "The archive is documented and stewarded by Azeez Adeyemi Majekodunmi with family review, public publication controls, and respect for private records.",
  closing:
    "This archive is being built slowly and carefully so future generations can encounter the stories, images, lessons, and community memory with dignity."
} as const;

export const archiveHomeCtas = [
  { label: "Explore the biography", href: "/biography", primary: true },
  { label: "View the timeline", href: "/timeline", primary: false }
] as const;

export const archiveJourneyPreview = [
  {
    label: "Family roots",
    title: "Iboogun and Abeokuta roots",
    description: "A family-history path for approved stories about origins, upbringing, and formative influences.",
    href: "/early-life"
  },
  {
    label: "Life journey",
    title: "Journey to Bariga",
    description: "A route for the family-reviewed account of movement, settlement, work, and community life.",
    href: "/journey-to-bariga"
  },
  {
    label: "Enterprise",
    title: "Bolekaja transport",
    description: "Transport history, work on the road, staff memories, and the social context of Bolekaja service.",
    href: "/bolekaja"
  },
  {
    label: "Transport heritage",
    title: "TIOLUWA LASE Molue era",
    description: "A focused archive route for the TIOLUWA LASE bus identity, Molue memories, and published transport material.",
    href: "/tioluwa-lase-molue"
  },
  {
    label: "Community",
    title: "Leadership and service",
    description: "A place for reviewed public memories about counsel, community contribution, and humanitarian legacy.",
    href: "/community-leadership"
  },
  {
    label: "Legacy",
    title: "Lessons for generations",
    description: "Values, family stewardship, and public lessons preserved for children, grandchildren, and future readers.",
    href: "/lessons"
  }
] as const;

export const archiveCollectionPreviews = [
  { label: "Photographs", title: "Photo archive", href: "/gallery", description: "Published images and albums approved for public viewing." },
  { label: "Documents", title: "Historical documents", href: "/documents", description: "Public document records when scans and permissions are ready." },
  { label: "Transport", title: "Transport gallery", href: "/transport-gallery", description: "Bolekaja, Molue, routes, vehicles, and work memories." },
  { label: "Stories", title: "Stories and memories", href: "/stories", description: "Reviewed public memories from the archive team." },
  { label: "Film", title: "Documentary material", href: "/documentaries", description: "Documentary records, episodes, clips, and transcripts when published." },
  { label: "Values", title: "Life lessons", href: "/lessons", description: "Published values, advice, and generational teaching." }
] as const;

export const transportHeritageLinks = [
  { label: "Bolekaja Era", href: "/bolekaja" },
  { label: "TIOLUWA LASE Molue Era", href: "/tioluwa-lase-molue" },
  { label: "Routes and Locations", href: "/routes-and-locations" },
  { label: "Transport Gallery", href: "/transport-gallery" }
] as const;

export const archiveFooterCtas = [
  { label: "Explore the biography", href: "/biography" },
  { label: "View the timeline", href: "/timeline" },
  { label: "Browse the gallery", href: "/gallery" },
  { label: "Discover the transport legacy", href: "/bolekaja" }
] as const;
