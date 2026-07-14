import { CmsPublicPage } from "@/components/cms/cms-public-page";
import { WaitingListForm } from "@/components/waiting-list-form";

export default function WaitingListPage() {
  return (
    <CmsPublicPage path="/waiting-list">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <div className="rounded border border-archive-navy/12 bg-white/78 p-6">
          <h2 className="font-serif text-3xl text-archive-navy">Built from one family outward</h2>
          <p className="mt-4 leading-7 text-slate-700">
            The data model already separates profiles, users, roles, media, relationships, stories,
            categories, tags, and audit trails so additional families can be introduced later.
          </p>
        </div>
        <WaitingListForm />
      </div>
    </CmsPublicPage>
  );
}
