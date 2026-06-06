import type { SubscriptionStatus } from "@/types/database";

const CONFIG: Record<SubscriptionStatus, { label: string; className: string }> = {
  trial:      { label: "Trial",      className: "bg-blue-100 text-blue-700 border border-blue-200" },
  active:     { label: "Ativo",      className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  past_due:   { label: "Em Atraso",  className: "bg-rose-100 text-rose-600 border border-rose-200" },
  suspended:  { label: "Suspenso",   className: "bg-amber-100 text-amber-700 border border-amber-200" },
  cancelled:  { label: "Cancelado",  className: "bg-slate-100 text-slate-400 border border-slate-200" },
  expired:    { label: "Expirado",   className: "bg-slate-100 text-slate-500 border border-slate-200" },
};

export default function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  const cfg = CONFIG[status] ?? CONFIG.active;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
