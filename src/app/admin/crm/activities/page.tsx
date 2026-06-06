import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CalendarCheck, Plus, AlertCircle } from "lucide-react";
import type { CrmActivityType, CrmTaskStatus, ActionPriority } from "@/types/database";
import PriorityBadge from "@/components/portal/PriorityBadge";

const TYPE_LABELS: Record<CrmActivityType, string> = {
  call: "Ligação", meeting: "Reunião", email: "Email",
  follow_up: "Follow-up", proposal_review: "Revisão Proposta", internal_task: "Tarefa Interna",
};

const STATUS_LABELS: Record<CrmTaskStatus, string> = {
  pending: "Pendente", in_progress: "Em Andamento", completed: "Concluída", cancelled: "Cancelada",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function isOverdue(due: string | null, status: CrmTaskStatus): boolean {
  if (!due || status === "completed" || status === "cancelled") return false;
  return new Date(due) < new Date();
}

export default async function ActivitiesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const statusFilter = (params.status as CrmTaskStatus) || "pending";

  const supabase = await createClient();
  const { data: activities } = await supabase
    .from("crm_activities")
    .select("*, crm_leads(name, company_name)")
    .eq("status", statusFilter)
    .order("due_date", { ascending: true, nullsFirst: false });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Atividades</h1>
          <p className="text-sm text-slate-400 mt-0.5">{activities?.length ?? 0} atividade(s)</p>
        </div>
        <Link href="/admin/crm/activities/new" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Nova Atividade
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {(["pending", "in_progress", "completed", "cancelled"] as CrmTaskStatus[]).map((s) => (
          <Link key={s} href={`/admin/crm/activities?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? "bg-white text-[#0F3D5E] shadow-sm" : "text-slate-500 hover:text-[#0F3D5E]"}`}>
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      {activities?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1fr_120px_100px_120px_100px_100px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Título</span><span>Lead/Empresa</span><span>Tipo</span><span>Prazo</span><span>Prioridade</span><span>Status</span>
          </div>
          <div className="divide-y divide-slate-100">
            {activities.map((a) => {
              const overdue = isOverdue(a.due_date, a.status as CrmTaskStatus);
              const lead = a.crm_leads as unknown as { name: string; company_name: string | null } | null;
              return (
                <div key={a.id} className={`grid grid-cols-1 lg:grid-cols-[1fr_120px_100px_120px_100px_100px] gap-2 lg:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors ${overdue ? "bg-rose-50/30" : ""}`}>
                  <div>
                    <p className="text-sm font-medium text-[#0F3D5E]">{a.title}</p>
                    {a.description && <p className="text-xs text-slate-400 truncate">{a.description}</p>}
                  </div>
                  <span className="text-xs text-slate-500 truncate">{lead?.company_name ?? lead?.name ?? "—"}</span>
                  <span className="text-xs text-slate-500">{TYPE_LABELS[a.type as CrmActivityType]}</span>
                  <span className={`text-xs flex items-center gap-1 ${overdue ? "text-rose-600 font-semibold" : "text-slate-500"}`}>
                    {overdue && <AlertCircle className="w-3 h-3 flex-shrink-0" />} {formatDate(a.due_date)}
                  </span>
                  <PriorityBadge priority={a.priority as ActionPriority} />
                  <span className="text-xs text-slate-500">{STATUS_LABELS[a.status as CrmTaskStatus]}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400">Nenhuma atividade com status "{STATUS_LABELS[statusFilter]}"</p>
        </div>
      )}
    </div>
  );
}
