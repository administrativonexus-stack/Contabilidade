import type { CrmLeadStatus } from "@/types/database";

const CONFIG: Record<CrmLeadStatus, { label: string; className: string }> = {
  new: { label: "Novo", className: "bg-slate-100 text-slate-600 border border-slate-200" },
  contacted: { label: "Contactado", className: "bg-blue-100 text-blue-700 border border-blue-200" },
  qualified: { label: "Qualificado", className: "bg-violet-100 text-violet-700 border border-violet-200" },
  proposal_sent: { label: "Proposta Enviada", className: "bg-amber-100 text-amber-700 border border-amber-200" },
  negotiation: { label: "Negociação", className: "bg-orange-100 text-orange-700 border border-orange-200" },
  won: { label: "Ganho", className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  lost: { label: "Perdido", className: "bg-rose-100 text-rose-600 border border-rose-200" },
};

export default function LeadStatusBadge({ status }: { status: CrmLeadStatus }) {
  const c = CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${c.className}`}>
      {c.label}
    </span>
  );
}
