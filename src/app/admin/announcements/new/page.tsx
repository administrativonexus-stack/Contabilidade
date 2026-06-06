import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import NewAnnouncementForm from "./NewAnnouncementForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewAnnouncementPage() {
  const supabase = await createClient();
  const { data: companies } = await supabase
    .from("companies")
    .select("id, company_name")
    .eq("is_active", true)
    .order("company_name");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/admin/announcements" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" /> Comunicados
        </Link>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Novo Comunicado</h1>
      </div>
      <NewAnnouncementForm companies={companies ?? []} />
    </div>
  );
}
