import type { ActionPriority } from "@/types/database";

const CONFIG: Record<ActionPriority, { label: string; className: string }> = {
  low: { label: "Baixa", className: "bg-slate-100 text-slate-600 border border-slate-200" },
  medium: { label: "Média", className: "bg-blue-100 text-blue-700 border border-blue-200" },
  high: { label: "Alta", className: "bg-amber-100 text-amber-700 border border-amber-200" },
  urgent: { label: "Urgente", className: "bg-rose-100 text-rose-700 border border-rose-200" },
};

interface Props {
  priority: ActionPriority;
}

export default function PriorityBadge({ priority }: Props) {
  const { label, className } = CONFIG[priority];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}
