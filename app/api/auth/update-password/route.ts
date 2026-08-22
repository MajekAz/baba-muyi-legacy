import { NextResponse } from "next/server";
import { z } from "zod";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

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
    const passwords = updatePasswordSchema.safeParse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword")
    });

    if (!passwords.success) {
      return authJson(
        {
          ok: false,
          message: passwords.error.issues[0]?.message ?? "Use matching passwords with at least 8 characters."
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password: passwords.data.password
    });

    if (error) {
      logAuthError("password update failed", error);
      return authJson(
        { ok: false, message: "Password update failed. Request a fresh reset link and try again." },
        { status: 401 }
      );
    }

    return authJson({ ok: true, message: "Password updated.", redirectTo: "/login?password=updated" });
  } catch (error) {
    logAuthError("password update unexpected error", error instanceof Error ? error : { message: "Unknown update error" });
    return authJson(
      { ok: false, message: "Password update failed. Request a fresh reset link and try again." },
      { status: 400 }
    );
  }
}
