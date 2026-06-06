import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AnnouncementDetailAdmin from "./AnnouncementDetailAdmin";

export default async function AdminAnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: ann } = await supabase.from("announcements").select("*").eq("id", id).single();
  if (!ann) notFound();

  const { data: targeted } = await supabase
    .from("announcement_companies")
    .select("company_id, companies(company_name)")
    .eq("announcement_id", id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/admin/announcements" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" /> Comunicados
        </Link>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E] line-clamp-2">{ann.title}</h1>
      </div>
      <AnnouncementDetailAdmin ann={ann} targeted={targeted ?? []} />
    </div>
  );
}
