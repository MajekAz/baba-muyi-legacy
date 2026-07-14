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

export type TributeFormInput = z.infer<typeof tributeFormSchema>;
export type WaitingListInput = z.infer<typeof waitingListSchema>;
