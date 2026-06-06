import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { SubscriptionStatus, BillingCycle, InvoiceStatus } from "@/types/database";
import SubscriptionStatusBadge from "@/components/admin/SubscriptionStatusBadge";
import InvoiceStatusBadge from "@/components/admin/InvoiceStatusBadge";
import SubscriptionActions from "./SubscriptionActions";

const CYCLE_LABELS: Record<BillingCycle, string> = {
  monthly: "Mensal", quarterly: "Trimestral", semiannual: "Semestral", annual: "Anual",
};

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-400 font-medium uppercase tracking-wide w-28 flex-shrink-0">{label}</span>
      <span className="text-sm text-[#0F3D5E] font-medium text-right">{value}</span>
    </div>
  );
}

export default async function SubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: sub }, { data: invoices }] = await Promise.all([
    supabase.from("subscriptions").select("*, companies(company_name), plans(name)").eq("id", id).single(),
    supabase.from("invoices").select("id, invoice_number, amount, due_date, status").eq("subscription_id", id).order("due_date", { ascending: false }).limit(10),
  ]);
  if (!sub) notFound();

  const company = sub.companies as unknown as { company_name: string } | null;
  const plan = sub.plans as unknown as { name: string } | null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/admin/financeiro/subscriptions" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">{company?.company_name ?? "Assinatura"}</h1>
          <SubscriptionStatusBadge status={sub.status as SubscriptionStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-[#0F3D5E] mb-3">Detalhes</h2>
            <InfoRow label="Empresa" value={company?.company_name ?? "—"} />
            <InfoRow label="Plano" value={plan?.name ?? "Sem plano"} />
            <InfoRow label="Ciclo" value={CYCLE_LABELS[sub.billing_cycle as BillingCycle]} />
            <InfoRow label="Valor/mês" value={<span className="text-[#10B981] font-bold">{formatCurrency(sub.monthly_amount)}</span>} />
            <InfoRow label="Início" value={formatDate(sub.start_date)} />
            <InfoRow label="Renovação" value={formatDate(sub.renewal_date)} />
            {sub.notes && <InfoRow label="Obs." value={sub.notes} />}
          </div>

          {invoices && invoices.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-[#0F3D5E]">Faturas vinculadas</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-xs font-mono text-slate-500">#{inv.invoice_number}</p>
                      <p className="text-sm font-medium text-[#0F3D5E]">{formatCurrency(inv.amount)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{formatDate(inv.due_date)}</span>
                      <InvoiceStatusBadge status={inv.status as InvoiceStatus} />
                      <Link href={`/admin/financeiro/invoices/${inv.id}`} className="text-xs text-[#2563EB] hover:underline">Ver</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-[#0F3D5E] mb-3">Ações</h2>
            <SubscriptionActions
              subId={sub.id}
              currentStatus={sub.status as SubscriptionStatus}
              renewalDate={sub.renewal_date}
              billingCycle={sub.billing_cycle as BillingCycle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
