import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft, DollarSign, Calendar, FileCheck, Plus } from "lucide-react";
import type { CrmOpportunityStage } from "@/types/database";
import OpportunityActions from "./OpportunityActions";

const STAGE_LABELS: Record<CrmOpportunityStage, string> = {
  new_lead: "Novo Lead", initial_contact: "Contato Inicial", discovery: "Descoberta",
  proposal_sent: "Proposta Enviada", negotiation: "Negociação", won: "Ganho", lost: "Perdido",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}
function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

export default async function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client-portal/login");
  const { data: profile } = await supabase.from("users").select("id").eq("auth_user_id", user.id).single();

  const [{ data: opp }, { data: notes }, { data: proposals }] = await Promise.all([
    supabase.from("crm_opportunities").select("*, crm_leads(name, company_name, email, phone)").eq("id", id).single(),
    supabase.from("crm_notes").select("*, users(full_name)").eq("opportunity_id", id).order("created_at", { ascending: false }),
    supabase.from("crm_proposals").select("id, proposal_number, status, monthly_fee, created_at").eq("opportunity_id", id).order("created_at", { ascending: false }),
  ]);

  if (!opp) notFound();

  const lead = opp.crm_leads as unknown as { name: string; company_name: string | null; email: string; phone: string | null } | null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <Link href="/admin/crm/pipeline" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Voltar ao Pipeline
        </Link>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">{opp.title}</h1>
        <p className="text-sm text-slate-400 mt-0.5">{STAGE_LABELS[opp.stage as CrmOpportunityStage]}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          {/* Info cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {opp.estimated_value && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-[#10B981]" /><span className="text-xs text-slate-400">Valor estimado</span></div>
                <p className="text-lg font-bold text-[#10B981]">{formatCurrency(opp.estimated_value)}</p>
              </div>
            )}
            {opp.probability != null && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <p className="text-xs text-slate-400 mb-1">Probabilidade</p>
                <p className="text-lg font-bold text-[#0F3D5E]">{opp.probability}%</p>
              </div>
            )}
            {opp.expected_close_date && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-1"><Calendar className="w-4 h-4 text-amber-500" /><span className="text-xs text-slate-400">Previsão de fechamento</span></div>
                <p className="text-sm font-semibold text-[#0F3D5E]">{formatDate(opp.expected_close_date)}</p>
              </div>
            )}
          </div>

          {/* Lead info */}
          {lead && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="text-sm font-heading font-semibold text-[#0F3D5E] mb-3">Lead Vinculado</h2>
              <p className="font-medium text-[#0F3D5E]">{lead.name}</p>
              {lead.company_name && <p className="text-sm text-slate-500">{lead.company_name}</p>}
              <p className="text-sm text-slate-400">{lead.email}</p>
              {lead.phone && <p className="text-sm text-slate-400">{lead.phone}</p>}
            </div>
          )}

          {/* Proposals */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-heading font-semibold text-[#0F3D5E]">Propostas</h2>
              <Link href={`/admin/crm/proposals/new?opportunity_id=${id}`} className="inline-flex items-center gap-1 text-xs text-[#2563EB] hover:underline">
                <Plus className="w-3.5 h-3.5" /> Nova proposta
              </Link>
            </div>
            {proposals?.length ? (
              <div className="space-y-2">
                {proposals.map((p) => (
                  <Link key={p.id} href={`/admin/crm/proposals/${p.id}`} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-[#2563EB]" />
                      <span className="text-sm font-medium text-[#0F3D5E]">#{p.proposal_number}</span>
                    </div>
                    <span className="text-sm text-[#10B981] font-semibold">{formatCurrency(p.monthly_fee)}/mês</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-3">Nenhuma proposta ainda.</p>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-heading font-semibold text-[#0F3D5E] mb-4">Notas</h2>
            {notes?.length ? (
              <div className="space-y-3">
                {notes.map((n) => (
                  <div key={n.id} className="border-l-2 border-[#2563EB]/20 pl-3">
                    <p className="text-sm text-slate-600">{n.content}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{(n.users as unknown as { full_name: string } | null)?.full_name ?? "—"} · {formatDate(n.created_at)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-3">Nenhuma nota ainda.</p>
            )}
          </div>
        </div>

        <OpportunityActions id={id} currentStage={opp.stage as CrmOpportunityStage} authorId={profile?.id ?? ""} />
      </div>
    </div>
  );
}
