import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Receipt, ExternalLink, Copy } from "lucide-react";
import type { InvoiceStatus, SubscriptionStatus } from "@/types/database";
import ConfirmInvoicePayment from "./ConfirmInvoicePayment";

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; className: string }> = {
  draft:     { label: "Rascunho",  className: "bg-slate-100 text-slate-500" },
  pending:   { label: "Pendente",  className: "bg-amber-100 text-amber-700" },
  paid:      { label: "Pago",      className: "bg-emerald-100 text-emerald-700" },
  overdue:   { label: "Vencida",   className: "bg-rose-100 text-rose-700" },
  cancelled: { label: "Cancelada", className: "bg-slate-100 text-slate-400" },
  refunded:  { label: "Reembolsada", className: "bg-purple-100 text-purple-600" },
};

const SUB_STATUS: Record<SubscriptionStatus, { label: string; className: string }> = {
  trial:     { label: "Trial",     className: "bg-blue-100 text-blue-700" },
  active:    { label: "Ativo",     className: "bg-emerald-100 text-emerald-700" },
  past_due:  { label: "Em Atraso", className: "bg-rose-100 text-rose-700" },
  suspended: { label: "Suspenso",  className: "bg-amber-100 text-amber-700" },
  cancelled: { label: "Cancelado", className: "bg-slate-100 text-slate-400" },
  expired:   { label: "Expirado",  className: "bg-slate-100 text-slate-500" },
};

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}
function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function FeesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client-portal/login");

  const { data: profile } = await supabase
    .from("users")
    .select("id, user_companies(company_id)")
    .eq("auth_user_id", user.id)
    .single();
  const companyId = (profile?.user_companies as { company_id: string }[] | null)?.[0]?.company_id;

  const [{ data: invoices }, { data: subscription }] = await Promise.all([
    supabase.from("invoices")
      .select("*")
      .eq("company_id", companyId ?? "")
      .not("status", "in", '("cancelled","draft")')
      .order("due_date", { ascending: false }),
    supabase.from("subscriptions")
      .select("*, plans(name, features)")
      .eq("company_id", companyId ?? "")
      .in("status", ["active", "trial"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const openInvoices = invoices?.filter((i) => i.status === "pending" || i.status === "overdue") ?? [];
  const paidInvoices = invoices?.filter((i) => i.status === "paid") ?? [];

  const sub = subscription;
  const plan = sub ? (sub.plans as unknown as { name: string; features: unknown } | null) : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Receipt className="w-5 h-5 text-[#2563EB]" />
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Faturas</h1>
        </div>
        <p className="text-sm text-slate-400">Seus pagamentos e histórico financeiro</p>
      </div>

      {/* Card da Assinatura Atual */}
      {sub && (
        <div className="bg-[#0F3D5E] rounded-2xl p-6">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-wide mb-3">Plano Atual</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-2xl font-heading font-bold text-white">{plan?.name ?? "Plano Nexus"}</p>
              <p className="text-white/60 text-sm mt-1">{formatCurrency(sub.monthly_amount)}/mês</p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${SUB_STATUS[sub.status as SubscriptionStatus]?.className ?? ""}`}>
                {SUB_STATUS[sub.status as SubscriptionStatus]?.label ?? sub.status}
              </span>
              {sub.renewal_date && (
                <p className="text-white/50 text-xs">Próx. renovação: {formatDate(sub.renewal_date)}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Faturas em aberto */}
      {openInvoices.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-[#0F3D5E]">Faturas em Aberto</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {openInvoices.map((inv) => (
              <div key={inv.id} className={`px-5 py-5 ${inv.status === "overdue" ? "bg-rose-50/40" : ""}`}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    {inv.description && <p className="text-sm font-medium text-[#1E293B]">{inv.description}</p>}
                    <p className="text-2xl font-bold text-[#0F3D5E] mt-1">{formatCurrency(inv.amount)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Vencimento: {formatDate(inv.due_date)}</p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_CONFIG[inv.status as InvoiceStatus]?.className}`}>
                      {STATUS_CONFIG[inv.status as InvoiceStatus]?.label}
                    </span>
                    <ConfirmInvoicePayment invoiceId={inv.id} amount={inv.amount} />
                    <div className="flex gap-2">
                      {inv.boleto_url && (
                        <a href={inv.boleto_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-[#0F3D5E] hover:border-[#2563EB] transition-colors">
                          <ExternalLink className="w-3 h-3" /> Boleto
                        </a>
                      )}
                      {inv.pix_code && (
                        <button onClick={() => navigator.clipboard.writeText(inv.pix_code!)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-[#0F3D5E] hover:border-[#2563EB] transition-colors">
                          <Copy className="w-3 h-3" /> Copiar PIX
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Histórico de pagamentos */}
      {paidInvoices.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-[#0F3D5E]">Histórico de Pagamentos</h2>
          </div>
          <div className="hidden sm:grid grid-cols-[80px_1fr_120px_120px_100px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Nº</span><span>Descrição</span><span>Valor</span><span>Pago em</span><span>Status</span>
          </div>
          <div className="divide-y divide-slate-100">
            {paidInvoices.map((inv) => (
              <div key={inv.id} className="grid grid-cols-1 sm:grid-cols-[80px_1fr_120px_120px_100px] gap-2 sm:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors">
                <span className="text-xs font-mono text-slate-400">#{inv.invoice_number}</span>
                <span className="text-sm text-[#1E293B]">{inv.description ?? "Mensalidade"}</span>
                <span className="text-sm font-semibold text-[#10B981]">{formatCurrency(inv.amount)}</span>
                <span className="text-xs text-slate-500">{formatDate(inv.paid_at)}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">Pago</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!openInvoices.length && !paidInvoices.length && !sub && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400">Nenhuma fatura registrada</p>
          <p className="text-xs text-slate-300 mt-1">As faturas serão lançadas pela equipe Nexus</p>
        </div>
      )}
    </div>
  );
}
