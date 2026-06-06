import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ScrollText, Plus } from "lucide-react";
import type { CrmContractStatus } from "@/types/database";
import ContractStatusBadge from "@/components/crm/ContractStatusBadge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}
function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

export default async function ContractsPage() {
  const supabase = await createClient();
  const { data: contracts } = await supabase
    .from("crm_contracts")
    .select("*, companies(company_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Contratos</h1>
          <p className="text-sm text-slate-400 mt-0.5">{contracts?.length ?? 0} contrato(s)</p>
        </div>
        <Link href="/admin/crm/contracts/new" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Novo Contrato
        </Link>
      </div>

      {contracts?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="hidden lg:grid grid-cols-[80px_1fr_120px_120px_120px_120px_48px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Nº</span><span>Empresa</span><span>Mensalidade</span><span>Início</span><span>Término</span><span>Status</span><span></span>
          </div>
          <div className="divide-y divide-slate-100">
            {contracts.map((c) => (
              <div key={c.id} className="grid grid-cols-1 lg:grid-cols-[80px_1fr_120px_120px_120px_120px_48px] gap-2 lg:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors">
                <span className="text-xs font-mono text-slate-500">#{c.contract_number}</span>
                <span className="text-sm font-medium text-[#0F3D5E] truncate">{(c.companies as unknown as { company_name: string } | null)?.company_name ?? "—"}</span>
                <span className="text-sm font-semibold text-[#10B981]">{formatCurrency(c.monthly_fee)}</span>
                <span className="text-xs text-slate-500">{c.start_date ? formatDate(c.start_date) : "—"}</span>
                <span className="text-xs text-slate-500">{c.end_date ? formatDate(c.end_date) : "—"}</span>
                <ContractStatusBadge status={c.status as CrmContractStatus} />
                <Link href={`/admin/crm/contracts/${c.id}`} className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#0F3D5E] text-white text-xs hover:bg-[#0d3352] transition-colors">→</Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <ScrollText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400">Nenhum contrato ainda</p>
        </div>
      )}
    </div>
  );
}
