import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import NewActivityForm from "./NewActivityForm";

export default async function NewActivityPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase.from("crm_leads").select("id, name, company_name").not("status", "in", '("won","lost")').order("created_at", { ascending: false });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/admin/crm/activities" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Nova Atividade</h1>
      </div>
      <NewActivityForm leads={leads ?? []} />
    </div>
  );
}
