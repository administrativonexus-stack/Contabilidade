import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Layers, Plus } from "lucide-react";
import type { PlanStatus } from "@/types/database";

const STATUS_CONFIG: Record<PlanStatus, { label: string; className: string }> = {
  active:   { label: "Ativo",     className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  inactive: { label: "Inativo",   className: "bg-amber-100 text-amber-700 border border-amber-200" },
  archived: { label: "Arquivado", className: "bg-slate-100 text-slate-400 border border-slate-200" },
};

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function PlansPage() {
  const supabase = await createClient();
  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .order("monthly_price", { ascending: true });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Planos</h1>
          <p className="text-sm text-slate-400 mt-0.5">{plans?.length ?? 0} plano(s) cadastrado(s)</p>
        </div>
        <Link href="/admin/financeiro/plans/new" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Novo Plano
        </Link>
      </div>

      {plans?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1fr_120px_120px_80px_80px_48px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Plano</span><span>Mensalidade</span><span>Setup</span><span>Usuários</span><span>Status</span><span></span>
          </div>
          <div className="divide-y divide-slate-100">
            {plans.map((p) => {
              const cfg = STATUS_CONFIG[p.status as PlanStatus] ?? STATUS_CONFIG.active;
              return (
                <div key={p.id} className="grid grid-cols-1 lg:grid-cols-[1fr_120px_120px_80px_80px_48px] gap-2 lg:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-[#0F3D5E]">{p.name}</p>
                    {p.description && <p className="text-xs text-slate-400 truncate">{p.description}</p>}
                  </div>
                  <span className="text-sm font-semibold text-[#10B981]">{formatCurrency(p.monthly_price)}</span>
                  <span className="text-sm text-slate-500">{formatCurrency(p.setup_fee)}</span>
                  <span className="text-sm text-slate-500">{p.max_users ?? "—"}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.className}`}>{cfg.label}</span>
                  <Link href={`/admin/financeiro/plans/${p.id}`} className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#0F3D5E] text-white text-xs hover:bg-[#0d3352] transition-colors flex-shrink-0">→</Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400">Nenhum plano cadastrado</p>
          <Link href="/admin/financeiro/plans/new" className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#2563EB] font-medium hover:underline">
            <Plus className="w-4 h-4" /> Criar primeiro plano
          </Link>
        </div>
      )}
    </div>
  );
}
