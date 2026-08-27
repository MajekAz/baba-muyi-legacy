import { NextResponse } from "next/server";
import { getContactSubmission } from "@/lib/contact/queries";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

export const dynamic = "force-dynamic";

type AttachmentRouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: AttachmentRouteProps) {
  const context = await requireLegacyProfilePermission("review_submissions");
  const { id } = await params;
  const submission = await getContactSubmission(context, id);

  if (!submission?.attachment_bucket || !submission.attachment_path) {
    return NextResponse.json({ ok: false, message: "Attachment not found." }, { status: 404 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(submission.attachment_bucket)
    .createSignedUrl(submission.attachment_path, 60 * 5);

  if (error || !data?.signedUrl) {
    return NextResponse.json({ ok: false, message: "Attachment could not be opened." }, { status: 404 });
  }

  return NextResponse.redirect(data.signedUrl);
}
