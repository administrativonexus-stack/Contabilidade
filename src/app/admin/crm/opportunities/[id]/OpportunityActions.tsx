"use client";

import { useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { updateOpportunityStage, addOpportunityNote } from "./actions";
import type { CrmOpportunityStage } from "@/types/database";

const STAGES: { value: CrmOpportunityStage; label: string }[] = [
  { value: "new_lead", label: "Novo Lead" },
  { value: "initial_contact", label: "Contato Inicial" },
  { value: "discovery", label: "Descoberta" },
  { value: "proposal_sent", label: "Proposta Enviada" },
  { value: "negotiation", label: "Negociação" },
  { value: "won", label: "Ganho" },
  { value: "lost", label: "Perdido" },
];

export default function OpportunityActions({ id, currentStage, authorId }: { id: string; currentStage: CrmOpportunityStage; authorId: string }) {
  const [stage, setStage] = useState(currentStage);
  const [note, setNote] = useState("");
  const [saving, startSave] = useTransition();
  const [msg, setMsg] = useState("");

  function handleStageChange(val: CrmOpportunityStage) {
    setStage(val);
    startSave(async () => { await updateOpportunityStage(id, val); });
  }

  function handleNote(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    startSave(async () => {
      await addOpportunityNote(id, note, authorId);
      setNote("");
      setMsg("Nota adicionada!");
      setTimeout(() => setMsg(""), 2000);
    });
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Estágio</p>
        <div className="relative">
          <select value={stage} onChange={(e) => handleStageChange(e.target.value as CrmOpportunityStage)}
            className="w-full h-10 px-3 pr-8 rounded-xl border border-slate-200 text-sm font-medium text-[#0F3D5E] bg-white focus:outline-none focus:ring-1 focus:border-[#0F3D5E] cursor-pointer appearance-none">
            {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
        </div>
        {saving && <p className="text-xs text-slate-400 mt-1">Salvando...</p>}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Adicionar Nota</p>
        <form onSubmit={handleNote} className="space-y-2">
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
            placeholder="Próximos passos, contexto..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] resize-none" />
          {msg && <p className="text-xs text-emerald-600">{msg}</p>}
          <button type="submit" disabled={saving || !note.trim()} className="w-full h-9 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold hover:bg-[#0d3352] transition-colors disabled:opacity-50">
            Adicionar Nota
          </button>
        </form>
      </div>
    </div>
  );
}
