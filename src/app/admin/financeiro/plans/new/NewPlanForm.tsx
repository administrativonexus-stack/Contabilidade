"use client";

import { useState, useTransition } from "react";
import { Loader2, Layers } from "lucide-react";
import { createPlan } from "../actions";

const inputClass = "w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors";

export default function NewPlanForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createPlan(fd);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Nome do Plano <span className="text-red-400">*</span></label>
            <input name="name" required className={inputClass} placeholder="Ex: Plano Essencial" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Mensalidade (R$) <span className="text-red-400">*</span></label>
            <input name="monthly_price" type="number" step="0.01" min="0" required className={inputClass} placeholder="500.00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Taxa de Setup (R$)</label>
            <input name="setup_fee" type="number" step="0.01" min="0" defaultValue="0" className={inputClass} placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Máx. Usuários</label>
            <input name="max_users" type="number" min="1" defaultValue="5" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Descrição</label>
            <input name="description" className={inputClass} placeholder="Breve descrição do plano" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Serviços incluídos <span className="text-xs text-slate-400">(um por linha)</span></label>
            <textarea name="features" rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] resize-none" placeholder={"Declaração de IRPJ\nFolha de pagamento\nBNC"} />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={isPending} className="w-full h-11 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0d3352] transition-colors disabled:opacity-60">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Layers className="w-4 h-4" /> Criar Plano</>}
        </button>
      </form>
    </div>
  );
}
