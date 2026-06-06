import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Receipt, Plus } from "lucide-react";
import type { InvoiceStatus } from "@/types/database";
import InvoiceStatusBadge from "@/components/admin/InvoiceStatusBadge";
import GenerateInvoicesButton from "./GenerateInvoicesButton";

const STATUS_TABS: { value: InvoiceStatus | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendentes" },
  { value: "overdue", label: "Vencidas" },
  { value: "paid", label: "Pagas" },
  { value: "draft", label: "Rascunho" },
  { value: "cancelled", label: "Canceladas" },
];

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const statusFilter = params.status || "all";

  const supabase = await createClient();
  let query = supabase
    .from("invoices")
    .select("*, companies(company_name)")
    .order("due_date", { ascending: false });
  if (statusFilter !== "all") query = query.eq("status", statusFilter as InvoiceStatus);

  const { data: invoices } = await query;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Faturas</h1>
          <p className="text-sm text-slate-400 mt-0.5">{invoices?.length ?? 0} fatura(s)</p>
        </div>
        <div className="flex items-center gap-2">
          <GenerateInvoicesButton />
          <Link href="/admin/financeiro/invoices/new" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> Nova Fatura
          </Link>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit flex-wrap">
        {STATUS_TABS.map((t) => (
          <Link key={t.value} href={`/admin/financeiro/invoices?status=${t.value}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === t.value ? "bg-white text-[#0F3D5E] shadow-sm" : "text-slate-500 hover:text-[#0F3D5E]"}`}>
            {t.label}
          </Link>
        ))}
      </div>

      {invoices?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="hidden lg:grid grid-cols-[80px_1fr_120px_120px_120px_120px_48px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Nº</span><span>Empresa</span><span>Valor</span><span>Emissão</span><span>Vencimento</span><span>Status</span><span></span>
          </div>
          <div className="divide-y divide-slate-100">
            {invoices.map((inv) => {
              const isOverdue = inv.status === "overdue" || (inv.status === "pending" && inv.due_date < new Date().toISOString().split("T")[0]);
              return (
                <div key={inv.id} className={`grid grid-cols-1 lg:grid-cols-[80px_1fr_120px_120px_120px_120px_48px] gap-2 lg:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors ${isOverdue && inv.status !== "paid" ? "bg-rose-50/30" : ""}`}>
                  <span className="text-xs font-mono text-slate-500">#{inv.invoice_number}</span>
                  <div>
                    <p className="text-sm font-medium text-[#0F3D5E] truncate">{(inv.companies as unknown as { company_name: string } | null)?.company_name ?? "—"}</p>
                    {inv.description && <p className="text-xs text-slate-400 truncate">{inv.description}</p>}
                  </div>
                  <span className="text-sm font-semibold text-[#10B981]">{formatCurrency(inv.amount)}</span>
                  <span className="text-xs text-slate-500">{formatDate(inv.issue_date)}</span>
                  <span className={`text-xs ${isOverdue && inv.status !== "paid" ? "text-rose-600 font-semibold" : "text-slate-500"}`}>{formatDate(inv.due_date)}</span>
                  <InvoiceStatusBadge status={inv.status as InvoiceStatus} />
                  <Link href={`/admin/financeiro/invoices/${inv.id}`} className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#0F3D5E] text-white text-xs hover:bg-[#0d3352] transition-colors flex-shrink-0">→</Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-400">Nenhuma fatura encontrada</p>
        </div>
      )}
    </div>
  );
}
