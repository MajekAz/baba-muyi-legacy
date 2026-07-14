import { z } from "zod";

export const siteConfig = {
  name: "Baba Muyi Legacy",
  domain: "babamuyilegacy.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://babamuyilegacy.com",
  description:
    "A premium digital legacy, documentary archive, and family-history website preserving the life and values of Alhaji Tioluwalase \"Baba Muyi\" Majekodunmi.",
  curator: "The Majekodunmi Family"
};

export const publishingStateSchema = z.enum(["draft", "scheduled", "published", "archived"]);
export type PublishingState = z.infer<typeof publishingStateSchema>;

export type LegacyProfile = {
  id: string;
  slug: string;
  fullName: string;
  honorificName: string;
  knownAs: string;
  birthYear?: number;
  deathYear?: number;
  summary: string;
  heroImageUrl?: string;
  values: string[];
  seoTitle: string;
  seoDescription: string;
};

export type TimelineEvent = {
  id: string;
  year: string;
  title: string;
  location?: string;
  description: string;
  category: "family" | "business" | "community" | "transport" | "faith";
};

export type FeatureCard = {
  href: string;
  title: string;
  description: string;
  eyebrow: string;
};

export const babaMuyiProfile: LegacyProfile = {
  id: "baba-muyi",
  slug: "baba-muyi",
  fullName: "Alhaji Tioluwalase Majekodunmi",
  honorificName: "Alhaji Tioluwalase \"Baba Muyi\" Majekodunmi",
  knownAs: "Baba Muyi",
  summary:
    "A living archive for family history, enterprise, transport heritage, public memories, documentary material, and the values Baba Muyi carried through his life.",
  values: ["Family stewardship", "Enterprise", "Service", "Faith", "Community memory"],
  seoTitle: "Baba Muyi Legacy | Alhaji Tioluwalase Majekodunmi",
  seoDescription:
    "Preserving the life, work, transport history, family story, and lessons of Alhaji Tioluwalase \"Baba Muyi\" Majekodunmi."
};

export const timelineSeed: TimelineEvent[] = [
  {
    id: "family-roots",
    year: "Early years",
    title: "Family roots and formation",
    location: "Nigeria",
    category: "family",
    description:
      "A curated chapter for childhood, family lineage, education, early influences, and the people who shaped his character."
  },
  {
    id: "transport-enterprise",
    year: "Enterprise years",
    title: "Building transport ventures",
    category: "transport",
    description:
      "A dedicated record for Bolekaja history, TIOLUWA LASE Molue stories, vehicle records, routes, drivers, conductors, and community impact."
  },
  {
    id: "community-service",
    year: "Community life",
    title: "Service, counsel, and contribution",
    category: "community",
    description:
      "A place for testimonies from family, neighbours, staff, passengers, business partners, faith communities, and friends."
  }
];

export const publicFeatures: FeatureCard[] = [
  {
    href: "/biography",
    eyebrow: "Life Story",
    title: "Full biography",
    description: "Structured chapters for family roots, work, faith, entrepreneurship, and legacy."
  },
  {
    href: "/timeline",
    eyebrow: "Archive",
    title: "Interactive timeline",
    description: "Milestones, places, images, documents, and memories arranged by period."
  },
  {
    href: "/documentaries",
    eyebrow: "Film",
    title: "Documentary centre",
    description: "Episodes, transcripts, chapters, external playback IDs, and production notes."
  },
  {
    href: "/gallery",
    eyebrow: "Media",
    title: "Photo gallery",
    description: "Albums with captions, alt text, privacy controls, and publication status."
  },
  {
    href: "/journey-map",
    eyebrow: "Routes",
    title: "Journey and route map",
    description: "Transport routes, landmarks, vehicle stories, and historical context."
  },
  {
    href: "/tributes",
    eyebrow: "Memories",
    title: "Community tributes",
    description: "Reviewed public stories, condolences, lessons, and family-approved submissions."
  }
];

export const adminModules = [
  "Legacy profile",
  "Biography chapters",
  "Timeline events",
  "Media albums",
  "Documentaries",
  "Family tree",
  "Lessons and blog",
  "Tribute review",
  "SEO metadata",
  "Site settings",
  "Audit logs"
];
