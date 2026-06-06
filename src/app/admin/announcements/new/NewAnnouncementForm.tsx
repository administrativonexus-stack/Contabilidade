"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { AnnouncementCategory } from "@/types/database";

const CATEGORIES: { value: AnnouncementCategory; label: string }[] = [
  { value: "general", label: "Geral" },
  { value: "tax_update", label: "Atualização Fiscal" },
  { value: "compliance", label: "Compliance" },
  { value: "deadline", label: "Prazos" },
  { value: "company_news", label: "Novidades" },
];

const inputClass = "w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors";

interface Props {
  companies: { id: string; company_name: string }[];
}

export default function NewAnnouncementForm({ companies }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [publishNow, setPublishNow] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
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

      const { data: ann, error: annError } = await supabase.from("announcements").insert({
        title: fd.get("title") as string,
        summary: fd.get("summary") as string,
        content: fd.get("content") as string,
        category: fd.get("category") as AnnouncementCategory,
        published: publishNow,
        published_at: publishNow ? new Date().toISOString() : null,
        created_by: profile.id,
      }).select().single();

      if (annError || !ann) { setError("Erro ao criar comunicado: " + annError?.message); return; }

      if (selectedCompanies.length > 0) {
        await supabase.from("announcement_companies").insert(
          selectedCompanies.map((cid) => ({ announcement_id: ann.id, company_id: cid }))
        );
      }

      router.push("/admin/announcements");
    });
  }

  function toggleCompany(id: string) {
    setSelectedCompanies((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Título <span className="text-red-400">*</span></label>
          <input name="title" required className={inputClass} placeholder="Ex: Prazo para entrega do IR 2026" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Resumo <span className="text-red-400">*</span></label>
          <input name="summary" required className={inputClass} placeholder="Breve descrição exibida na listagem" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Categoria</label>
          <select name="category" className={`${inputClass} cursor-pointer`}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Conteúdo completo <span className="text-red-400">*</span></label>
          <textarea name="content" required rows={8} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors resize-none" placeholder="Texto completo do comunicado..." />
        </div>

        {/* Company targeting */}
        <div>
          <p className="text-sm font-medium text-slate-600 mb-2">Enviar para empresas específicas</p>
          <p className="text-xs text-slate-400 mb-3">Deixe vazio para enviar a todos os clientes ativos (global).</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {companies.map((c) => (
              <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCompanies.includes(c.id)}
                  onChange={() => toggleCompany(c.id)}
                  className="w-4 h-4 rounded text-[#2563EB]"
                />
                <span className="text-sm text-slate-600 truncate">{c.company_name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Publish option */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={publishNow} onChange={(e) => setPublishNow(e.target.checked)} className="w-4 h-4 rounded text-[#2563EB]" />
          <span className="text-sm font-medium text-slate-600">Publicar imediatamente</span>
        </label>

        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={isPending} className="w-full h-11 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0d3352] transition-colors disabled:opacity-60">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : publishNow ? "Publicar comunicado" : "Salvar como rascunho"}
        </button>
      </form>
    </div>
  );
}
