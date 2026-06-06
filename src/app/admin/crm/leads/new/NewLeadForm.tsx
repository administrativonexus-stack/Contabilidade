"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { CrmLeadStatus } from "@/types/database";

const inputClass = "w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors";

const SOURCES = ["Landing Page", "Calculadora CLT vs PJ", "Calculadora Simples Nacional", "WhatsApp", "Indicação", "LinkedIn", "Google", "Manual", "Outro"];
const INDUSTRIES = ["Tecnologia", "Comércio", "Serviços", "Indústria", "Saúde", "Educação", "Imobiliário", "Agronegócio", "Outro"];

export default function NewLeadForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("crm_leads").insert({
        name: fd.get("name") as string,
        company_name: (fd.get("company_name") as string) || null,
        cnpj: (fd.get("cnpj") as string) || null,
        email: fd.get("email") as string,
        phone: (fd.get("phone") as string) || null,
        source: (fd.get("source") as string) || null,
        industry: (fd.get("industry") as string) || null,
        estimated_revenue: fd.get("estimated_revenue") ? Number(fd.get("estimated_revenue")) : null,
        notes: (fd.get("notes") as string) || null,
        status: "new" as CrmLeadStatus,
      });

      if (dbError) { setError("Erro ao criar lead: " + dbError.message); return; }
      router.push("/admin/crm/leads");
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Nome completo <span className="text-red-400">*</span></label>
            <input name="name" required className={inputClass} placeholder="João Silva" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Email <span className="text-red-400">*</span></label>
            <input name="email" type="email" required className={inputClass} placeholder="joao@empresa.com.br" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Telefone</label>
            <input name="phone" className={inputClass} placeholder="(11) 99999-9999" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Empresa</label>
            <input name="company_name" className={inputClass} placeholder="Nome da empresa" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">CNPJ</label>
            <input name="cnpj" className={inputClass} placeholder="00.000.000/0001-00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Origem</label>
            <select name="source" className={`${inputClass} cursor-pointer`}>
              <option value="">Selecionar</option>
              {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Segmento</label>
            <select name="industry" className={`${inputClass} cursor-pointer`}>
              <option value="">Selecionar</option>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Faturamento estimado (R$/mês)</label>
            <input name="estimated_revenue" type="number" min="0" className={inputClass} placeholder="50000" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Observações</label>
            <textarea name="notes" rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 resize-none transition-colors" placeholder="Contexto adicional..." />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={isPending} className="w-full h-11 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0d3352] transition-colors disabled:opacity-60">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus className="w-4 h-4" /> Criar Lead</>}
        </button>
      </form>
    </div>
  );
}
