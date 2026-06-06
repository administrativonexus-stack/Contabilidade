"use client";

import { useState, useTransition } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { createSubscription } from "../actions";
import type { BillingCycle } from "@/types/database";

const inputClass = "w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors";

const CYCLES: { value: BillingCycle; label: string }[] = [
  { value: "monthly", label: "Mensal" }, { value: "quarterly", label: "Trimestral" },
  { value: "semiannual", label: "Semestral" }, { value: "annual", label: "Anual" },
];

interface Props {
  companies: { id: string; company_name: string }[];
  plans: { id: string; name: string; monthly_price: number; setup_fee: number }[];
}

export default function NewSubscriptionForm({ companies, plans }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);

  function handlePlanChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const p = plans.find((p) => p.id === e.target.value) ?? null;
    setSelectedPlan(p);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createSubscription(fd);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Empresa <span className="text-red-400">*</span></label>
            <select name="company_id" required className={`${inputClass} cursor-pointer`}>
              <option value="">Selecione a empresa</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Plano</label>
            <select name="plan_id" className={`${inputClass} cursor-pointer`} onChange={handlePlanChange}>
              <option value="">Sem plano vinculado</option>
              {plans.map((p) => <option key={p.id} value={p.id}>{p.name} — R$ {p.monthly_price.toFixed(2)}/mês</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Ciclo de Cobrança <span className="text-red-400">*</span></label>
            <select name="billing_cycle" required className={`${inputClass} cursor-pointer`}>
              {CYCLES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Valor Mensal (R$) <span className="text-red-400">*</span></label>
            <input name="monthly_amount" type="number" step="0.01" min="0" required className={inputClass}
              defaultValue={selectedPlan?.monthly_price ?? ""} placeholder="0.00" key={selectedPlan?.id} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Taxa de Setup (R$)</label>
            <input name="setup_fee" type="number" step="0.01" min="0" className={inputClass}
              defaultValue={selectedPlan?.setup_fee ?? 0} key={`setup-${selectedPlan?.id}`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Data de Início</label>
            <input name="start_date" type="date" className={inputClass} defaultValue={new Date().toISOString().split("T")[0]} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Observações</label>
            <textarea name="notes" rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] resize-none" />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={isPending} className="w-full h-11 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0d3352] transition-colors disabled:opacity-60">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><RefreshCw className="w-4 h-4" /> Criar Assinatura</>}
        </button>
      </form>
    </div>
  );
}
