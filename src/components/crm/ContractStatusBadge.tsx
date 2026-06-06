import type { CrmContractStatus } from "@/types/database";

const CONFIG: Record<CrmContractStatus, { label: string; className: string }> = {
  draft: { label: "Rascunho", className: "bg-slate-100 text-slate-600 border border-slate-200" },
  pending_signature: { label: "Aguard. Assinatura", className: "bg-amber-100 text-amber-700 border border-amber-200" },
  signed: { label: "Assinado", className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  cancelled: { label: "Cancelado", className: "bg-rose-100 text-rose-600 border border-rose-200" },
  expired: { label: "Expirado", className: "bg-slate-100 text-slate-400 border border-slate-200" },
};

export default function ContractStatusBadge({ status }: { status: CrmContractStatus }) {
  const c = CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${c.className}`}>
      {c.label}
    </span>
  );
}
