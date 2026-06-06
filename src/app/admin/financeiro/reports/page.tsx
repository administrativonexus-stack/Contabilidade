import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function groupByMonth(invoices: { paid_at: string | null; amount: number }[]) {
  const map: Record<string, { count: number; total: number }> = {};
  for (const inv of invoices) {
    if (!inv.paid_at) continue;
    const d = new Date(inv.paid_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!map[key]) map[key] = { count: 0, total: 0 };
    map[key].count++;
    map[key].total += inv.amount;
  }
  return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
}

function groupByCompany(invoices: { amount: number; paid_at: string | null; companies: unknown }[]) {
  const map: Record<string, { name: string; count: number; total: number; lastPaid: string | null }> = {};
  for (const inv of invoices) {
    if (!inv.paid_at) continue;
    const name = (inv.companies as { company_name: string } | null)?.company_name ?? "—";
    if (!map[name]) map[name] = { name, count: 0, total: 0, lastPaid: null };
    map[name].count++;
    map[name].total += inv.amount;
    if (!map[name].lastPaid || inv.paid_at > map[name].lastPaid!) map[name].lastPaid = inv.paid_at;
  }
  return Object.values(map).sort((a, b) => b.total - a.total);
}

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const params = await searchParams;
  const type = params.type || "monthly";

  const supabase = await createClient();

  const [{ data: paidInvoices }, { data: planData }] = await Promise.all([
    supabase.from("invoices").select("amount, paid_at, companies(company_name)").eq("status", "paid").order("paid_at", { ascending: false }),
    supabase.from("subscriptions").select("monthly_amount, status, plans(name)").in("status", ["active", "trial"]),
  ]);

  const tabs = [
    { value: "monthly", label: "Por Mês" },
    { value: "customer", label: "Por Cliente" },
    { value: "plan", label: "Por Plano" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Relatórios Financeiros</h1>
        <p className="text-sm text-slate-400 mt-0.5">Receita consolidada de faturas pagas</p>
      </div>

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <Link key={t.value} href={`/admin/financeiro/reports?type=${t.value}`}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${type === t.value ? "bg-white text-[#0F3D5E] shadow-sm" : "text-slate-500 hover:text-[#0F3D5E]"}`}>
            {t.label}
          </Link>
        ))}
      </div>

      {type === "monthly" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1fr_100px_160px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Mês</span><span>Faturas</span><span>Total Recebido</span>
          </div>
          <div className="divide-y divide-slate-100">
            {groupByMonth(paidInvoices ?? []).map(([month, data]) => {
              const [year, m] = month.split("-");
              const label = new Date(Number(year), Number(m) - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
              return (
                <div key={month} className="grid grid-cols-1 lg:grid-cols-[1fr_100px_160px] gap-2 lg:gap-4 px-5 py-4 items-center">
                  <span className="text-sm font-medium text-[#0F3D5E] capitalize">{label}</span>
                  <span className="text-sm text-slate-500">{data.count} fatura(s)</span>
                  <span className="text-sm font-bold text-[#10B981]">{formatCurrency(data.total)}</span>
                </div>
              );
            })}
            {!paidInvoices?.length && (
              <div className="px-5 py-8 text-center text-sm text-slate-400">Nenhuma fatura paga ainda</div>
            )}
          </div>
        </div>
      )}

      {type === "customer" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1fr_100px_160px_140px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Empresa</span><span>Faturas</span><span>Total</span><span>Último Pagamento</span>
          </div>
          <div className="divide-y divide-slate-100">
            {groupByCompany(paidInvoices ?? []).map((c) => (
              <div key={c.name} className="grid grid-cols-1 lg:grid-cols-[1fr_100px_160px_140px] gap-2 lg:gap-4 px-5 py-4 items-center">
                <span className="text-sm font-medium text-[#0F3D5E]">{c.name}</span>
                <span className="text-sm text-slate-500">{c.count}</span>
                <span className="text-sm font-bold text-[#10B981]">{formatCurrency(c.total)}</span>
                <span className="text-xs text-slate-400">{c.lastPaid ? new Date(c.lastPaid).toLocaleDateString("pt-BR") : "—"}</span>
              </div>
            ))}
            {!paidInvoices?.length && (
              <div className="px-5 py-8 text-center text-sm text-slate-400">Nenhum dado disponível</div>
            )}
          </div>
        </div>
      )}

      {type === "plan" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1fr_100px_160px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Plano</span><span>Assinantes</span><span>MRR</span>
          </div>
          <div className="divide-y divide-slate-100">
            {(() => {
              const map: Record<string, { name: string; count: number; mrr: number }> = {};
              for (const s of planData ?? []) {
                const name = (s.plans as unknown as { name: string } | null)?.name ?? "Sem plano";
                if (!map[name]) map[name] = { name, count: 0, mrr: 0 };
                map[name].count++;
                map[name].mrr += s.monthly_amount;
              }
              const rows = Object.values(map).sort((a, b) => b.mrr - a.mrr);
              return rows.length ? rows.map((r) => (
                <div key={r.name} className="grid grid-cols-1 lg:grid-cols-[1fr_100px_160px] gap-2 lg:gap-4 px-5 py-4 items-center">
                  <span className="text-sm font-medium text-[#0F3D5E]">{r.name}</span>
                  <span className="text-sm text-slate-500">{r.count} assin.</span>
                  <span className="text-sm font-bold text-[#10B981]">{formatCurrency(r.mrr)}/mês</span>
                </div>
              )) : (
                <div className="px-5 py-8 text-center text-sm text-slate-400">Nenhuma assinatura ativa</div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
