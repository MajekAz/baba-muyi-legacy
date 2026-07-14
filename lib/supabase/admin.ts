import "server-only";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseServiceEnv } from "@/lib/env";

export function createAdminClient() {
  const { url, serviceRoleKey } = requireSupabaseServiceEnv();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
