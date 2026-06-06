import type { TicketStatus } from "@/types/database";

const config: Record<TicketStatus, { label: string; className: string }> = {
  open:            { label: "Aberta",           className: "bg-blue-50 text-blue-700 border-blue-200" },
  in_progress:     { label: "Em andamento",     className: "bg-amber-50 text-amber-700 border-amber-200" },
  waiting_client:  { label: "Aguardando você",  className: "bg-orange-50 text-orange-700 border-orange-200" },
  completed:       { label: "Concluída",         className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled:       { label: "Cancelada",         className: "bg-slate-100 text-slate-500 border-slate-200" },
};

export default function StatusBadge({ status }: { status: TicketStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${className}`}>
      {label}
    </span>
  );
}
