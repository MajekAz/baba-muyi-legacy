import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { PageShell } from "@/components/page-shell";

export default function LoginPage() {
  return (
    <PageShell eyebrow="Admin" title="Sign in" description="Access is limited to authorised owner, editor, and contributor accounts. Public self-registration is disabled for the first release.">
      <div className="mx-auto max-w-xl">
        <AuthForm mode="login" />
        <Link className="mt-4 inline-flex text-sm font-semibold text-archive-brown" href="/reset-password">
          Request a password reset
        </Link>
      </div>
    </PageShell>
  );
}
