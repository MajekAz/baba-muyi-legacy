import { CmsPublicPage } from "@/components/cms/cms-public-page";
import { TributeForm } from "@/components/tribute-form";

export default function TributesPage() {
  return (
    <CmsPublicPage path="/tributes">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <div className="rounded border border-archive-navy/12 bg-white/78 p-6">
          <h2 className="font-serif text-3xl text-archive-navy">Review-first publishing</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Submissions will be stored with moderation status, privacy state, contributor metadata,
            audit logs, and optional media attachments.
          </p>
        </div>
        <TributeForm />
      </div>
    </CmsPublicPage>
  );
}
