import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { CollectionStatus, InvoiceStatus } from "@/types/database";
import CollectionStatusBadge from "@/components/admin/CollectionStatusBadge";
import InvoiceStatusBadge from "@/components/admin/InvoiceStatusBadge";
import CollectionActions from "./CollectionActions";

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}
function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: col } = await supabase
    .from("collections")
    .select("*, companies(company_name, email, phone), invoices(invoice_number, amount, due_date, status)")
    .eq("id", id)
    .single();
  if (!col) notFound();

  const company = col.companies as unknown as { company_name: string; email: string | null; phone: string | null } | null;
  const invoice = col.invoices as unknown as { invoice_number: number; amount: number; due_date: string; status: InvoiceStatus } | null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/admin/financeiro/collections" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">{company?.company_name ?? "Cobrança"}</h1>
          <CollectionStatusBadge status={col.status as CollectionStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-[#0F3D5E]">Empresa</h2>
            <p className="text-base font-bold text-[#0F3D5E]">{company?.company_name}</p>
            {company?.email && <p className="text-sm text-slate-500">{company.email}</p>}
            {company?.phone && <p className="text-sm text-slate-500">{company.phone}</p>}
          </div>

          {invoice && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-[#0F3D5E] mb-3">Fatura vinculada</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-slate-400">#{invoice.invoice_number}</p>
                  <p className="text-xl font-bold text-rose-600 mt-0.5">{formatCurrency(invoice.amount)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Vencimento: {formatDate(invoice.due_date)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <InvoiceStatusBadge status={invoice.status} />
                  <Link href={`/admin/financeiro/invoices/${id}`} className="text-xs text-[#2563EB] hover:underline">Ver fatura →</Link>
                </div>
              </div>
            </div>
          )}

          {col.notes && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-[#0F3D5E] mb-2">Observações</h2>
              <p className="text-sm text-slate-600">{col.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-[#0F3D5E] mb-3">Progresso da Cobrança</h2>
            <CollectionActions collectionId={col.id} currentStatus={col.status as CollectionStatus} />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs text-slate-400">Criado em {formatDate(col.created_at)}</p>
            {col.resolved_at && <p className="text-xs text-emerald-500 mt-1">Resolvido em {formatDate(col.resolved_at)}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
