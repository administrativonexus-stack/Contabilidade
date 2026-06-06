import type { DocumentStatusHistoryRow } from "@/types/database";
import WorkflowStatusBadge from "./WorkflowStatusBadge";

interface Props {
  history: (DocumentStatusHistoryRow & { users?: { full_name: string } | null })[];
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DocumentTimeline({ history }: Props) {
  if (!history.length) {
    return <p className="text-sm text-slate-400 text-center py-6">Nenhum histórico disponível.</p>;
  }

  return (
    <ol className="relative border-l border-slate-200 space-y-6 ml-3">
      {history.map((entry, i) => (
        <li key={entry.id} className="ml-6">
          <span className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white ${i === 0 ? "bg-[#2563EB]" : "bg-slate-200"}`}>
            <span className={`w-2 h-2 rounded-full ${i === 0 ? "bg-white" : "bg-slate-400"}`} />
          </span>
          <div className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {entry.previous_status && (
                  <>
                    <WorkflowStatusBadge status={entry.previous_status} />
                    <span className="text-slate-400 text-xs">→</span>
                  </>
                )}
                <WorkflowStatusBadge status={entry.new_status} />
              </div>
              <time className="text-[11px] text-slate-400 flex-shrink-0">{formatDateTime(entry.created_at)}</time>
            </div>
            {entry.users?.full_name && (
              <p className="text-xs text-slate-500 mt-1.5">por {entry.users.full_name}</p>
            )}
            {entry.reason && (
              <p className="text-xs text-slate-600 mt-1.5 bg-slate-50 rounded-lg px-3 py-2">{entry.reason}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
