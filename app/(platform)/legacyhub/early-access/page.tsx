import type { Metadata } from "next";
import { EarlyAccessForm } from "@/components/legacyhub/early-access-form";
import { Breadcrumbs, PlatformPageHero, PlatformSection } from "@/components/legacyhub/platform-shell";
import { siteConfig } from "@/lib/site";

const title = "LegacyHub Early Access - Register Your Interest";
const description = "Register interest in LegacyHub early access without creating an account, subscription, workspace, or public archive.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: new URL("/legacyhub/early-access", siteConfig.url).toString() },
  openGraph: { title, description, url: new URL("/legacyhub/early-access", siteConfig.url).toString(), siteName: "LegacyHub", type: "website" },
  robots: { index: false, follow: true }
};

export default function EarlyAccessPage() {
  return (
    <main className="bg-[#f8f3e8] text-slate-950">
      <Breadcrumbs items={[{ label: "Early Access" }]} />
      <PlatformPageHero eyebrow="Early access" title="Register your interest in LegacyHub.">
        <p>Submitting this form expresses interest only. It does not create an account, subscription, workspace, or public archive.</p>
      </PlatformPageHero>
      <PlatformSection>
        <div className="grid gap-8 lg:grid-cols-[.85fr_1fr]">
          <div>
            <h2 className="font-serif text-4xl font-semibold">A reviewed interest workflow.</h2>
            <p className="mt-4 leading-8 text-slate-700">
              Submissions are stored in the existing Supabase <code>waiting_list</code> table with a <code>legacyhub:</code> interest prefix and review metadata. Authorised staff can review them through the protected Supabase project.
            </p>
            <div className="mt-6 rounded border border-amber-700/30 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              Public registration, billing, self-service onboarding, and automatic workspace creation are not enabled.
            </div>
          </div>
          <EarlyAccessForm />
        </div>
      </PlatformSection>
    </main>
  );
}
