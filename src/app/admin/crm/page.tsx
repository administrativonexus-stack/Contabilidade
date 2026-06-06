import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { UserPlus, Target, FileCheck, ScrollText, TrendingUp, AlertCircle, CalendarCheck } from "lucide-react";
import StatCard from "@/components/portal/StatCard";
import type { CrmLeadStatus, CrmOpportunityStage } from "@/types/database";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

const STAGE_LABELS: Record<CrmOpportunityStage, string> = {
  new_lead: "Novo Lead", initial_contact: "Contato Inicial", discovery: "Descoberta",
  proposal_sent: "Proposta Enviada", negotiation: "Negociação", won: "Ganho", lost: "Perdido",
};

export default async function CrmDashboardPage() {
  const supabase = await createClient();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [newLeadsRes, openOppRes, proposalsRes, contractsRes, wonOppRes, lostOppRes] = await Promise.all([
    supabase.from("crm_leads").select("id", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo),
    supabase.from("crm_opportunities").select("id", { count: "exact", head: true }).not("stage", "in", '("won","lost")'),
    supabase.from("crm_proposals").select("id", { count: "exact", head: true }).in("status", ["sent", "viewed"]),
    supabase.from("crm_contracts").select("id", { count: "exact", head: true }).eq("status", "signed").gte("created_at", thirtyDaysAgo),
    supabase.from("crm_opportunities").select("id", { count: "exact", head: true }).eq("stage", "won").gte("created_at", thirtyDaysAgo),
    supabase.from("crm_opportunities").select("id", { count: "exact", head: true }).eq("stage", "lost").gte("created_at", thirtyDaysAgo),
  ]);

  const totalClosed = (wonOppRes.count ?? 0) + (lostOppRes.count ?? 0);
  const conversionRate = totalClosed > 0 ? Math.round(((wonOppRes.count ?? 0) / totalClosed) * 100) : 0;

  const { data: topOpps } = await supabase
    .from("crm_opportunities")
    .select("id, title, estimated_value, stage, crm_leads(company_name)")
    .not("stage", "in", '("won","lost")')
    .order("estimated_value", { ascending: false, nullsFirst: false })
    .limit(5);

  const { data: recentLeads } = await supabase
    .from("crm_leads")
    .select("id, name, company_name, source, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: overdueActivities } = await supabase
    .from("crm_activities")
    .select("id, title, type, due_date, crm_leads(name)")
    .eq("status", "pending")
    .lt("due_date", new Date().toISOString().split("T")[0])
    .order("due_date", { ascending: true })
    .limit(5);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">CRM Dashboard</h1>
        <p className="text-sm text-slate-400 mt-0.5">Visão geral comercial</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Novos Leads (30d)" value={newLeadsRes.count ?? 0} icon={UserPlus} color="blue" href="/admin/crm/leads" />
        <StatCard label="Oportunidades abertas" value={openOppRes.count ?? 0} icon={Target} color="navy" href="/admin/crm/pipeline" />
        <StatCard label="Propostas em aberto" value={proposalsRes.count ?? 0} icon={FileCheck} color="yellow" href="/admin/crm/proposals" />
        <StatCard label="Contratos (30d)" value={contractsRes.count ?? 0} icon={ScrollText} color="green" href="/admin/crm/contracts" />
        <StatCard label="Taxa de conversão" value={`${conversionRate}%`} icon={TrendingUp} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top opportunities */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-heading font-semibold text-[#0F3D5E]">Maiores Oportunidades</h2>
            <Link href="/admin/crm/pipeline" className="text-xs text-[#2563EB] hover:underline">Ver pipeline</Link>
          </div>
          {topOpps?.length ? (
            <div className="space-y-2">
              {topOpps.map((opp) => (
                <Link key={opp.id} href={`/admin/crm/opportunities/${opp.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0F3D5E] truncate">{opp.title}</p>
                    <p className="text-xs text-slate-400">{(opp.crm_leads as unknown as { company_name: string | null } | null)?.company_name ?? "—"} · {STAGE_LABELS[opp.stage as CrmOpportunityStage]}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#10B981] ml-4 flex-shrink-0">{opp.estimated_value ? formatCurrency(opp.estimated_value) : "—"}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">Nenhuma oportunidade aberta.</p>
          )}
        </div>

        {/* Overdue activities */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-heading font-semibold text-[#0F3D5E] flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-500" /> Atividades Vencidas
            </h2>
            <Link href="/admin/crm/activities" className="text-xs text-[#2563EB] hover:underline">Ver todas</Link>
          </div>
          {overdueActivities?.length ? (
            <div className="space-y-2">
              {overdueActivities.map((a) => (
                <div key={a.id} className="p-3 rounded-xl bg-rose-50/50 border border-rose-100">
                  <p className="text-sm font-medium text-[#0F3D5E] truncate">{a.title}</p>
                  <p className="text-xs text-rose-500 mt-0.5">{a.due_date ? formatDate(a.due_date) : "—"}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <CalendarCheck className="w-8 h-8 text-emerald-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Sem atividades vencidas</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent leads */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-heading font-semibold text-[#0F3D5E]">Leads Recentes</h2>
          <Link href="/admin/crm/leads" className="text-xs text-[#2563EB] hover:underline">Ver todos</Link>
        </div>
        {recentLeads?.length ? (
          <div className="hidden lg:grid grid-cols-[1fr_160px_120px_100px_80px] gap-4 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            <span>Nome</span><span>Empresa</span><span>Fonte</span><span>Status</span><span>Data</span>
          </div>
        ) : null}
        {recentLeads?.length ? (
          <div className="divide-y divide-slate-50">
            {recentLeads.map((lead) => (
              <Link key={lead.id} href={`/admin/crm/leads/${lead.id}`} className="grid grid-cols-1 lg:grid-cols-[1fr_160px_120px_100px_80px] gap-1 lg:gap-4 px-3 py-3 hover:bg-slate-50 rounded-xl transition-colors items-center">
                <span className="text-sm font-medium text-[#0F3D5E]">{lead.name}</span>
                <span className="text-xs text-slate-500 truncate">{lead.company_name ?? "—"}</span>
                <span className="text-xs text-slate-400">{lead.source ?? "—"}</span>
                <span className="text-xs text-slate-500">{lead.status}</span>
                <span className="text-xs text-slate-400">{formatDate(lead.created_at)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-6">Nenhum lead ainda.</p>
        )}
      </div>
    </div>
  );
}
