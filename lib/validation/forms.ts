import { z } from "zod";

export const tributeFormSchema = z.object({
  legacyProfileId: z.string().uuid().optional(),
  authorName: z.string().trim().min(2).max(120),
  authorEmail: z.string().trim().email().max(180).optional().or(z.literal("")),
  relationship: z.string().trim().max(120).optional(),
  message: z.string().trim().min(20).max(4000),
  consentToPublish: z.literal(true)
});

export const waitingListSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  interest: z.enum(["family", "community", "organisation", "other"]),
  note: z.string().trim().max(1000).optional()
});

export const legacyHubInterestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  organisation: z.string().trim().min(2).max(160),
  archiveType: z.enum([
    "family_legacy",
    "community_history",
    "cultural_heritage",
    "institution_or_school",
    "religious_organisation",
    "military_or_veterans_history",
    "business_or_founder_story",
    "museum_or_heritage_project",
    "other"
  ]),
  description: z.string().trim().min(20).max(1600),
  country: z.string().trim().min(2).max(120),
  consent: z.literal(true),
  website: z.string().trim().max(0).optional()
});

export type TributeFormInput = z.infer<typeof tributeFormSchema>;
export type WaitingListInput = z.infer<typeof waitingListSchema>;
export type LegacyHubInterestInput = z.infer<typeof legacyHubInterestSchema>;
