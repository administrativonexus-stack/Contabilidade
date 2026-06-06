"use client";

import { useTransition } from "react";
import { Loader2, FileCheck } from "lucide-react";
import { createProposal } from "../actions";

const inputClass = "w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors";

const PLANS = ["Simples Nacional Básico", "Simples Nacional Plus", "Lucro Presumido", "Lucro Real", "MEI", "Holding", "Personalizado"];

interface Props {
  companies: { id: string; company_name: string }[];
  opportunities: { id: string; title: string }[];
  defaultOpportunityId?: string;
}

export default function NewProposalForm({ companies, opportunities, defaultOpportunityId }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => { await createProposal(fd); });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Empresa <span className="text-red-400">*</span></label>
            <select name="company_id" required className={`${inputClass} cursor-pointer`}>
              <option value="">Selecionar empresa</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Oportunidade vinculada</label>
            <select name="opportunity_id" defaultValue={defaultOpportunityId ?? ""} className={`${inputClass} cursor-pointer`}>
              <option value="">Nenhuma</option>
              {opportunities.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Plano</label>
            <select name="plan" className={`${inputClass} cursor-pointer`}>
              <option value="">Selecionar</option>
              {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Validade até</label>
            <input name="validity_date" type="date" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Mensalidade (R$) <span className="text-red-400">*</span></label>
            <input name="monthly_fee" type="number" min="0" step="0.01" required className={inputClass} placeholder="1500.00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Taxa de implantação (R$)</label>
            <input name="setup_fee" type="number" min="0" step="0.01" className={inputClass} placeholder="0" defaultValue="0" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Descrição / Serviços incluídos</label>
            <textarea name="description" rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 resize-none transition-colors" placeholder="Abertura de empresa, folha de pagamento, SPED..." />
          </div>
        </div>

        <button type="submit" disabled={isPending} className="w-full h-11 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0d3352] transition-colors disabled:opacity-60">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><FileCheck className="w-4 h-4" /> Criar Proposta</>}
        </button>
      </form>
    </div>
  );
}
