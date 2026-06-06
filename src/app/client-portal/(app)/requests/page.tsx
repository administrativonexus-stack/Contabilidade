import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { MessageSquare, Plus } from "lucide-react";
import StatusBadge from "@/components/portal/StatusBadge";
import type { TicketStatus } from "@/types/database";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "open", label: "Abertas" },
  { value: "in_progress", label: "Em andamento" },
  { value: "waiting_client", label: "Aguardando você" },
  { value: "completed", label: "Concluídas" },
  { value: "cancelled", label: "Canceladas" },
];

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client-portal/login");

  const { data: profile } = await supabase.from("users").select("id, user_companies(company_id)").eq("auth_user_id", user.id).single();
  const companyId = (profile?.user_companies as { company_id: string }[] | null)?.[0]?.company_id;

  let query = supabase.from("tickets").select("*").eq("company_id", companyId ?? "").order("updated_at", { ascending: false });

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status as TicketStatus);
  }

  const { data: tickets } = await query;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Solicitações</h1>
          <p className="text-sm text-slate-400 mt-0.5">Acompanhe suas solicitações de serviço</p>
        </div>
        <Link href="/client-portal/requests/new" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Nova
        </Link>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_OPTIONS.map(({ value, label }) => {
          const active = (params.status ?? "all") === value;
          return (
            <Link
              key={value}
              href={`/client-portal/requests${value !== "all" ? `?status=${value}` : ""}`}
              className={`inline-flex items-center h-8 px-3 rounded-full text-xs font-semibold border transition-colors ${
                active
                  ? "bg-[#0F3D5E] text-white border-[#0F3D5E]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#0F3D5E]"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Tickets list */}
      {tickets?.length ? (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/client-portal/requests/${ticket.id}`}
              className="block bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#2563EB]/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#0F3D5E]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4 text-[#0F3D5E]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0F3D5E] truncate">{ticket.subject}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{ticket.description}</p>
                  </div>
                </div>
                <StatusBadge status={ticket.status} />
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Criada em {formatDate(ticket.created_at)}</span>
                <span>Atualizada em {formatDate(ticket.updated_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400">Nenhuma solicitação encontrada</p>
          <Link href="/client-portal/requests/new" className="inline-flex items-center gap-2 mt-4 h-9 px-4 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> Criar solicitação
          </Link>
        </div>
      )}
    </div>
  );
}
