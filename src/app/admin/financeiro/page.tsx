import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DollarSign, Receipt, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import StatCard from "@/components/portal/StatCard";
import type { InvoiceStatus } from "@/types/database";
import InvoiceStatusBadge from "@/components/admin/InvoiceStatusBadge";
import SubscriptionStatusBadge from "@/components/admin/SubscriptionStatusBadge";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default async function FinanceiroDashboardPage() {
  const supabase = await createClient();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const todayStr = now.toISOString().split("T")[0];

  const [
    { data: activeSubs },
    { count: pendingCount },
    { count: overdueCount },
    { data: paidThisMonth },
    { data: recentInvoices },
    { data: renewingSoon },
  ] = await Promise.all([
    supabase.from("subscriptions").select("monthly_amount").eq("status", "active"),
    supabase.from("invoices").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("invoices").select("id", { count: "exact", head: true }).eq("status", "overdue"),
    supabase.from("invoices").select("amount").eq("status", "paid").gte("paid_at", monthStart),
    supabase.from("invoices").select("id, invoice_number, amount, due_date, status, companies(company_name)").order("created_at", { ascending: false }).limit(5),
    supabase.from("subscriptions").select("id, monthly_amount, renewal_date, companies(company_name), plans(name)").eq("status", "active").lte("renewal_date", sevenDaysLater).gte("renewal_date", todayStr).order("renewal_date"),
  ]);

  const mrr = activeSubs?.reduce((sum, s) => sum + s.monthly_amount, 0) ?? 0;
  const receivedThisMonth = paidThisMonth?.reduce((sum, i) => sum + i.amount, 0) ?? 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Financeiro</h1>
        <p className="text-sm text-slate-400 mt-0.5">Visão geral do faturamento</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="MRR" value={formatCurrency(mrr)} icon={DollarSign} color="green" />
        <StatCard label="Faturas Pendentes" value={pendingCount ?? 0} icon={Receipt} color="yellow" href="/admin/financeiro/invoices?status=pending" />
        <StatCard label="Faturas Vencidas" value={overdueCount ?? 0} icon={AlertCircle} color="red" href="/admin/financeiro/invoices?status=overdue" />
        <StatCard label="Recebido este mês" value={formatCurrency(receivedThisMonth)} icon={CheckCircle2} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-[#0F3D5E]">Últimas Faturas</h2>
            <Link href="/admin/financeiro/invoices" className="text-xs text-[#2563EB] hover:underline">Ver todas</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentInvoices?.length ? recentInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-xs font-mono text-slate-400">#{inv.invoice_number}</p>
                  <p className="text-sm font-medium text-[#0F3D5E] truncate max-w-[160px]">{(inv.companies as unknown as { company_name: string } | null)?.company_name ?? "—"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#10B981]">{formatCurrency(inv.amount)}</span>
                  <span className="text-xs text-slate-400">{formatDate(inv.due_date)}</span>
                  <InvoiceStatusBadge status={inv.status as InvoiceStatus} />
                </div>
              </div>
            )) : (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-slate-400">Nenhuma fatura ainda</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-[#0F3D5E]">Renovações próximas (7 dias)</h2>
            <Link href="/admin/financeiro/subscriptions" className="text-xs text-[#2563EB] hover:underline">Ver todas</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {renewingSoon?.length ? renewingSoon.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-[#0F3D5E] truncate max-w-[160px]">{(s.companies as unknown as { company_name: string } | null)?.company_name ?? "—"}</p>
                  <p className="text-xs text-slate-400">{(s.plans as unknown as { name: string } | null)?.name ?? "Sem plano"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#10B981]">{formatCurrency(s.monthly_amount)}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1"><RefreshCw className="w-3 h-3" />{formatDate(s.renewal_date)}</span>
                </div>
              </div>
            )) : (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-slate-400">Nenhuma renovação nos próximos 7 dias</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
