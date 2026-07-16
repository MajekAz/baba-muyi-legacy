import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { StatusCard } from "@/components/status-card";
import { platformBrand } from "@/lib/brand";

export const metadata: Metadata = {
  title: platformBrand.name,
  description: `${platformBrand.name} future platform marketing route.`,
  robots: {
    index: false,
    follow: false
  }
};

export default function LegacyHubFuturePage() {
  return (
    <PageShell
      eyebrow="Future platform route"
      title={platformBrand.name}
      description="A future marketing surface for the commercial digital legacy platform. Public registration, pricing and billing are not enabled yet."
    >
      <div className="grid gap-5 md:grid-cols-3">
        <StatusCard title="Planned sections" description="Features, examples, who it is for, pricing, about, login, and Create a Legacy." />
        <StatusCard title="Current flagship" description="Baba Muyi Legacy remains the first workspace, first legacy profile, and flagship archive powered by LegacyHub." />
        <StatusCard title={platformBrand.tagline} description="The platform route is intentionally minimal until product marketing and registration are approved." />
      </div>
    </PageShell>
  );
}
