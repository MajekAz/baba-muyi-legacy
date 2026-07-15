import { z } from "zod";

const placeholderValues = new Set([
  "",
  "https://your-project.supabase.co",
  "your-anon-key",
  "server-only-service-role-key"
]);

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://babamuyilegacy.com"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20).optional()
});

const serverEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20).optional()
});

function cleanEnvValue(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return placeholderValues.has(trimmed) ? undefined : trimmed;
}

export function getPublicEnv() {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_SITE_URL: cleanEnvValue(process.env.NEXT_PUBLIC_SITE_URL) ?? "https://babamuyilegacy.com",
    NEXT_PUBLIC_SUPABASE_URL: cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  });
}

export function getServerEnv() {
  return serverEnvSchema.parse({
    ...getPublicEnv(),
    SUPABASE_SERVICE_ROLE_KEY: cleanEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY)
  });
}

export function hasSupabasePublicEnv() {
  const env = getPublicEnv();
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function allowsLocalFallback() {
  return process.env.NODE_ENV !== "production" || process.env.LEGACYHUB_ENABLE_LOCAL_FALLBACK === "true";
}

export function requireSupabasePublicEnv() {
  const env = getPublicEnv();

  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."
    );
  }

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };
}

export function requireSupabaseServiceEnv() {
  const env = getServerEnv();
  const publicEnv = requireSupabasePublicEnv();

  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for trusted server-side administrative tasks.");
  }

  return {
    ...publicEnv,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY
  };
}
