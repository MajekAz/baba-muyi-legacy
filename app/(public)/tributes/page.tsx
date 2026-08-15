import { CmsPublicPage } from "@/components/cms/cms-public-page";
import { TributeForm } from "@/components/tribute-form";
import { publicCmsPageMetadata } from "@/lib/cms-page-metadata";

export const generateMetadata = () =>
  publicCmsPageMetadata({
    path: "/tributes",
    fallbackTitle: "Share a Memory of Baba Muyi | LegacyHub",
    fallbackDescription: "Submit a reviewed memory, tribute, correction, photograph lead, or context note for the Tioluwalase Majekodunmi archive."
  });

export default function TributesPage() {
  return (
    <CmsPublicPage path="/tributes">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <div className="rounded border border-archive-navy/12 bg-white/78 p-6">
          <h2 className="font-serif text-3xl text-archive-navy">Review-first publishing</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Memories, tributes, corrections, and photograph leads are reviewed before publication.
            Please include context and attribution, and avoid sharing private details about living people
            unless permission has been clearly given.
          </p>
        </div>
        <TributeForm />
      </div>
    </CmsPublicPage>
  );
}
