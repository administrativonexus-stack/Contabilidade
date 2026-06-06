import type { CollectionStatus } from "@/types/database";

const CONFIG: Record<CollectionStatus, { label: string; className: string }> = {
  current:            { label: "Em Dia",          className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  reminder_sent:      { label: "Lembrete Enviado", className: "bg-blue-100 text-blue-700 border border-blue-200" },
  first_notice:       { label: "1ª Notificação",  className: "bg-amber-100 text-amber-700 border border-amber-200" },
  second_notice:      { label: "2ª Notificação",  className: "bg-orange-100 text-orange-700 border border-orange-200" },
  suspension_warning: { label: "Aviso Suspensão", className: "bg-rose-100 text-rose-600 border border-rose-200" },
  suspended:          { label: "Suspenso",         className: "bg-rose-200 text-rose-700 border border-rose-300" },
  resolved:           { label: "Resolvido",        className: "bg-slate-100 text-slate-500 border border-slate-200" },
};

export default function CollectionStatusBadge({ status }: { status: CollectionStatus }) {
  const cfg = CONFIG[status] ?? CONFIG.current;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
