import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft, Calendar } from "lucide-react";
import type { AnnouncementCategory } from "@/types/database";

const CATEGORY_LABELS: Record<AnnouncementCategory, string> = {
  general: "Geral",
  tax_update: "Atualização Fiscal",
  compliance: "Compliance",
  deadline: "Prazos",
  company_news: "Novidades",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client-portal/login");

  const { data: ann } = await supabase.from("announcements").select("*").eq("id", id).eq("published", true).single();
  if (!ann) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/client-portal/announcements" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" /> Voltar aos comunicados
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#2563EB]">
            {CATEGORY_LABELS[ann.category]}
          </span>
          {ann.published_at && (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" /> {formatDate(ann.published_at)}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-heading font-bold text-[#0F3D5E] leading-tight">{ann.title}</h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">{ann.summary}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="prose prose-sm max-w-none text-slate-600 whitespace-pre-wrap leading-relaxed">
          {ann.content}
        </div>
      </div>

      <Link href="/client-portal/announcements" className="inline-flex items-center gap-1.5 text-sm text-[#2563EB] hover:underline">
        <ChevronLeft className="w-4 h-4" /> Todos os comunicados
      </Link>
    </div>
  );
}
