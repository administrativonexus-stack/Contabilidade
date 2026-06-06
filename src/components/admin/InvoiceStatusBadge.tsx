import type { InvoiceStatus } from "@/types/database";

const CONFIG: Record<InvoiceStatus, { label: string; className: string }> = {
  draft:     { label: "Rascunho",  className: "bg-slate-100 text-slate-500 border border-slate-200" },
  pending:   { label: "Pendente",  className: "bg-amber-100 text-amber-700 border border-amber-200" },
  paid:      { label: "Pago",      className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  overdue:   { label: "Vencida",   className: "bg-rose-100 text-rose-600 border border-rose-200" },
  cancelled: { label: "Cancelada", className: "bg-slate-100 text-slate-400 border border-slate-200" },
  refunded:  { label: "Reembolsada", className: "bg-purple-100 text-purple-600 border border-purple-200" },
};

export default function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const cfg = CONFIG[status] ?? CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
