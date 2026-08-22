import { NextResponse } from "next/server";
import { z } from "zod";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const emailSchema = z.string().trim().email();
const passwordSchema = z.string().min(8);

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
    const password = passwordSchema.safeParse(formData.get("password"));

    if (!email.success || !password.success) {
      return authJson({ ok: false, message: "Enter a valid email address and password." }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.data,
      password: password.data
    });

    if (error) {
      logAuthError("login failed", error);
      return authJson({ ok: false, message: "Sign in failed. Check your details and try again." }, { status: 401 });
    }

    return authJson({ ok: true, message: "Signed in.", redirectTo: "/admin" });
  } catch (error) {
    logAuthError("login unexpected error", error instanceof Error ? error : { message: "Unknown login error" });
    return authJson({ ok: false, message: "Sign in failed. Check your details and try again." }, { status: 400 });
  }
}
