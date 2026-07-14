"use server";

import { headers } from "next/headers";
import { tributeFormSchema, waitingListSchema } from "@/lib/validation/forms";

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
