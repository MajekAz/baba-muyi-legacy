import type { Metadata } from "next";
import Link from "next/link";
import { ArchiveContactForm } from "@/components/contact/archive-contact-form";

export const metadata: Metadata = {
  title: "Contact the Archive | Tioluwalase Majekodunmi Legacy",
  description: "Contact the Tioluwalase Majekodunmi Legacy Archive team, share a memory, suggest a correction, or offer approved family archive material for review.",
  alternates: {
    canonical: "/contact"
  },
  openGraph: {
    title: "Contact the Tioluwalase Majekodunmi Legacy Archive",
    description: "Share a memory, correction, family detail, or archive material with the editorial team for respectful review.",
    url: "/contact",
    siteName: "Tioluwalase Majekodunmi Legacy"
  },
  twitter: {
    card: "summary",
    title: "Contact the Archive",
    description: "Share a memory, correction, family detail, or archive material for review."
  }
};

const contributionTypes = [
  "Memories and personal recollections",
  "Photographs or restored family images",
  "Documents, letters, and archive references",
  "Corrections, clarifications, and source notes",
  "Documentary enquiries and permissions"
];

export default function ContactPage() {
  return (
    <main className="bg-archive-cream text-archive-navy">
      <section className="border-b border-white/10 bg-archive-navy px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_.8fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-archive-gold">Archive contact centre</p>
            <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Contact the Tioluwalase Majekodunmi Legacy Archive
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/82">
              Share a memory, submit a correction, offer archive material, or contact the editorial team about the documentary and family archive.
            </p>
          </div>
          <div className="rounded border border-white/15 bg-white/8 p-6 text-sm leading-6 text-white/76">
            <p className="font-semibold text-archive-gold">Editorial review promise</p>
            <p className="mt-3">
              Every public contribution is reviewed before it appears in the archive. Submitted files are stored privately and are never auto-published.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.78fr_1.22fr]">
          <aside className="grid content-start gap-6">
            <div className="rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl font-semibold">What you can send</h2>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
                {contributionTypes.map((item) => (
                  <li key={item} className="border-l-2 border-archive-gold pl-3">{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl font-semibold">Direct contact</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                For sensitive family matters or urgent editorial questions, email the archive team directly.
              </p>
              <a className="mt-4 inline-flex rounded border border-archive-navy/20 px-4 py-2 text-sm font-bold text-archive-navy hover:bg-archive-cream" href="mailto:archive@tioluwalasemajekodunmi.com">
                archive@tioluwalasemajekodunmi.com
              </a>
            </div>

            <div className="rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl font-semibold">Before public use</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                The archive team may contact contributors to confirm context, names, permissions, source details, and whether a submitted item can be shown publicly.
              </p>
              <Link className="mt-4 inline-flex text-sm font-bold text-archive-brown underline-offset-4 hover:underline" href="/about">
                Read about the archive
              </Link>
            </div>
          </aside>

          <section aria-labelledby="contact-form-title">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-archive-brown">Contribution form</p>
              <h2 id="contact-form-title" className="mt-2 font-serif text-3xl font-semibold">Send a message for review</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                Please share only information or files you have permission to submit. The editorial team will review the material before any public archive use.
              </p>
            </div>
            <ArchiveContactForm />
          </section>
        </div>
      </section>
    </main>
  );
}
