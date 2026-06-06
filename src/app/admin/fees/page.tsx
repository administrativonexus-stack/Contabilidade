import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Receipt, PlusCircle } from "lucide-react";
import type { FeeStatus } from "@/types/database";

const STATUS_CONFIG: Record<FeeStatus, { label: string; className: string }> = {
  pending: { label: "Pendente", className: "bg-amber-100 text-amber-700" },
  paid: { label: "Pago", className: "bg-emerald-100 text-emerald-700" },
  overdue: { label: "Vencido", className: "bg-rose-100 text-rose-700" },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function formatPeriod(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

export default async function AdminFeesPage() {
  const supabase = await createClient();
  const { data: fees } = await supabase
    .from("fees")
    .select("*, companies(company_name)")
    .order("period", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Honorários</h1>
          <p className="text-sm text-slate-400 mt-0.5">{fees?.length ?? 0} registro(s)</p>
        </div>
        <Link href="/admin/fees/new" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          <PlusCircle className="w-4 h-4" /> Novo Honorário
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="hidden lg:grid grid-cols-[1fr_160px_120px_120px_100px_100px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span>Descrição</span>
          <span>Empresa</span>
          <span>Competência</span>
          <span>Valor</span>
          <span>Vencimento</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-slate-100">
          {fees?.length ? fees.map((fee) => {
            const s = STATUS_CONFIG[fee.status];
            return (
              <div key={fee.id} className="grid grid-cols-1 lg:grid-cols-[1fr_160px_120px_120px_100px_100px] gap-2 lg:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Receipt className="w-3.5 h-3.5 text-[#2563EB]" />
                  </div>
                  <p className="text-sm font-medium text-[#0F3D5E] truncate">{fee.description}</p>
                </div>
                <span className="text-xs text-slate-500 truncate">
                  {(fee.companies as { company_name: string } | null)?.company_name ?? "—"}
                </span>
                <span className="text-xs text-slate-500 capitalize">{formatPeriod(fee.period)}</span>
                <span className="text-sm font-semibold text-[#0F3D5E]">{formatCurrency(fee.amount)}</span>
                <span className="text-xs text-slate-500">{formatDate(fee.due_date)}</span>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit ${s.className}`}>{s.label}</span>
              </div>
            );
          }) : (
            <div className="px-5 py-12 text-center">
              <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Nenhum honorário registrado</p>
              <Link href="/admin/fees/new" className="inline-flex items-center gap-1 mt-2 text-sm text-[#2563EB] hover:underline">
                <PlusCircle className="w-3.5 h-3.5" /> Criar primeiro honorário
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
