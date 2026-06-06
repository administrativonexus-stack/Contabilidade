"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PlusCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const inputClass = "w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors";

interface Props {
  companies: { id: string; company_name: string }[];
}

export default function NewFeeForm({ companies }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    const companyId = fd.get("company_id") as string;
    const description = fd.get("description") as string;
    const period = fd.get("period") as string;
    const amount = parseFloat(fd.get("amount") as string);
    const dueDate = fd.get("due_date") as string;
    const boletoUrl = (fd.get("boleto_url") as string) || null;
    const invoiceUrl = (fd.get("invoice_url") as string) || null;

    if (isNaN(amount) || amount <= 0) { setError("Valor inválido."); return; }

    startTransition(async () => {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("fees").insert({
        company_id: companyId,
        description,
        period: period + "-01",
        amount,
        due_date: dueDate,
        status: "pending",
        boleto_url: boletoUrl,
        invoice_url: invoiceUrl,
      });

      if (dbError) { setError("Erro ao salvar: " + dbError.message); return; }
      router.push("/admin/fees");
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Empresa <span className="text-red-400">*</span></label>
          <select name="company_id" required className={`${inputClass} cursor-pointer`}>
            <option value="">Selecione a empresa</option>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Descrição <span className="text-red-400">*</span></label>
          <input name="description" required className={inputClass} placeholder="Ex: Honorários Contábeis – Janeiro 2026" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Competência <span className="text-red-400">*</span></label>
            <input
              name="period"
              type="month"
              required
              defaultValue={new Date().toISOString().slice(0, 7)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Vencimento <span className="text-red-400">*</span></label>
            <input name="due_date" type="date" required className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Valor (R$) <span className="text-red-400">*</span></label>
          <input name="amount" type="number" step="0.01" min="0" required className={inputClass} placeholder="1500.00" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">URL do Boleto</label>
          <input name="boleto_url" type="url" className={inputClass} placeholder="https://..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">URL da Nota Fiscal</label>
          <input name="invoice_url" type="url" className={inputClass} placeholder="https://..." />
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={isPending} className="w-full h-11 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0d3352] transition-colors disabled:opacity-60">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><PlusCircle className="w-4 h-4" /> Criar Honorário</>}
        </button>
      </form>
    </div>
  );
}
