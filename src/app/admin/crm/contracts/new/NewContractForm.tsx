"use client";

import { useTransition } from "react";
import { Loader2, ScrollText } from "lucide-react";
import { createContract } from "../actions";

const inputClass = "w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors";

export default function NewContractForm({ companies }: { companies: { id: string; company_name: string }[] }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => { await createContract(fd); });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Empresa <span className="text-red-400">*</span></label>
          <select name="company_id" required className={`${inputClass} cursor-pointer`}>
            <option value="">Selecionar empresa</option>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Mensalidade (R$) <span className="text-red-400">*</span></label>
          <input name="monthly_fee" type="number" min="0" step="0.01" required className={inputClass} placeholder="1500.00" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Data de início</label>
            <input name="start_date" type="date" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Data de término</label>
            <input name="end_date" type="date" className={inputClass} />
          </div>
        </div>

        <button type="submit" disabled={isPending} className="w-full h-11 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0d3352] transition-colors disabled:opacity-60">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ScrollText className="w-4 h-4" /> Criar Contrato</>}
        </button>
      </form>
    </div>
  );
}
