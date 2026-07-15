import { AuthForm } from "@/components/auth-form";
import { PageShell } from "@/components/page-shell";
import { platformBrand } from "@/lib/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Reset password | ${platformBrand.name}`,
  description: "Reset access to manage your digital legacy archive."
};

export default function ResetPasswordPage() {
  return (
    <PageShell eyebrow={platformBrand.name} title="Reset password" description="Reset access to manage your digital legacy archive. Password reset links are only useful for accounts already created by an archive owner.">
      <div className="mx-auto max-w-xl">
        <p className="mb-5 text-sm font-semibold text-archive-brown">{platformBrand.tagline}</p>
        <AuthForm mode="reset" />
      </div>
    </PageShell>
  );
}
