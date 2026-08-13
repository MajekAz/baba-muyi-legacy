export const babaMuyiArchiveFacts = {
  fullName: 'Alhaji Tioluwalase "Baba Muyi" Majekodunmi',
  archiveName: "Baba Muyi Legacy",
  relationship: "A LegacyHub Digital Archive",
  heroHeadline: 'The Legacy of Alhaji Tioluwalase "Baba Muyi" Majekodunmi',
  legacyLine: "Entrepreneur. Community Leader. Family Patriarch. A Life Preserved for Future Generations.",
  introduction:
    "Alhaji Tioluwalase \"Baba Muyi\" Majekodunmi was an entrepreneur, transport pioneer, community leader, and family patriarch whose life touched many people through generosity, leadership, and service. This archive preserves his story so future generations can understand not only what he achieved, but the values he lived by.",
  biographyPreview:
    "Every life has a story. Baba Muyi's story is one of enterprise, service, sacrifice, leadership, and enduring family legacy. Discover the experiences that shaped the man behind the name and continue to inspire future generations.",
  documentaryPreview:
    "Through documentary narration, family memories, historical records, and carefully preserved photographs, this film documents Baba Muyi's life for present and future generations.",
  archivePurpose:
    "Baba Muyi Legacy was established by Azeez Adeyemi Majekodunmi to preserve his father's life and make the archive accessible to children, grandchildren, future descendants, researchers, and the wider community. LegacyHub provides the platform behind the archive while Baba Muyi's story remains the centre of the experience.",
  curatorLine:
    "This archive is a continuing work shaped by family records, photographs, personal memories, documentary research, and contributions from people who knew Baba Muyi.",
  closing:
    "This archive is being built carefully so future generations can encounter Baba Muyi's story, images, lessons, and community memory with dignity."
} as const;

export const archiveHomeCtas = [
  { label: "Explore His Story", href: "/biography", primary: true },
  { label: "Watch the Documentary", href: "/documentaries", primary: false },
  { label: "Share a Memory", href: "/tributes", primary: false }
] as const;

export const archiveJourneyPreview = [
  {
    label: "Family roots",
    title: "From Iboogun to Bariga",
    description: "A family-history path for approved stories about origins, upbringing, and formative influences.",
    href: "/biography#early-life-the-roots-that-shaped-a-leader"
  },
  {
    label: "Life journey",
    title: "The Journey to Community Life",
    description: "A route for the family-reviewed account of movement, settlement, work, and community life.",
    href: "/biography#from-iboogun-to-bariga-the-journey-that-changed-everything"
  },
  {
    label: "Enterprise",
    title: "Building a Transport Legacy",
    description: "Transport history, work on the road, staff memories, and the social context of Bolekaja service.",
    href: "/biography#from-bolekaja-to-tioluwa-lase-a-legacy-on-the-roads-of-lagos"
  },
  {
    label: "Transport heritage",
    title: "The TIOLUWA LASE Years",
    description: "A focused archive route for the TIOLUWA LASE bus identity, Molue memories, and published transport material.",
    href: "/biography#from-bolekaja-to-tioluwa-lase-a-legacy-on-the-roads-of-lagos"
  },
  {
    label: "Community",
    title: "A Life of Service",
    description: "A place for reviewed public memories about counsel, community contribution, and humanitarian legacy.",
    href: "/biography#beyond-business-a-leader-who-served-his-community"
  },
  {
    label: "Legacy",
    title: "Lessons for Future Generations",
    description: "Values, family stewardship, and public lessons preserved for children, grandchildren, and future readers.",
    href: "/lessons"
  }
] as const;

export const archiveCollectionPreviews = [
  { label: "Photographs", title: "Historic photographs", href: "/gallery", description: "Published archive images with reviewed captions and respectful context." },
  { label: "Family", title: "Family memories", href: "/gallery", description: "Photographs and memories connected to family life and future generations." },
  { label: "Transport", title: "Transport history", href: "/gallery", description: "Bolekaja, Molue, TIOLUWA LASE vehicles, routes, and work memories." },
  { label: "Documents", title: "Historical documents", href: "/gallery", description: "Public records and scans when permissions and descriptions are approved." },
  { label: "Film", title: "Documentary material", href: "/documentaries", description: "Documentary records, chapters, clips, and transcripts when published." },
  { label: "Tributes", title: "Stories and tributes", href: "/tributes", description: "Reviewed memories, tributes, corrections, and additional public context." }
] as const;

export const transportHeritageLinks = [
  { label: "Bolekaja Era", href: "/biography#from-bolekaja-to-tioluwa-lase-a-legacy-on-the-roads-of-lagos" },
  { label: "TIOLUWA LASE Molue Era", href: "/biography#from-bolekaja-to-tioluwa-lase-a-legacy-on-the-roads-of-lagos" },
  { label: "Routes and Locations", href: "/timeline" },
  { label: "Transport Gallery", href: "/gallery" }
] as const;

export const archiveFooterCtas = [
  { label: "Read His Biography", href: "/biography" },
  { label: "Explore the Timeline", href: "/timeline" },
  { label: "Visit the Gallery", href: "/gallery" },
  { label: "Share a Memory", href: "/tributes" }
] as const;

export const archiveLessonThemes = [
  {
    title: "Kindness with wisdom",
    description: "A reminder that generosity can be practiced with care, discernment, and protection for the people who depend on us."
  },
  {
    title: "Family responsibility",
    description: "The archive honours the duty to preserve family memory, strengthen future generations, and keep meaningful records safe."
  },
  {
    title: "Hard work and service",
    description: "Baba Muyi's legacy points visitors toward determination, community service, good character, and learning from sacrifice."
  }
] as const;
