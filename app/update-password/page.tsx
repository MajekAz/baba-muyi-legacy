import { AuthForm } from "@/components/auth-form";
import { PageShell } from "@/components/page-shell";
import { platformBrand } from "@/lib/brand";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Update password | ${platformBrand.name}`,
  description: "Update your LegacyHub password."
};

export default async function UpdatePasswordPage() {
  let hasRecoverySession = false;

  if (hasSupabasePublicEnv()) {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    hasRecoverySession = Boolean(user);
  }

  return (
    <PageShell eyebrow={platformBrand.name} title="Update password" description="Use this page after following a verified password reset link for your digital legacy archive.">
      <div className="mx-auto max-w-xl">
        <p className="mb-5 text-sm font-semibold text-archive-brown">{platformBrand.tagline}</p>
        {hasRecoverySession ? (
          <AuthForm mode="update" />
        ) : (
          <div className="rounded border border-archive-navy/12 bg-white p-6 text-sm leading-6 text-slate-700 shadow-sm" role="alert">
            <p className="font-semibold text-archive-navy">This password reset link is missing, expired, or has already been used.</p>
            <Link className="mt-4 inline-flex rounded bg-archive-navy px-4 py-2 text-sm font-semibold text-white" href="/reset-password">
              Request a fresh reset link
            </Link>
          </div>
        )}
      </div>
    </PageShell>
  );
}
