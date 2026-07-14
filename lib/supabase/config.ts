import { hasSupabasePublicEnv, requireSupabasePublicEnv } from "@/lib/env";

export function hasSupabaseBrowserConfig() {
  return hasSupabasePublicEnv();
}

export function requireSupabaseBrowserConfig() {
  requireSupabasePublicEnv();
}
