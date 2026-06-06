import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { RefreshCw, Plus } from "lucide-react";
import type { SubscriptionStatus, BillingCycle } from "@/types/database";
import SubscriptionStatusBadge from "@/components/admin/SubscriptionStatusBadge";

const CYCLE_LABELS: Record<BillingCycle, string> = {
  monthly: "Mensal", quarterly: "Trimestral", semiannual: "Semestral", annual: "Anual",
};

const STATUS_TABS: { value: SubscriptionStatus | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "active", label: "Ativas" },
  { value: "trial", label: "Trial" },
  { value: "past_due", label: "Em Atraso" },
  { value: "suspended", label: "Suspensas" },
  { value: "cancelled", label: "Canceladas" },
];

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function SubscriptionsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const statusFilter = params.status || "all";

  const supabase = await createClient();
  let query = supabase
    .from("subscriptions")
    .select("*, companies(company_name), plans(name)")
    .order("created_at", { ascending: false });
  if (statusFilter !== "all") query = query.eq("status", statusFilter as SubscriptionStatus);

  const { data: subs } = await query;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Assinaturas</h1>
          <p className="text-sm text-slate-400 mt-0.5">{subs?.length ?? 0} assinatura(s)</p>
        </div>
        <Link href="/admin/financeiro/subscriptions/new" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Nova Assinatura
        </Link>
      </div>

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit flex-wrap">
        {STATUS_TABS.map((t) => (
          <Link key={t.value} href={`/admin/financeiro/subscriptions?status=${t.value}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === t.value ? "bg-white text-[#0F3D5E] shadow-sm" : "text-slate-500 hover:text-[#0F3D5E]"}`}>
            {t.label}
          </Link>
        ))}
      </div>

      {subs?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1fr_120px_100px_120px_120px_120px_48px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Empresa</span><span>Plano</span><span>Ciclo</span><span>Valor/mês</span><span>Renovação</span><span>Status</span><span></span>
          </div>
          <div className="divide-y divide-slate-100">
            {subs.map((s) => (
              <div key={s.id} className="grid grid-cols-1 lg:grid-cols-[1fr_120px_100px_120px_120px_120px_48px] gap-2 lg:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors">
                <span className="text-sm font-medium text-[#0F3D5E]">{(s.companies as unknown as { company_name: string } | null)?.company_name ?? "—"}</span>
                <span className="text-xs text-slate-500 truncate">{(s.plans as unknown as { name: string } | null)?.name ?? "Sem plano"}</span>
                <span className="text-xs text-slate-500">{CYCLE_LABELS[s.billing_cycle as BillingCycle]}</span>
                <span className="text-sm font-semibold text-[#10B981]">{formatCurrency(s.monthly_amount)}</span>
                <span className="text-xs text-slate-500">{formatDate(s.renewal_date)}</span>
                <SubscriptionStatusBadge status={s.status as SubscriptionStatus} />
                <Link href={`/admin/financeiro/subscriptions/${s.id}`} className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#0F3D5E] text-white text-xs hover:bg-[#0d3352] transition-colors flex-shrink-0">→</Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <RefreshCw className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-400">Nenhuma assinatura encontrada</p>
        </div>
      )}
    </div>
  );
}
