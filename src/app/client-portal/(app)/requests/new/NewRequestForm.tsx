"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { createTicket } from "../actions";

const REQUEST_TYPES = [
  "Emissão de Nota Fiscal",
  "Solicitação de Certidão",
  "Alteração Contratual",
  "Abertura de Empresa",
  "Suporte com Folha de Pagamento",
  "Outro",
];

const inputClass = "w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors";

export default function NewRequestForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createTicket(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
      <form action={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            Tipo de Solicitação <span className="text-red-400">*</span>
          </label>
          <select name="type" className={`${inputClass} cursor-pointer`}>
            {REQUEST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            Assunto <span className="text-red-400">*</span>
          </label>
          <input
            name="subject"
            type="text"
            required
            maxLength={120}
            placeholder="Ex: Certidão negativa federal urgente"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            Descrição <span className="text-red-400">*</span>
          </label>
          <textarea
            name="description"
            required
            minLength={20}
            rows={5}
            placeholder="Descreva com detalhes o que você precisa..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors resize-none"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-11 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0d3352] transition-colors disabled:opacity-60"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar Solicitação"}
        </button>
      </form>
    </div>
  );
}
