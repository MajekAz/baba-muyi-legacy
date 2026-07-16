import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await requireLegacyProfilePermission("access_media_library");
  const { id } = await params;
  const supabase = await createClient();

  const { data: record, error } = await supabase
    .from("media_items")
    .select("id, storage_bucket, bucket, storage_path, workspace_id, legacy_profile_id, publication_status")
    .eq("id", id)
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !record) {
    return NextResponse.json({ error: "Media not found." }, { status: 404 });
  }

  if (record.publication_status === "archived") {
    return NextResponse.json({ error: "Archived media is not available." }, { status: 410 });
  }

  const bucket = record.storage_bucket ?? record.bucket;
  if (!bucket || !record.storage_path) {
    return NextResponse.json({ error: "Media storage path is unavailable." }, { status: 404 });
  }

  const admin = createAdminClient();
  const { data, error: signedError } = await admin.storage.from(bucket).createSignedUrl(record.storage_path, 60 * 10);
  if (signedError || !data?.signedUrl) {
    return NextResponse.json({ error: "Unable to create a secure media link." }, { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl);
}
