"use client";

import { useTransition } from "react";
import { CheckCircle2, XCircle, FileCheck, Loader2 } from "lucide-react";
import { updateContractStatus } from "../actions";
import type { CrmContractStatus } from "@/types/database";

const ACTIONS: { status: CrmContractStatus; label: string; icon: React.ComponentType<{ className?: string }>; className: string }[] = [
  { status: "pending_signature", label: "Aguardando Assinatura", icon: FileCheck, className: "bg-amber-500 hover:bg-amber-600 text-white" },
  { status: "signed", label: "Marcar como Assinado", icon: CheckCircle2, className: "bg-[#10B981] hover:bg-emerald-600 text-white" },
  { status: "cancelled", label: "Cancelar Contrato", icon: XCircle, className: "bg-rose-500 hover:bg-rose-600 text-white" },
  { status: "expired", label: "Marcar como Expirado", icon: XCircle, className: "bg-slate-400 hover:bg-slate-500 text-white" },
];

export default function ContractActions({ id, currentStatus }: { id: string; currentStatus: CrmContractStatus }) {
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
            onClick={() => startTransition(async () => { await updateContractStatus(id, status); })}
            className={`h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 ${className}`}
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Icon className="w-4 h-4" />{label}</>}
          </button>
        ))}
      </div>
    </div>
  );
}
