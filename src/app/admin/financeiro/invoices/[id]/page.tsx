import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink, Copy } from "lucide-react";
import type { InvoiceStatus } from "@/types/database";
import InvoiceStatusBadge from "@/components/admin/InvoiceStatusBadge";
import InvoiceActions from "./InvoiceActions";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-400 font-medium uppercase tracking-wide w-32 flex-shrink-0">{label}</span>
      <span className="text-sm text-[#0F3D5E] font-medium text-right break-all">{value ?? "—"}</span>
    </div>
  );
}

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, companies(company_name, email, phone), subscriptions(billing_cycle, plans(name))")
    .eq("id", id)
    .single();
  if (!invoice) notFound();

  const company = invoice.companies as unknown as { company_name: string; email: string | null; phone: string | null } | null;
  const sub = invoice.subscriptions as unknown as { billing_cycle: string; plans: { name: string } | null } | null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/admin/financeiro/invoices" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Fatura #{invoice.invoice_number}</h1>
          <InvoiceStatusBadge status={invoice.status as InvoiceStatus} />
        </div>
      </div>

      {/* Valor destacado */}
      <div className="bg-[#0F3D5E] rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm">Valor da Fatura</p>
          <p className="text-3xl font-bold text-white mt-1">{formatCurrency(invoice.amount)}</p>
          <p className="text-white/50 text-xs mt-1">Vencimento: {formatDate(invoice.due_date)}</p>
        </div>
        {invoice.paid_at && (
          <div className="text-right">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wide">Pago em</p>
            <p className="text-white text-sm mt-0.5">{formatDate(invoice.paid_at)}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-[#0F3D5E] mb-3">Detalhes</h2>
            <InfoRow label="Empresa" value={company?.company_name} />
            {company?.email && <InfoRow label="Email" value={company.email} />}
            {sub?.plans && <InfoRow label="Plano" value={sub.plans.name} />}
            {invoice.description && <InfoRow label="Descrição" value={invoice.description} />}
            <InfoRow label="Emissão" value={formatDate(invoice.issue_date)} />
            <InfoRow label="Vencimento" value={formatDate(invoice.due_date)} />
            {invoice.payment_method && <InfoRow label="Pagamento" value={invoice.payment_method.toUpperCase().replace("_", " ")} />}
            {invoice.external_payment_id && <InfoRow label="ID Transação" value={invoice.external_payment_id} />}
          </div>

          {(invoice.boleto_url || invoice.pix_code || invoice.receipt_url) && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <h2 className="text-sm font-semibold text-[#0F3D5E]">Links e Códigos</h2>
              {invoice.boleto_url && (
                <a href={invoice.boleto_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#2563EB] hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" /> Abrir boleto
                </a>
              )}
              {invoice.pix_code && (
                <div className="bg-slate-50 rounded-xl p-3 flex items-start gap-2">
                  <p className="text-xs text-slate-500 font-mono break-all flex-1">{invoice.pix_code}</p>
                  <button onClick={() => navigator.clipboard.writeText(invoice.pix_code!)}
                    className="flex-shrink-0 p-1 text-slate-400 hover:text-[#0F3D5E] transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {invoice.receipt_url && (
                <a href={invoice.receipt_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#10B981] hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" /> Ver comprovante
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-[#0F3D5E] mb-3">Ações</h2>
            <InvoiceActions invoiceId={invoice.id} currentStatus={invoice.status as InvoiceStatus} />
          </div>
        </div>
      </div>
    </div>
  );
}
