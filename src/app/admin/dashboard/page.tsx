import { createClient } from "@/lib/supabase/server";
import { Building2, Users, FileText, MessageSquare, Megaphone, CheckCircle2, ClipboardCheck, ListChecks } from "lucide-react";
import StatCard from "@/components/portal/StatCard";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [companiesRes, usersRes, docsRes, openTicketsRes, completedTicketsRes, announcementsRes, reviewQueueRes, pendingActionsRes] =
    await Promise.all([
      supabase.from("companies").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("documents").select("id", { count: "exact", head: true }).is("deleted_at", null).gte("created_at", thirtyDaysAgo),
      supabase.from("tickets").select("id", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("tickets").select("id", { count: "exact", head: true }).eq("status", "completed").gte("updated_at", thirtyDaysAgo),
      supabase.from("announcements").select("id", { count: "exact", head: true }).eq("published", true),
      supabase.from("documents").select("id", { count: "exact", head: true }).in("workflow_status", ["submitted", "under_review", "pending_information"]).is("deleted_at", null),
      supabase.from("pending_actions").select("id", { count: "exact", head: true }).eq("status", "pending"),
    ]);

  // Recent open tickets
  const { data: recentTickets } = await supabase
    .from("tickets")
    .select("id, subject, status, companies(company_name), created_at")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(5);

  // Recent documents
  const { data: recentDocs } = await supabase
    .from("documents")
    .select("id, title, companies(company_name), created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(5);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-0.5">Visão geral da plataforma</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Clientes ativos" value={companiesRes.count ?? 0} icon={Building2} color="navy" />
        <StatCard label="Usuários ativos" value={usersRes.count ?? 0} icon={Users} color="blue" />
        <StatCard label="Docs enviados (30d)" value={docsRes.count ?? 0} icon={FileText} color="green" />
        <StatCard label="Solicitações abertas" value={openTicketsRes.count ?? 0} icon={MessageSquare} color="yellow" />
        <StatCard label="Concluídas (30d)" value={completedTicketsRes.count ?? 0} icon={CheckCircle2} color="green" />
        <StatCard label="Comunicados publicados" value={announcementsRes.count ?? 0} icon={Megaphone} color="blue" />
        <StatCard label="Fila de revisão" value={reviewQueueRes.count ?? 0} icon={ClipboardCheck} color="yellow" href="/admin/review" />
        <StatCard label="Ações pendentes" value={pendingActionsRes.count ?? 0} icon={ListChecks} color="red" href="/admin/pending" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open tickets */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-heading font-semibold text-[#0F3D5E]">Solicitações Abertas</h2>
            <a href="/admin/requests" className="text-xs text-[#2563EB] hover:underline">Ver todas</a>
          </div>
          {recentTickets?.length ? (
            <div className="space-y-3">
              {recentTickets.map((t) => (
                <a key={t.id} href={`/admin/requests/${t.id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#0F3D5E] truncate">{t.subject}</p>
                    <p className="text-xs text-slate-400">{(t.companies as { company_name: string } | null)?.company_name} · {formatDate(t.created_at)}</p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">Nenhuma solicitação aberta.</p>
          )}
        </div>

        {/* Recent documents */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-heading font-semibold text-[#0F3D5E]">Documentos Recentes</h2>
            <a href="/admin/documents" className="text-xs text-[#2563EB] hover:underline">Ver todos</a>
          </div>
          {recentDocs?.length ? (
            <div className="space-y-3">
              {recentDocs.map((d) => (
                <div key={d.id} className="flex items-center gap-3 p-2 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#0F3D5E] truncate">{d.title}</p>
                    <p className="text-xs text-slate-400">{(d.companies as { company_name: string } | null)?.company_name} · {formatDate(d.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">Nenhum documento recente.</p>
          )}
        </div>
      </div>
    </div>
  );
}
