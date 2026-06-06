import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FileCheck, Plus } from "lucide-react";
import type { CrmProposalStatus } from "@/types/database";
import ProposalStatusBadge from "@/components/crm/ProposalStatusBadge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}
function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

export default async function ProposalsPage() {
  const supabase = await createClient();
  const { data: proposals } = await supabase
    .from("crm_proposals")
    .select("*, companies(company_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Propostas</h1>
          <p className="text-sm text-slate-400 mt-0.5">{proposals?.length ?? 0} proposta(s)</p>
        </div>
        <Link href="/admin/crm/proposals/new" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Nova Proposta
        </Link>
      </div>

      {proposals?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="hidden lg:grid grid-cols-[80px_1fr_160px_120px_120px_100px_48px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Nº</span><span>Empresa</span><span>Plano</span><span>Mensalidade</span><span>Validade</span><span>Status</span><span></span>
          </div>
          <div className="divide-y divide-slate-100">
            {proposals.map((p) => (
              <div key={p.id} className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_120px_120px_100px_48px] gap-2 lg:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors">
                <span className="text-xs font-mono text-slate-500">#{p.proposal_number}</span>
                <span className="text-sm font-medium text-[#0F3D5E] truncate">{(p.companies as unknown as { company_name: string } | null)?.company_name ?? "—"}</span>
                <span className="text-xs text-slate-500 truncate">{p.plan ?? "—"}</span>
                <span className="text-sm font-semibold text-[#10B981]">{formatCurrency(p.monthly_fee)}</span>
                <span className="text-xs text-slate-500">{p.validity_date ? formatDate(p.validity_date) : "—"}</span>
                <ProposalStatusBadge status={p.status as CrmProposalStatus} />
                <Link href={`/admin/crm/proposals/${p.id}`} className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#0F3D5E] text-white text-xs hover:bg-[#0d3352] transition-colors">→</Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <FileCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400">Nenhuma proposta ainda</p>
          <Link href="/admin/crm/proposals/new" className="inline-flex items-center gap-1 mt-3 text-sm text-[#2563EB] hover:underline">
            <Plus className="w-3.5 h-3.5" /> Criar primeira proposta
          </Link>
        </div>
      )}
    </div>
  );
}
