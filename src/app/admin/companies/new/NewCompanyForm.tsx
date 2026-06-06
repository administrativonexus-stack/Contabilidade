"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const inputClass = "w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors";

export default function NewCompanyForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.from("companies").insert({
        company_name: fd.get("company_name") as string,
        trade_name: (fd.get("trade_name") as string) || null,
        cnpj: (fd.get("cnpj") as string)?.replace(/\D/g, "") || null,
        email: (fd.get("email") as string) || null,
        phone: (fd.get("phone") as string) || null,
        address: (fd.get("address") as string) || null,
        city: (fd.get("city") as string) || null,
        state: (fd.get("state") as string) || null,
        zip_code: (fd.get("zip_code") as string) || null,
        responsible_person: (fd.get("responsible_person") as string) || null,
        is_active: true,
      });
      if (error) { setError("Erro ao criar empresa: " + error.message); return; }
      router.push("/admin/companies");
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Razão Social <span className="text-red-400">*</span></label>
            <input name="company_name" required className={inputClass} placeholder="Empresa Ltda" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Nome Fantasia</label>
            <input name="trade_name" className={inputClass} placeholder="Opcional" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">CNPJ</label>
            <input name="cnpj" className={inputClass} placeholder="00.000.000/0000-00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">E-mail</label>
            <input name="email" type="email" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Telefone</label>
            <input name="phone" type="tel" className={inputClass} placeholder="(11) 99999-9999" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Endereço</label>
            <input name="address" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Cidade</label>
            <input name="city" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Estado (UF)</label>
            <input name="state" maxLength={2} className={inputClass} placeholder="SP" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">CEP</label>
            <input name="zip_code" className={inputClass} placeholder="00000-000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Responsável</label>
            <input name="responsible_person" className={inputClass} />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={isPending} className="w-full h-11 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0d3352] transition-colors disabled:opacity-60">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar empresa"}
        </button>
      </form>
    </div>
  );
}
