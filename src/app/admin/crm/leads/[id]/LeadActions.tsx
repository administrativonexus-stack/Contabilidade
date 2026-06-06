"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Target, ChevronDown } from "lucide-react";
import { updateLeadStatus, addLeadNote, convertToOpportunity } from "./actions";
import type { CrmLeadStatus } from "@/types/database";

const STATUS_OPTIONS: { value: CrmLeadStatus; label: string }[] = [
  { value: "new", label: "Novo" },
  { value: "contacted", label: "Contactado" },
  { value: "qualified", label: "Qualificado" },
  { value: "proposal_sent", label: "Proposta Enviada" },
  { value: "negotiation", label: "Negociação" },
  { value: "won", label: "Ganho" },
  { value: "lost", label: "Perdido" },
];

interface Props {
  leadId: string;
  leadName: string;
  companyName: string | null;
  currentStatus: CrmLeadStatus;
  authorId: string;
}

export default function LeadActions({ leadId, leadName, companyName, currentStatus, authorId }: Props) {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState(currentStatus);
  const [converting, startConvert] = useTransition();
  const [saving, startSave] = useTransition();
  const [noteMsg, setNoteMsg] = useState("");
  const router = useRouter();

  function handleStatusChange(val: CrmLeadStatus) {
    setStatus(val);
    startSave(async () => { await updateLeadStatus(leadId, val); });
  }

  function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    startSave(async () => {
      await addLeadNote(leadId, note, authorId);
      setNote("");
      setNoteMsg("Nota adicionada!");
      setTimeout(() => setNoteMsg(""), 2000);
    });
  }

  function handleConvert() {
    startConvert(async () => {
      const result = await convertToOpportunity(leadId, leadName, companyName);
      if (result.opportunityId) router.push(`/admin/crm/opportunities/${result.opportunityId}`);
    });
  }

  return (
    <div className="space-y-4">
      {/* Status selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Status do Lead</p>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as CrmLeadStatus)}
            className="w-full h-10 px-3 pr-8 rounded-xl border border-slate-200 text-sm font-medium text-[#0F3D5E] bg-white focus:outline-none focus:ring-1 focus:border-[#0F3D5E] cursor-pointer appearance-none"
          >
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
        </div>
        {saving && <p className="text-xs text-slate-400 mt-1">Salvando...</p>}
      </div>

      {/* Convert to opportunity */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Ações</p>
        <button
          onClick={handleConvert}
          disabled={converting}
          className="w-full h-10 rounded-xl bg-[#10B981] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors disabled:opacity-60"
        >
          {converting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Target className="w-4 h-4" /> Converter em Oportunidade</>}
        </button>
      </div>

      {/* Add note */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Adicionar Nota</p>
        <form onSubmit={handleAddNote} className="space-y-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Registro de interação, próximos passos..."
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] resize-none"
          />
          {noteMsg && <p className="text-xs text-emerald-600">{noteMsg}</p>}
          <button type="submit" disabled={saving || !note.trim()} className="w-full h-9 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold hover:bg-[#0d3352] transition-colors disabled:opacity-50">
            {saving ? "Salvando..." : "Adicionar Nota"}
          </button>
        </form>
      </div>
    </div>
  );
}
