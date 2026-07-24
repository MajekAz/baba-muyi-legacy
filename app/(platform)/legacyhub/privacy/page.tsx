import type { Metadata } from "next";
import { Breadcrumbs, PlatformPageHero, PlatformSection } from "@/components/legacyhub/platform-shell";
import { siteConfig } from "@/lib/site";

const title = "LegacyHub Privacy Notice";
const description = "A preliminary privacy notice for LegacyHub early-access and contact enquiries.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: new URL("/legacyhub/privacy", siteConfig.url).toString() },
  openGraph: { title, description, url: new URL("/legacyhub/privacy", siteConfig.url).toString(), siteName: "LegacyHub", type: "website" },
  robots: { index: false, follow: true }
};

export default function PlatformPrivacyPage() {
  return (
    <main className="bg-[#f8f3e8] text-slate-950">
      <Breadcrumbs items={[{ label: "Privacy" }]} />
      <PlatformPageHero eyebrow="Preliminary privacy notice" title="LegacyHub Privacy Notice">
        <p>This page is a preliminary product privacy notice for the Phase 2 platform experience. It should receive legal review before public launch.</p>
      </PlatformPageHero>
      <PlatformSection>
        <div className="grid gap-5 lg:grid-cols-2">
          {[
            ["Information collected", "Early-access forms collect name, email, organisation or family name, archive type, country, short description, consent, IP address, and browser user agent."],
            ["Why it is collected", "The information is used to review interest in LegacyHub and decide whether to follow up about future archive work."],
            ["How it is used", "Submissions are not used to create accounts, workspaces, subscriptions, or public archives automatically."],
            ["Retention approach", "Enquiries are retained for review until they are no longer needed or deletion is requested and appropriate."],
            ["Who can access it", "Authorised project owners or staff with protected Supabase access can review early-access records."],
            ["User rights and contact", "People can use the LegacyHub contact page to ask about access, correction, or deletion of an enquiry."],
            ["Cookies and analytics", "No separate analytics or marketing cookie system is introduced by the Phase 2 platform pages."],
            ["Legal review", "This notice does not claim legal certification or full regulatory compliance processes."]
          ].map(([heading, body]) => (
            <article className="rounded border border-stone-300 bg-white p-6" key={heading}>
              <h2 className="font-serif text-2xl font-semibold">{heading}</h2>
              <p className="mt-3 leading-7 text-slate-700">{body}</p>
            </article>
          ))}
        </div>
      </PlatformSection>
    </main>
  );
}
