import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import StatusBadge from "@/components/portal/StatusBadge";
import type { TicketStatus } from "@/types/database";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "open", label: "Abertas" },
  { value: "in_progress", label: "Em andamento" },
  { value: "waiting_client", label: "Aguardando cliente" },
  { value: "completed", label: "Concluídas" },
  { value: "cancelled", label: "Canceladas" },
];

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("tickets")
    .select("*, companies(company_name)")
    .order("updated_at", { ascending: false });

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status as TicketStatus);
  }

  const { data: tickets } = await query;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Solicitações</h1>
        <p className="text-sm text-slate-400 mt-0.5">{tickets?.length ?? 0} solicitação(ões)</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUS_OPTIONS.map(({ value, label }) => {
          const active = (params.status ?? "all") === value;
          return (
            <Link
              key={value}
              href={`/admin/requests${value !== "all" ? `?status=${value}` : ""}`}
              className={`inline-flex items-center h-8 px-3 rounded-full text-xs font-semibold border transition-colors ${
                active ? "bg-[#0F3D5E] text-white border-[#0F3D5E]" : "bg-white text-slate-600 border-slate-200 hover:border-[#0F3D5E]"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_160px_120px_100px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span>Assunto</span><span>Empresa</span><span>Status</span><span>Atualizado</span>
        </div>
        <div className="divide-y divide-slate-100">
          {tickets?.length ? tickets.map((t) => (
            <Link
              key={t.id}
              href={`/admin/requests/${t.id}`}
              className="grid grid-cols-1 sm:grid-cols-[1fr_160px_120px_100px] gap-2 sm:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#0F3D5E]/8 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-3.5 h-3.5 text-[#0F3D5E]" />
                </div>
                <p className="text-sm font-medium text-[#0F3D5E] truncate">{t.subject}</p>
              </div>
              <span className="text-xs text-slate-500 truncate">{(t.companies as { company_name: string } | null)?.company_name ?? "—"}</span>
              <StatusBadge status={t.status} />
              <span className="text-xs text-slate-400">{formatDate(t.updated_at)}</span>
            </Link>
          )) : (
            <div className="px-5 py-12 text-center">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Nenhuma solicitação encontrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
