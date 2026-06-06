import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Megaphone, Plus } from "lucide-react";
import type { AnnouncementCategory } from "@/types/database";

const CATEGORY_LABELS: Record<AnnouncementCategory, string> = {
  general: "Geral", tax_update: "Atualização Fiscal",
  compliance: "Compliance", deadline: "Prazos", company_news: "Novidades",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Comunicados</h1>
          <p className="text-sm text-slate-400 mt-0.5">{announcements?.length ?? 0} comunicado(s)</p>
        </div>
        <Link href="/admin/announcements/new" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Novo comunicado
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_120px_100px_100px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span>Título</span><span>Categoria</span><span>Status</span><span>Publicado em</span>
        </div>
        <div className="divide-y divide-slate-100">
          {announcements?.length ? announcements.map((a) => (
            <Link key={a.id} href={`/admin/announcements/${a.id}`} className="grid grid-cols-1 sm:grid-cols-[1fr_120px_100px_100px] gap-2 sm:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-3.5 h-3.5 text-[#2563EB]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#0F3D5E] truncate">{a.title}</p>
                  <p className="text-xs text-slate-400 truncate">{a.summary}</p>
                </div>
              </div>
              <span className="text-xs text-slate-500">{CATEGORY_LABELS[a.category as AnnouncementCategory]}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold w-fit ${a.published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {a.published ? "Publicado" : "Rascunho"}
              </span>
              <span className="text-xs text-slate-400">{formatDate(a.published_at)}</span>
            </Link>
          )) : (
            <div className="px-5 py-12 text-center">
              <Megaphone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Nenhum comunicado criado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
