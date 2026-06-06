"use client";

import { useTransition } from "react";
import { CheckCircle2, Send, XCircle, Loader2 } from "lucide-react";
import { updateProposalStatus } from "../actions";
import type { CrmProposalStatus } from "@/types/database";

const ACTIONS: { status: CrmProposalStatus; label: string; icon: React.ComponentType<{ className?: string }>; className: string }[] = [
  { status: "sent", label: "Marcar como Enviada", icon: Send, className: "bg-blue-600 hover:bg-blue-700 text-white" },
  { status: "viewed", label: "Marcar como Visualizada", icon: Send, className: "bg-violet-600 hover:bg-violet-700 text-white" },
  { status: "accepted", label: "Aceita — Gerar Contrato", icon: CheckCircle2, className: "bg-[#10B981] hover:bg-emerald-600 text-white" },
  { status: "rejected", label: "Marcar como Rejeitada", icon: XCircle, className: "bg-rose-500 hover:bg-rose-600 text-white" },
  { status: "expired", label: "Marcar como Expirada", icon: XCircle, className: "bg-slate-400 hover:bg-slate-500 text-white" },
];

export default function ProposalStatusForm({ id, currentStatus }: { id: string; currentStatus: CrmProposalStatus }) {
  const [isPending, startTransition] = useTransition();

  const available = ACTIONS.filter((a) => a.status !== currentStatus);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Ações</p>
      <div className="flex flex-col gap-2">
        {available.map(({ status, label, icon: Icon, className }) => (
          <button
            key={status}
            disabled={isPending}
            onClick={() => startTransition(async () => { await updateProposalStatus(id, status); })}
            className={`h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 ${className}`}
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Icon className="w-4 h-4" />{label}</>}
          </button>
        ))}
      </div>
    </div>
  );
}
