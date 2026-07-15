import { AuthForm } from "@/components/auth-form";
import { PageShell } from "@/components/page-shell";
import { platformBrand } from "@/lib/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Update password | ${platformBrand.name}`,
  description: "Update your LegacyHub password."
};

export default function UpdatePasswordPage() {
  return (
    <PageShell eyebrow={platformBrand.name} title="Update password" description="Use this page after following a verified password reset link for your digital legacy archive.">
      <div className="mx-auto max-w-xl">
        <p className="mb-5 text-sm font-semibold text-archive-brown">{platformBrand.tagline}</p>
        <AuthForm mode="update" />
      </div>
    </PageShell>
  );
}
