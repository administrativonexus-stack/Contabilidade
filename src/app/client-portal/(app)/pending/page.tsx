import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ClipboardCheck, Calendar, AlertCircle } from "lucide-react";
import type { ActionPriority } from "@/types/database";
import PriorityBadge from "@/components/portal/PriorityBadge";
import CompletePendingButton from "./CompletePendingButton";

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function isOverdue(due: string | null): boolean {
  if (!due) return false;
  return new Date(due) < new Date();
}

export default async function PendingPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const tab = params.tab === "completed" ? "completed" : "pending";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client-portal/login");

  const { data: profile } = await supabase
    .from("users")
    .select("id, user_companies(company_id)")
    .eq("auth_user_id", user.id)
    .single();
  const companyId = (profile?.user_companies as { company_id: string }[] | null)?.[0]?.company_id ?? "";

  const { data: actions } = await supabase
    .from("pending_actions")
    .select("*, documents(title)")
    .eq("company_id", companyId)
    .eq("status", tab)
    .order("due_date", { ascending: true, nullsFirst: false });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ClipboardCheck className="w-5 h-5 text-[#2563EB]" />
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Ações Pendentes</h1>
        </div>
        <p className="text-sm text-slate-400">Tarefas atribuídas pela equipe Nexus</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {(["pending", "completed"] as const).map((t) => (
          <Link
            key={t}
            href={`/client-portal/pending${t === "completed" ? "?tab=completed" : ""}`}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-white text-[#0F3D5E] shadow-sm" : "text-slate-500 hover:text-[#0F3D5E]"}`}
          >
            {t === "pending" ? "Pendentes" : "Concluídas"}
          </Link>
        ))}
      </div>

      {actions?.length ? (
        <div className="space-y-3">
          {actions.map((action) => {
            const overdue = tab === "pending" && isOverdue(action.due_date);
            return (
              <div key={action.id} className={`bg-white rounded-2xl border p-5 ${overdue ? "border-rose-200" : "border-slate-200"}`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {overdue && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" /> Vencida
                        </span>
                      )}
                      <PriorityBadge priority={action.priority as ActionPriority} />
                    </div>
                    <h3 className="text-sm font-semibold text-[#0F3D5E]">{action.title}</h3>
                    {action.description && (
                      <p className="text-sm text-slate-600 mt-1">{action.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      {action.due_date && (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5" /> Prazo: {formatDate(action.due_date)}
                        </span>
                      )}
                      {action.documents && (
                        <Link href={`/client-portal/documents/${action.document_id}`} className="text-xs text-[#2563EB] hover:underline">
                          Ver documento relacionado
                        </Link>
                      )}
                    </div>
                  </div>
                  {tab === "pending" && <CompletePendingButton id={action.id} />}
                  {tab === "completed" && action.completed_at && (
                    <span className="text-xs text-slate-400">Concluída em {formatDate(action.completed_at)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <ClipboardCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400">
            {tab === "pending" ? "Nenhuma ação pendente" : "Nenhuma ação concluída"}
          </p>
          {tab === "pending" && <p className="text-xs text-slate-300 mt-1">A equipe Nexus criará tarefas quando necessário</p>}
        </div>
      )}
    </div>
  );
}
