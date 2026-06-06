import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import type { CollectionStatus } from "@/types/database";
import CollectionStatusBadge from "@/components/admin/CollectionStatusBadge";

const STATUS_TABS: { value: CollectionStatus | "active"; label: string }[] = [
  { value: "active", label: "Ativas" },
  { value: "current", label: "Em Dia" },
  { value: "reminder_sent", label: "Lembrete" },
  { value: "first_notice", label: "1ª Notif." },
  { value: "second_notice", label: "2ª Notif." },
  { value: "suspension_warning", label: "Aviso Susp." },
  { value: "suspended", label: "Suspenso" },
  { value: "resolved", label: "Resolvido" },
];

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function CollectionsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const statusFilter = params.status || "active";

  const supabase = await createClient();
  let query = supabase
    .from("collections")
    .select("*, companies(company_name), invoices(invoice_number, amount, due_date)")
    .order("updated_at", { ascending: false });

  if (statusFilter === "active") {
    query = query.not("status", "in", '("resolved")');
  } else {
    query = query.eq("status", statusFilter as CollectionStatus);
  }

  const { data: collections } = await query;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Cobranças</h1>
        <p className="text-sm text-slate-400 mt-0.5">{collections?.length ?? 0} registro(s)</p>
      </div>

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit flex-wrap">
        {STATUS_TABS.map((t) => (
          <Link key={t.value} href={`/admin/financeiro/collections?status=${t.value}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === t.value ? "bg-white text-[#0F3D5E] shadow-sm" : "text-slate-500 hover:text-[#0F3D5E]"}`}>
            {t.label}
          </Link>
        ))}
      </div>

      {collections?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1fr_100px_120px_120px_140px_48px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Empresa</span><span>Fatura</span><span>Valor</span><span>Vencimento</span><span>Status</span><span></span>
          </div>
          <div className="divide-y divide-slate-100">
            {collections.map((c) => {
              const company = c.companies as unknown as { company_name: string } | null;
              const invoice = c.invoices as unknown as { invoice_number: number; amount: number; due_date: string } | null;
              return (
                <div key={c.id} className="grid grid-cols-1 lg:grid-cols-[1fr_100px_120px_120px_140px_48px] gap-2 lg:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors">
                  <span className="text-sm font-medium text-[#0F3D5E]">{company?.company_name ?? "—"}</span>
                  <span className="text-xs font-mono text-slate-500">#{invoice?.invoice_number ?? "—"}</span>
                  <span className="text-sm font-semibold text-rose-600">{invoice ? invoice.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}</span>
                  <span className="text-xs text-slate-500">{formatDate(invoice?.due_date ?? null)}</span>
                  <CollectionStatusBadge status={c.status as CollectionStatus} />
                  <Link href={`/admin/financeiro/collections/${c.id}`} className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#0F3D5E] text-white text-xs hover:bg-[#0d3352] transition-colors flex-shrink-0">→</Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-400">Nenhuma cobrança encontrada</p>
        </div>
      )}
    </div>
  );
}
