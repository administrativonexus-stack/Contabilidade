import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { data: profile } = await supabase.from("users").select("id, user_companies(company_id)").eq("auth_user_id", user.id).single();
  const companyId = (profile?.user_companies as { company_id: string }[] | null)?.[0]?.company_id;

  const { data: doc } = await supabase.from("documents").select("id, file_path, file_name, company_id").eq("id", id).is("deleted_at", null).single();

  if (!doc || doc.company_id !== companyId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const bucket = "documents";
  const { data: signedUrl, error } = await supabase.storage.from(bucket).createSignedUrl(doc.file_path, 900);

  if (error || !signedUrl) {
    return NextResponse.json({ error: "Failed to generate download link" }, { status: 500 });
  }

  // Log download
  if (profile?.id) {
    await supabase.from("document_downloads").insert({ document_id: doc.id, user_id: profile.id });
    await supabase.from("audit_logs").insert({
      user_id: profile.id,
      action: "document.download",
      entity_type: "documents",
      entity_id: doc.id,
      metadata: { file_name: doc.file_name },
    });
  }

  return NextResponse.redirect(signedUrl.signedUrl);
}
