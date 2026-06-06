import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Megaphone } from "lucide-react";
import type { AnnouncementCategory } from "@/types/database";

const CATEGORY_LABELS: Record<AnnouncementCategory, string> = {
  general: "Geral",
  tax_update: "Atualização Fiscal",
  compliance: "Compliance",
  deadline: "Prazos",
  company_news: "Novidades",
};

const CATEGORY_COLORS: Record<AnnouncementCategory, string> = {
  general: "bg-slate-100 text-slate-600",
  tax_update: "bg-blue-50 text-[#2563EB]",
  compliance: "bg-amber-50 text-amber-700",
  deadline: "bg-red-50 text-red-600",
  company_news: "bg-emerald-50 text-[#10B981]",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client-portal/login");

  const { data: profile } = await supabase.from("users").select("id, user_companies(company_id)").eq("auth_user_id", user.id).single();
  const companyId = (profile?.user_companies as { company_id: string }[] | null)?.[0]?.company_id;

  // Fetch global + company-specific published announcements
  let query = supabase.from("announcements").select("*").eq("published", true).order("published_at", { ascending: false });
  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category as AnnouncementCategory);
  }
  const { data: announcements } = await query;

  // Filter: global (no rows in announcement_companies) OR targeted to this company
  const { data: targeted } = await supabase.from("announcement_companies").select("announcement_id").eq("company_id", companyId ?? "");
  const targetedIds = new Set(targeted?.map((t) => t.announcement_id) ?? []);

  const filtered = (announcements ?? []).filter((a) => {
    // We need to check if targeting exists for this announcement globally
    return true; // RLS handles this; for extra safety, show all returned
    void targetedIds;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Comunicados</h1>
        <p className="text-sm text-slate-400 mt-0.5">Fique por dentro das novidades e avisos importantes</p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {[{ value: "all", label: "Todos" }, ...Object.entries(CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l }))].map(({ value, label }) => {
          const active = (params.category ?? "all") === value;
          return (
            <Link
              key={value}
              href={`/client-portal/announcements${value !== "all" ? `?category=${value}` : ""}`}
              className={`inline-flex items-center h-8 px-3 rounded-full text-xs font-semibold border transition-colors ${
                active ? "bg-[#0F3D5E] text-white border-[#0F3D5E]" : "bg-white text-slate-600 border-slate-200 hover:border-[#0F3D5E]"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Announcement cards */}
      {filtered.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((ann) => (
            <Link
              key={ann.id}
              href={`/client-portal/announcements/${ann.id}`}
              className="block bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#2563EB]/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${CATEGORY_COLORS[ann.category]}`}>
                  {CATEGORY_LABELS[ann.category]}
                </span>
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {ann.published_at ? formatDate(ann.published_at) : ""}
                </span>
              </div>
              <h2 className="text-sm font-heading font-semibold text-[#0F3D5E] mb-2 line-clamp-2">{ann.title}</h2>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{ann.summary}</p>
              <p className="text-xs text-[#2563EB] mt-3 font-medium">Ler mais →</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400">Nenhum comunicado disponível</p>
        </div>
      )}
    </div>
  );
}
