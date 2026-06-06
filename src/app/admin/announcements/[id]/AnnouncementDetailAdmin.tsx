"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { AnnouncementRow } from "@/types/database";

interface Props {
  ann: AnnouncementRow;
  targeted: { company_id: string; companies: { company_name: string } | null }[];
}

export default function AnnouncementDetailAdmin({ ann, targeted }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function publish() {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.from("announcements").update({ published: true, published_at: new Date().toISOString() }).eq("id", ann.id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${ann.published ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
            {ann.published ? "Publicado" : "Rascunho"}
          </span>
          {!ann.published && (
            <button onClick={publish} disabled={isPending} className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60">
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Publicar agora
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Resumo</p>
        <p className="text-sm text-slate-600 mb-5">{ann.summary}</p>
        <p className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">Conteúdo completo</p>
        <div className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{ann.content}</div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Destinatários</p>
        {targeted.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {targeted.map((t) => (
              <span key={t.company_id} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#0F3D5E]/8 text-[#0F3D5E]">
                {t.companies?.company_name ?? t.company_id}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Global — todos os clientes ativos</p>
        )}
      </div>
    </div>
  );
}
