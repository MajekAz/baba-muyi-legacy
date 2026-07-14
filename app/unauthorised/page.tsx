import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function UnauthorisedPage() {
  return (
    <PageShell eyebrow="Access" title="Unauthorised" description="Your account does not have permission to view this admin area.">
      <Link className="rounded bg-archive-navy px-5 py-3 text-sm font-semibold text-white" href="/">
        Return home
      </Link>
    </PageShell>
  );
}
