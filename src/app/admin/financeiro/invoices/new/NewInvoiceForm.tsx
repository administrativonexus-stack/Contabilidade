"use client";

import { useState, useTransition } from "react";
import { Loader2, Receipt } from "lucide-react";
import { createInvoice } from "../actions";

const inputClass = "w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors";

interface Props {
  companies: { id: string; company_name: string }[];
  subscriptions: { id: string; company_id: string; monthly_amount: number; plans: { name: string } | null }[];
}

export default function NewInvoiceForm({ companies, subscriptions }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedCompany, setSelectedCompany] = useState("");

  const companySubs = subscriptions.filter((s) => s.company_id === selectedCompany);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createInvoice(fd);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Empresa <span className="text-red-400">*</span></label>
            <select name="company_id" required className={`${inputClass} cursor-pointer`} onChange={(e) => setSelectedCompany(e.target.value)}>
              <option value="">Selecione a empresa</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
            </select>
          </div>
          {companySubs.length > 0 && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Assinatura vinculada</label>
              <select name="subscription_id" className={`${inputClass} cursor-pointer`}>
                <option value="">Sem assinatura</option>
                {companySubs.map((s) => (
                  <option key={s.id} value={s.id}>
                    {(s.plans as unknown as { name: string } | null)?.name ?? "Plano"} — R$ {s.monthly_amount.toFixed(2)}/mês
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Descrição</label>
            <input name="description" className={inputClass} placeholder="Ex: Mensalidade Janeiro/2025" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Valor (R$) <span className="text-red-400">*</span></label>
            <input name="amount" type="number" step="0.01" min="0" required className={inputClass} placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Vencimento <span className="text-red-400">*</span></label>
            <input name="due_date" type="date" required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Data de Emissão</label>
            <input name="issue_date" type="date" className={inputClass} defaultValue={new Date().toISOString().split("T")[0]} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">URL do Boleto</label>
            <input name="boleto_url" type="url" className={inputClass} placeholder="https://..." />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Código PIX</label>
            <input name="pix_code" className={inputClass} placeholder="Cole o código PIX aqui" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Observações</label>
            <textarea name="notes" rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] resize-none" />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={isPending} className="w-full h-11 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0d3352] transition-colors disabled:opacity-60">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Receipt className="w-4 h-4" /> Criar Fatura</>}
        </button>
      </form>
    </div>
  );
}
