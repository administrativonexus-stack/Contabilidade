import type { CrmProposalStatus } from "@/types/database";

const CONFIG: Record<CrmProposalStatus, { label: string; className: string }> = {
  draft: { label: "Rascunho", className: "bg-slate-100 text-slate-600 border border-slate-200" },
  sent: { label: "Enviada", className: "bg-blue-100 text-blue-700 border border-blue-200" },
  viewed: { label: "Visualizada", className: "bg-violet-100 text-violet-700 border border-violet-200" },
  accepted: { label: "Aceita", className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  rejected: { label: "Rejeitada", className: "bg-rose-100 text-rose-600 border border-rose-200" },
  expired: { label: "Expirada", className: "bg-slate-100 text-slate-400 border border-slate-200" },
};

export default function ProposalStatusBadge({ status }: { status: CrmProposalStatus }) {
  const c = CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${c.className}`}>
      {c.label}
    </span>
  );
}
