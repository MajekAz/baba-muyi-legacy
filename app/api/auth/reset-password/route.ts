import { NextResponse } from "next/server";
import { z } from "zod";
import { getPublicEnv, hasSupabasePublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const emailSchema = z.string().trim().email();
const resetMessage = "If the email belongs to an authorised user, a reset link has been sent.";

function authJson(body: { ok: boolean; message: string; redirectTo?: string }, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}

function logAuthError(action: string, error: { name?: string; code?: string; status?: number; message?: string }) {
  console.warn("[auth]", action, {
    name: error.name,
    code: error.code,
    status: error.status,
    message: error.message
  });
}

export async function POST(request: Request) {
  try {
    if (!hasSupabasePublicEnv()) {
      return authJson(
        {
          ok: false,
          message: "Supabase is not configured yet. Add your project URL and anon key before using authentication."
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const email = emailSchema.safeParse(formData.get("email"));

    if (!email.success) {
      return authJson({ ok: false, message: "Enter a valid email address." }, { status: 400 });
    }

    const supabase = await createClient();
    const siteUrl = getPublicEnv().NEXT_PUBLIC_SITE_URL;
    const callbackUrl = new URL("/auth/callback", siteUrl);
    callbackUrl.searchParams.set("next", "/update-password");

    const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
      redirectTo: callbackUrl.toString()
    });

    if (error) {
      logAuthError("password reset failed", error);
    }

    return authJson({ ok: true, message: resetMessage });
  } catch (error) {
    logAuthError("password reset unexpected error", error instanceof Error ? error : { message: "Unknown reset error" });
    return authJson({ ok: true, message: resetMessage });
  }
}
