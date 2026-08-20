import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { PageShell } from "@/components/page-shell";
import { platformBrand } from "@/lib/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Sign in | ${platformBrand.name}`,
  description: "Sign in to manage your digital legacy archive."
};

export default async function LoginPage({ searchParams }: { searchParams?: Promise<{ password?: string }> }) {
  const params = await searchParams;

  return (
    <PageShell eyebrow={platformBrand.name} title="Sign in" description="Sign in to manage your digital legacy archive. Public self-registration is disabled for the first release.">
      <div className="mx-auto max-w-xl">
        <p className="mb-5 text-sm font-semibold text-archive-brown">{platformBrand.tagline}</p>
        {params?.password === "updated" ? (
          <p className="mb-5 rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800" role="status">
            Password updated. Sign in with your new password.
          </p>
        ) : null}
        <AuthForm mode="login" />
        <Link className="mt-4 inline-flex text-sm font-semibold text-archive-brown" href="/reset-password">
          Request a password reset
        </Link>
      </div>
    </PageShell>
  );
}
