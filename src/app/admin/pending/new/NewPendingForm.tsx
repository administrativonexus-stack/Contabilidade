"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PlusCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ActionPriority } from "@/types/database";

const inputClass = "w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors";

const PRIORITIES: { value: ActionPriority; label: string }[] = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
];

const ACTION_TYPES = [
  "Enviar documento",
  "Fornecer informações adicionais",
  "Assinar contrato",
  "Revisar relatório fiscal",
  "Enviar informações de folha",
  "Outro",
];

interface Props {
  companies: { id: string; company_name: string }[];
}

export default function NewPendingForm({ companies }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Não autenticado."); return; }

      const { data: profile } = await supabase.from("users").select("id").eq("auth_user_id", user.id).single();
      if (!profile) { setError("Perfil não encontrado."); return; }

      const { error: dbError } = await supabase.from("pending_actions").insert({
        company_id: fd.get("company_id") as string,
        created_by: profile.id,
        title: fd.get("title") as string,
        description: (fd.get("description") as string) || null,
        action_type: fd.get("action_type") as string,
        priority: fd.get("priority") as ActionPriority,
        due_date: (fd.get("due_date") as string) || null,
        status: "pending",
      });

      if (dbError) { setError("Erro ao criar ação: " + dbError.message); return; }
      router.push("/admin/pending");
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
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Título <span className="text-red-400">*</span></label>
          <input name="title" required className={inputClass} placeholder="Ex: Enviar declaração de IR 2025" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Descrição</label>
          <textarea name="description" rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 resize-none transition-colors" placeholder="Detalhes sobre a ação necessária..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Tipo <span className="text-red-400">*</span></label>
            <select name="action_type" required className={`${inputClass} cursor-pointer`}>
              {ACTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Prioridade <span className="text-red-400">*</span></label>
            <select name="priority" required defaultValue="medium" className={`${inputClass} cursor-pointer`}>
              {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Prazo</label>
          <input name="due_date" type="date" className={inputClass} />
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={isPending} className="w-full h-11 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0d3352] transition-colors disabled:opacity-60">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><PlusCircle className="w-4 h-4" /> Criar Ação Pendente</>}
        </button>
      </form>
    </div>
  );
}
