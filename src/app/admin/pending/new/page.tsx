import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import NewPendingForm from "./NewPendingForm";

export default async function NewPendingPage() {
  const supabase = await createClient();
  const { data: companies } = await supabase
    .from("companies")
    .select("id, company_name")
    .eq("is_active", true)
    .order("company_name");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/admin/pending" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Nova Ação Pendente</h1>
        <p className="text-sm text-slate-400 mt-0.5">Atribua uma tarefa a uma empresa cliente</p>
      </div>
      <NewPendingForm companies={companies ?? []} />
    </div>
  );
}
