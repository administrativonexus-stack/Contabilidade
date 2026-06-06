"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateCollectionStatus } from "../actions";
import type { CollectionStatus } from "@/types/database";

const PROGRESSION: { from: CollectionStatus[]; to: CollectionStatus; label: string; color: string }[] = [
  { from: ["current"], to: "reminder_sent", label: "Enviar Lembrete", color: "bg-blue-600 hover:bg-blue-700" },
  { from: ["reminder_sent"], to: "first_notice", label: "Emitir 1ª Notificação", color: "bg-amber-500 hover:bg-amber-600" },
  { from: ["first_notice"], to: "second_notice", label: "Emitir 2ª Notificação", color: "bg-orange-500 hover:bg-orange-600" },
  { from: ["second_notice"], to: "suspension_warning", label: "Aviso de Suspensão", color: "bg-rose-500 hover:bg-rose-600" },
  { from: ["suspension_warning"], to: "suspended", label: "Suspender Acesso", color: "bg-rose-700 hover:bg-rose-800" },
  { from: ["current","reminder_sent","first_notice","second_notice","suspension_warning","suspended"], to: "resolved", label: "Marcar Resolvido", color: "bg-emerald-600 hover:bg-emerald-700" },
];

interface Props {
  collectionId: string;
  currentStatus: CollectionStatus;
}

export default function CollectionActions({ collectionId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const availableActions = PROGRESSION.filter((p) =>
    p.from.includes(currentStatus) && p.to !== currentStatus
  );

  function handle(to: CollectionStatus) {
    startTransition(async () => {
      const result = await updateCollectionStatus(collectionId, to, notes || undefined);
      if (result?.error) setError(result.error);
      else setNotes("");
    });
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
      <div>
        <label className="block text-xs text-slate-500 mb-1.5">Observação (opcional)</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] resize-none"
          placeholder="Adicione uma observação..." />
      </div>
      <div className="flex flex-wrap gap-2">
        {availableActions.map((a) => (
          <button key={a.to} onClick={() => handle(a.to)} disabled={isPending}
            className={`h-9 px-4 rounded-xl text-white text-sm font-medium transition-colors disabled:opacity-60 flex items-center gap-1.5 ${a.color}`}>
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />} {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
