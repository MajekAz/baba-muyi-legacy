import { AuthForm } from "@/components/auth-form";
import { PageShell } from "@/components/page-shell";

export default function UpdatePasswordPage() {
  return (
    <PageShell eyebrow="Admin" title="Update password" description="Use this page after following a verified Supabase password reset link.">
      <div className="mx-auto max-w-xl">
        <AuthForm mode="update" />
      </div>
    </PageShell>
  );
}
