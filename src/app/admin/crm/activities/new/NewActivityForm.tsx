"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CalendarCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { CrmActivityType, CrmTaskStatus, ActionPriority } from "@/types/database";

const inputClass = "w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors";

const TYPES: { value: CrmActivityType; label: string }[] = [
  { value: "call", label: "Ligação" }, { value: "meeting", label: "Reunião" },
  { value: "email", label: "Email" }, { value: "follow_up", label: "Follow-up" },
  { value: "proposal_review", label: "Revisão de Proposta" }, { value: "internal_task", label: "Tarefa Interna" },
];

const PRIORITIES: { value: ActionPriority; label: string }[] = [
  { value: "low", label: "Baixa" }, { value: "medium", label: "Média" },
  { value: "high", label: "Alta" }, { value: "urgent", label: "Urgente" },
];

interface Props {
  leads: { id: string; name: string; company_name: string | null }[];
}

export default function NewActivityForm({ leads }: Props) {
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

      const { error: dbError } = await supabase.from("crm_activities").insert({
        type: fd.get("type") as CrmActivityType,
        title: fd.get("title") as string,
        description: (fd.get("description") as string) || null,
        lead_id: (fd.get("lead_id") as string) || null,
        due_date: (fd.get("due_date") as string) || null,
        priority: fd.get("priority") as ActionPriority,
        status: "pending" as CrmTaskStatus,
        created_by: profile?.id ?? null,
      });

      if (dbError) { setError("Erro: " + dbError.message); return; }
      router.push("/admin/crm/activities");
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Título <span className="text-red-400">*</span></label>
            <input name="title" required className={inputClass} placeholder="Ex: Ligar para João sobre proposta" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Tipo <span className="text-red-400">*</span></label>
            <select name="type" required className={`${inputClass} cursor-pointer`}>
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Prioridade</label>
            <select name="priority" defaultValue="medium" className={`${inputClass} cursor-pointer`}>
              {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Lead vinculado</label>
            <select name="lead_id" className={`${inputClass} cursor-pointer`}>
              <option value="">Nenhum</option>
              {leads.map((l) => <option key={l.id} value={l.id}>{l.company_name ?? l.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Prazo</label>
            <input name="due_date" type="date" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Descrição</label>
            <textarea name="description" rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] resize-none" />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={isPending} className="w-full h-11 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0d3352] transition-colors disabled:opacity-60">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CalendarCheck className="w-4 h-4" /> Criar Atividade</>}
        </button>
      </form>
    </div>
  );
}
