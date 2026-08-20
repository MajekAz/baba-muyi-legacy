"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getPublicEnv, hasSupabasePublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const emailSchema = z.string().trim().email();
const passwordSchema = z.string().min(8);
const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"]
  });

function setupRequired() {
  return {
    ok: false,
    message: "Supabase is not configured yet. Add your project URL and anon key before using authentication."
  };
}

export async function signInWithPassword(_: unknown, formData: FormData) {
  if (!hasSupabasePublicEnv()) {
    return setupRequired();
  }

  const email = emailSchema.safeParse(formData.get("email"));
  const password = passwordSchema.safeParse(formData.get("password"));

  if (!email.success || !password.success) {
    return { ok: false, message: "Enter a valid email address and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.data,
    password: password.data
  });

  if (error) {
    return { ok: false, message: "Sign in failed. Check your details and try again." };
  }

  redirect("/admin");
}

export async function signOut() {
  if (hasSupabasePublicEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}

export async function requestPasswordReset(_: unknown, formData: FormData) {
  if (!hasSupabasePublicEnv()) {
    return setupRequired();
  }

  const email = emailSchema.safeParse(formData.get("email"));

  if (!email.success) {
    return { ok: false, message: "Enter a valid email address." };
  }

  const supabase = await createClient();
  const siteUrl = getPublicEnv().NEXT_PUBLIC_SITE_URL;
  const callbackUrl = new URL("/auth/callback", siteUrl);
  callbackUrl.searchParams.set("next", "/update-password");

  const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: callbackUrl.toString()
  });

  if (error) {
    return { ok: false, message: "Password reset could not be sent. Try again later." };
  }

  return { ok: true, message: "If the email belongs to an authorised user, a reset link has been sent." };
}

export async function updatePassword(_: unknown, formData: FormData) {
  if (!hasSupabasePublicEnv()) {
    return setupRequired();
  }

  const passwords = updatePasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });

  if (!passwords.success) {
    return { ok: false, message: passwords.error.issues[0]?.message ?? "Use matching passwords with at least 8 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: passwords.data.password
  });

  if (error) {
    return { ok: false, message: "Password update failed. Request a fresh reset link and try again." };
  }

  redirect("/login?password=updated");
}
