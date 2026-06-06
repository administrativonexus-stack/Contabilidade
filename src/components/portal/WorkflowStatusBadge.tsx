import type { DocumentWorkflowStatus } from "@/types/database";

const CONFIG: Record<DocumentWorkflowStatus, { label: string; className: string }> = {
  submitted: { label: "Enviado", className: "bg-blue-100 text-blue-700 border border-blue-200" },
  under_review: { label: "Em Revisão", className: "bg-amber-100 text-amber-700 border border-amber-200" },
  pending_information: { label: "Aguardando Info", className: "bg-orange-100 text-orange-700 border border-orange-200" },
  approved: { label: "Aprovado", className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  rejected: { label: "Rejeitado", className: "bg-rose-100 text-rose-700 border border-rose-200" },
  archived: { label: "Arquivado", className: "bg-slate-100 text-slate-600 border border-slate-200" },
};

interface Props {
  status: DocumentWorkflowStatus;
  size?: "sm" | "md";
}

export default function WorkflowStatusBadge({ status, size = "sm" }: Props) {
  const { label, className } = CONFIG[status];
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"} ${className}`}>
      {label}
    </span>
  );
}
