import type { Database } from "@/lib/database.types";

export const contactSubmissionTypes = [
  "memory",
  "family_information",
  "correction",
  "media_contribution",
  "documentary_contact",
  "general"
] as const;

export const contactSubmissionStatuses = ["new", "in_review", "resolved", "archived"] as const;

export type ContactSubmissionType = (typeof contactSubmissionTypes)[number];
export type ContactSubmissionStatus = (typeof contactSubmissionStatuses)[number];
export type ContactSubmission = Database["public"]["Tables"]["contact_submissions"]["Row"];

export const contactTypeLabels: Record<ContactSubmissionType, string> = {
  memory: "Share a memory",
  family_information: "Family information",
  correction: "Correction or clarification",
  media_contribution: "Photo, document, audio, or video contribution",
  documentary_contact: "Documentary enquiry",
  general: "General enquiry"
};

export const contactStatusLabels: Record<ContactSubmissionStatus, string> = {
  new: "New",
  in_review: "In review",
  resolved: "Resolved",
  archived: "Archived"
};
