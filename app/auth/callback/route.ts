import { NextResponse, type NextRequest } from "next/server";
import { getPublicEnv, hasSupabasePublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

function redirectBaseUrl(request: NextRequest) {
  const configuredSiteUrl = getPublicEnv().NEXT_PUBLIC_SITE_URL;

  if (process.env.NODE_ENV !== "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
    return request.nextUrl.origin;
  }

  return configuredSiteUrl;
}

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/admin";
  }

  return value;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeNextPath(requestUrl.searchParams.get("next"));
  const publicBaseUrl = redirectBaseUrl(request);

  if (!hasSupabasePublicEnv()) {
    return NextResponse.redirect(new URL("/login?setup=supabase-required", publicBaseUrl));
  }

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, publicBaseUrl));
}
