import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ClipboardCheck, PlusCircle, Calendar } from "lucide-react";
import type { ActionPriority } from "@/types/database";
import PriorityBadge from "@/components/portal/PriorityBadge";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function isOverdue(due: string | null): boolean {
  if (!due) return false;
  return new Date(due) < new Date();
}

export default async function AdminPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status === "completed" ? "completed" : "pending";

  const supabase = await createClient();
  const { data: actions } = await supabase
    .from("pending_actions")
    .select("*, companies(company_name)")
    .eq("status", statusFilter)
    .order("due_date", { ascending: true, nullsFirst: false });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Ações Pendentes</h1>
          <p className="text-sm text-slate-400 mt-0.5">{actions?.length ?? 0} ação(ões)</p>
        </div>
        <Link href="/admin/pending/new" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          <PlusCircle className="w-4 h-4" /> Nova Ação
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {(["pending", "completed"] as const).map((t) => (
          <Link
            key={t}
            href={`/admin/pending${t === "completed" ? "?status=completed" : ""}`}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === t ? "bg-white text-[#0F3D5E] shadow-sm" : "text-slate-500 hover:text-[#0F3D5E]"}`}
          >
            {t === "pending" ? "Pendentes" : "Concluídas"}
          </Link>
        ))}
      </div>

      {actions?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1fr_160px_100px_120px_120px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Título</span>
            <span>Empresa</span>
            <span>Prioridade</span>
            <span>Prazo</span>
            <span>{statusFilter === "completed" ? "Concluída em" : "Status"}</span>
          </div>
          <div className="divide-y divide-slate-100">
            {actions.map((action) => {
              const overdue = statusFilter === "pending" && isOverdue(action.due_date);
              return (
                <div key={action.id} className={`grid grid-cols-1 lg:grid-cols-[1fr_160px_100px_120px_120px] gap-2 lg:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors ${overdue ? "bg-rose-50/30" : ""}`}>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0F3D5E] truncate">{action.title}</p>
                    {action.description && <p className="text-xs text-slate-400 truncate mt-0.5">{action.description}</p>}
                  </div>
                  <span className="text-xs text-slate-500 truncate">{(action.companies as { company_name: string } | null)?.company_name ?? "—"}</span>
                  <PriorityBadge priority={action.priority as ActionPriority} />
                  <span className={`text-xs flex items-center gap-1 ${overdue ? "text-rose-600 font-semibold" : "text-slate-500"}`}>
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" /> {formatDate(action.due_date)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {statusFilter === "completed" ? formatDate(action.completed_at) : action.action_type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <ClipboardCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400">
            {statusFilter === "pending" ? "Nenhuma ação pendente" : "Nenhuma ação concluída"}
          </p>
          {statusFilter === "pending" && (
            <Link href="/admin/pending/new" className="inline-flex items-center gap-1 mt-3 text-sm text-[#2563EB] hover:underline">
              <PlusCircle className="w-3.5 h-3.5" /> Criar primeira ação
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
