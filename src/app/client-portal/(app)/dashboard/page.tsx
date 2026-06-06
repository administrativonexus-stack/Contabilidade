import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FileText, MessageSquare, Clock, Megaphone, ClipboardCheck, Upload } from "lucide-react";
import StatCard from "@/components/portal/StatCard";
import Link from "next/link";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatFullDate() {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client-portal/login");

  const { data: profile } = await supabase
    .from("users").select("*, user_companies(company_id)")
    .eq("auth_user_id", user.id).single();

  const companyId = (profile?.user_companies as { company_id: string }[] | null)?.[0]?.company_id;

  const [docsRes, openTicketsRes, pendingTicketsRes, announcementsRes, recentDocsRes, recentTicketsRes, pendingActionsRes, awaitingReviewRes] =
    await Promise.all([
      supabase.from("documents").select("id", { count: "exact", head: true })
        .eq("company_id", companyId ?? "").is("deleted_at", null),
      supabase.from("tickets").select("id", { count: "exact", head: true })
        .eq("company_id", companyId ?? "").eq("status", "open"),
      supabase.from("tickets").select("id", { count: "exact", head: true })
        .eq("company_id", companyId ?? "").in("status", ["in_progress", "waiting_client"]),
      supabase.from("announcements").select("id", { count: "exact", head: true })
        .eq("published", true),
      supabase.from("documents").select("id, title, created_at")
        .eq("company_id", companyId ?? "").is("deleted_at", null)
        .order("created_at", { ascending: false }).limit(3),
      supabase.from("tickets").select("id, subject, status, updated_at")
        .eq("company_id", companyId ?? "")
        .order("updated_at", { ascending: false }).limit(3),
      supabase.from("pending_actions").select("id", { count: "exact", head: true })
        .eq("company_id", companyId ?? "").eq("status", "pending"),
      supabase.from("documents").select("id", { count: "exact", head: true })
        .eq("company_id", companyId ?? "").eq("workflow_status", "submitted").is("deleted_at", null),
    ]);

  const stats = {
    docs: docsRes.count ?? 0,
    open: openTicketsRes.count ?? 0,
    pending: pendingTicketsRes.count ?? 0,
    announcements: announcementsRes.count ?? 0,
    pendingActions: pendingActionsRes.count ?? 0,
    awaitingReview: awaitingReviewRes.count ?? 0,
  };

  const firstName = profile?.full_name?.split(" ")[0] ?? "Cliente";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#0F3D5E] to-[#2563EB] rounded-2xl p-6 text-white">
        <p className="text-xs text-white/60 capitalize">{formatFullDate()}</p>
        <h1 className="text-xl font-heading font-bold mt-1">Olá, {firstName}!</h1>
        <p className="text-sm text-white/70 mt-0.5">Bem-vindo ao seu portal. Aqui está um resumo da sua conta.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Documentos disponíveis" value={stats.docs} icon={FileText} color="blue" />
        <StatCard label="Solicitações abertas" value={stats.open} icon={MessageSquare} color="navy" />
        <StatCard label="Em andamento" value={stats.pending} icon={Clock} color="yellow" />
        <StatCard label="Comunicados" value={stats.announcements} icon={Megaphone} color="green" />
        <StatCard label="Ações pendentes" value={stats.pendingActions} icon={ClipboardCheck} color="red" href="/client-portal/pending" />
        <StatCard label="Docs aguardando revisão" value={stats.awaitingReview} icon={Upload} color="yellow" href="/client-portal/uploads" />
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent documents */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-heading font-semibold text-[#0F3D5E]">Documentos Recentes</h2>
            <Link href="/client-portal/documents" className="text-xs text-[#2563EB] hover:underline">Ver todos</Link>
          </div>
          {recentDocsRes.data?.length ? (
            <div className="space-y-3">
              {recentDocsRes.data.map((doc) => (
                <Link key={doc.id} href={`/client-portal/documents/${doc.id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0F3D5E] truncate">{doc.title}</p>
                    <p className="text-xs text-slate-400">{formatDate(doc.created_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">Nenhum documento ainda.</p>
          )}
        </div>

        {/* Recent requests */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-heading font-semibold text-[#0F3D5E]">Solicitações Recentes</h2>
            <Link href="/client-portal/requests" className="text-xs text-[#2563EB] hover:underline">Ver todas</Link>
          </div>
          {recentTicketsRes.data?.length ? (
            <div className="space-y-3">
              {recentTicketsRes.data.map((ticket) => (
                <Link key={ticket.id} href={`/client-portal/requests/${ticket.id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#0F3D5E]/8 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-[#0F3D5E]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#0F3D5E] truncate">{ticket.subject}</p>
                    <p className="text-xs text-slate-400">{formatDate(ticket.updated_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">Nenhuma solicitação ainda.</p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/client-portal/requests/new" className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          <MessageSquare className="w-4 h-4" /> Nova Solicitação
        </Link>
        <Link href="/client-portal/documents" className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-white border border-slate-200 text-[#0F3D5E] text-sm font-semibold hover:bg-slate-50 transition-colors">
          <FileText className="w-4 h-4" /> Ver Documentos
        </Link>
        <Link href="/client-portal/announcements" className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-white border border-slate-200 text-[#0F3D5E] text-sm font-semibold hover:bg-slate-50 transition-colors">
          <Megaphone className="w-4 h-4" /> Comunicados
        </Link>
      </div>
    </div>
  );
}
