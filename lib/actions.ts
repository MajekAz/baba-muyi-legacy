"use server";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { legacyHubInterestSchema, tributeFormSchema, waitingListSchema } from "@/lib/validation/forms";

export async function submitTribute(_: unknown, formData: FormData) {
  const parsed = tributeFormSchema.safeParse({
    authorName: formData.get("authorName"),
    authorEmail: formData.get("authorEmail"),
    relationship: formData.get("relationship"),
    message: formData.get("message"),
    consentToPublish: formData.get("consentToPublish") === "on"
  });

  if (!parsed.success) {
    return { ok: false, message: "Please check the tribute form and try again." };
  }

  const headersList = await headers();
  console.info("Tribute submission received", {
    authorName: parsed.data.authorName,
    ip: headersList.get("x-forwarded-for")?.split(",")[0] ?? "unknown"
  });

  return {
    ok: true,
    message: "Thank you. Your memory has been received and will be reviewed before publishing."
  };
}

export async function joinWaitingList(_: unknown, formData: FormData) {
  const parsed = waitingListSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    interest: formData.get("interest"),
    note: formData.get("note")
  });

  if (!parsed.success) {
    return { ok: false, message: "Please check the waiting-list form and try again." };
  }

  console.info("Waiting-list submission received", {
    email: parsed.data.email,
    interest: parsed.data.interest
  });

  return { ok: true, message: "You are on the list. We will share early platform updates." };
}

export async function submitLegacyHubInterest(_: unknown, formData: FormData) {
  const parsed = legacyHubInterestSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    organisation: formData.get("organisation"),
    archiveType: formData.get("archiveType"),
    description: formData.get("description"),
    country: formData.get("country"),
    consent: formData.get("consent") === "on",
    website: formData.get("website")
  });

  if (!parsed.success) {
    return { ok: false, message: "Please check the early-access form and try again." };
  }

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = headersList.get("user-agent") ?? "unknown";
  const supabase = createAdminClient();
  const email = parsed.data.email.toLowerCase();
  const interest = `legacyhub:${parsed.data.archiveType}`;
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const existing = await supabase
    .from("waiting_list")
    .select("id")
    .eq("email", email)
    .eq("interest", interest)
    .gte("created_at", cutoff)
    .limit(1);

  if (existing.error) {
    return { ok: false, message: "We could not save your interest right now. Please try again later." };
  }

  if (existing.data.length > 0) {
    return { ok: true, message: "Your interest is already recorded for review. This has not created an account or workspace." };
  }

  const note = JSON.stringify({
    source: "legacyhub_phase_2_landing_page",
    organisation: parsed.data.organisation,
    archiveType: parsed.data.archiveType,
    country: parsed.data.country,
    description: parsed.data.description,
    consent: true,
    reviewStatus: "new",
    receivedIp: ip,
    userAgent
  });

  const inserted = await supabase.from("waiting_list").insert({
    name: parsed.data.name,
    email,
    interest,
    note
  });

  if (inserted.error) {
    return { ok: false, message: "We could not save your interest right now. Please try again later." };
  }

  return {
    ok: true,
    message: "Thank you. Your interest has been securely recorded for review. This has not created an account or workspace."
  };
}
