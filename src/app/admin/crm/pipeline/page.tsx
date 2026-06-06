import { createClient } from "@/lib/supabase/server";
import { Kanban, UserPlus } from "lucide-react";
import Link from "next/link";
import KanbanBoard from "./KanbanBoard";
import type { CrmOpportunityStage } from "@/types/database";

export default async function PipelinePage() {
  const supabase = await createClient();

  const { data: opportunities } = await supabase
    .from("crm_opportunities")
    .select("id, title, stage, estimated_value, crm_leads(name, company_name)")
    .order("created_at", { ascending: false });

  const typed = (opportunities ?? []).map((o) => ({
    ...o,
    stage: o.stage as CrmOpportunityStage,
    crm_leads: o.crm_leads as unknown as { name: string; company_name: string | null } | null,
  }));

  return (
    <div className="max-w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Kanban className="w-5 h-5 text-[#2563EB]" />
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Pipeline de Vendas</h1>
        </div>
        <Link href="/admin/crm/leads/new" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          <UserPlus className="w-4 h-4" /> Novo Lead
        </Link>
      </div>

      {typed.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Kanban className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400">Pipeline vazio</p>
          <Link href="/admin/crm/leads/new" className="inline-flex items-center gap-1 mt-3 text-sm text-[#2563EB] hover:underline">
            <UserPlus className="w-3.5 h-3.5" /> Adicionar primeiro lead
          </Link>
        </div>
      ) : (
        <KanbanBoard opportunities={typed} />
      )}
    </div>
  );
}
