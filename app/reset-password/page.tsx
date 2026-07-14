import { AuthForm } from "@/components/auth-form";
import { PageShell } from "@/components/page-shell";

export default function ResetPasswordPage() {
  return (
    <PageShell eyebrow="Admin" title="Reset password" description="Password reset links are only useful for accounts already created by the archive owner.">
      <div className="mx-auto max-w-xl">
        <AuthForm mode="reset" />
      </div>
    </PageShell>
  );
}
