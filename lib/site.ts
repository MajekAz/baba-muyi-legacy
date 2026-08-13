import { z } from "zod";
import { flagshipArchiveBrand } from "@/lib/brand";

export const siteConfig = {
  name: flagshipArchiveBrand.name,
  domain: "babamuyilegacy.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://babamuyilegacy.com",
  description:
    "A premium digital legacy, documentary archive, and family-history website preserving the life and values of Alhaji Tioluwalase \"Baba Muyi\" Majekodunmi. Powered by LegacyHub.",
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
    "A respectful archive preserving family history, transport heritage, documentary material, public memories, and the values Baba Muyi carried through his life.",
  values: ["Family stewardship", "Enterprise", "Service", "Faith", "Community memory"],
  seoTitle: "Baba Muyi Legacy | Alhaji Tioluwalase Majekodunmi",
  seoDescription:
    "Preserving the life, work, transport history, family story, and lessons of Alhaji Tioluwalase \"Baba Muyi\" Majekodunmi."
};

export const timelineSeed: TimelineEvent[] = [
  {
    id: "family-roots",
    year: "Early years",
    title: "Birth and family roots in Abeokuta",
    location: "Abeokuta and Iboogun",
    category: "family",
    description:
      "The approved biography records Baba Muyi’s birth in Abeokuta and family roots connected to Iboogun."
  },
  {
    id: "transport-enterprise",
    year: "Enterprise years",
    title: "From Bolekaja to TIOLUWA LASE",
    category: "transport",
    description:
      "His transport story includes the Bolekaja period and the TIOLUWA LASE identity associated with his bus enterprise."
  },
  {
    id: "community-service",
    year: "Community life",
    title: "Community leadership and service",
    category: "community",
    description:
      "The biography remembers him as a high chief, community figure, adviser, helper, and family patriarch."
  }
];

export const publicFeatures: FeatureCard[] = [
  {
    href: "/biography",
    eyebrow: "Life Story",
    title: "Official biography",
    description: "Approved chapters covering family roots, Bariga, enterprise, transport heritage, service, family responsibility, resilience, and legacy."
  },
  {
    href: "/timeline",
    eyebrow: "Archive",
    title: "Historical timeline",
    description: "Broad life phases are presented carefully where exact dates are not yet verified."
  },
  {
    href: "/documentaries",
    eyebrow: "Film",
    title: "Documentary centre",
    description: "Documentary material connected to biography, family memories, historical records, photographs, and transport heritage."
  },
  {
    href: "/gallery",
    eyebrow: "Media",
    title: "Photo gallery",
    description: "Published images appear with reviewed captions, source notes, permissions, privacy controls, and publication status."
  },
  {
    href: "/timeline",
    eyebrow: "Routes",
    title: "Journey and route context",
    description: "Transport routes, landmarks, vehicle stories, and historical context belong with approved timeline and biography records."
  },
  {
    href: "/tributes",
    eyebrow: "Memories",
    title: "Community tributes",
    description: "Reviewed public memories, tributes, corrections, and family-approved submissions."
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
