import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft, DollarSign, Calendar, FileCheck } from "lucide-react";
import type { CrmProposalStatus } from "@/types/database";
import ProposalStatusBadge from "@/components/crm/ProposalStatusBadge";
import ProposalStatusForm from "./ProposalStatusForm";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}
function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

export default async function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: proposal } = await supabase
    .from("crm_proposals")
    .select("*, companies(company_name, responsible_person, email, phone)")
    .eq("id", id)
    .single();

  if (!proposal) notFound();

  const company = proposal.companies as unknown as { company_name: string; responsible_person: string | null; email: string | null; phone: string | null } | null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <Link href="/admin/crm/proposals" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Voltar para Propostas
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Proposta #{proposal.proposal_number}</h1>
          <ProposalStatusBadge status={proposal.status as CrmProposalStatus} />
        </div>
        <p className="text-sm text-slate-400 mt-0.5">Criada em {formatDate(proposal.created_at)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          {/* Values */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-[#10B981]" /><span className="text-xs text-slate-400">Mensalidade</span></div>
              <p className="text-2xl font-bold text-[#10B981]">{formatCurrency(proposal.monthly_fee)}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-slate-400" /><span className="text-xs text-slate-400">Implantação</span></div>
              <p className="text-2xl font-bold text-[#0F3D5E]">{formatCurrency(proposal.setup_fee)}</p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-heading font-semibold text-[#0F3D5E] mb-4">Detalhes</h2>
            <div className="space-y-3">
              {company && (
                <div className="flex items-start gap-3">
                  <FileCheck className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Empresa</p>
                    <p className="text-sm font-medium text-[#0F3D5E]">{company.company_name}</p>
                    {company.responsible_person && <p className="text-xs text-slate-500">{company.responsible_person}</p>}
                  </div>
                </div>
              )}
              {proposal.plan && (
                <div>
                  <p className="text-xs text-slate-400">Plano</p>
                  <p className="text-sm font-medium text-[#0F3D5E]">{proposal.plan}</p>
                </div>
              )}
              {proposal.validity_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <div>
                    <p className="text-xs text-slate-400">Válida até</p>
                    <p className="text-sm font-medium text-[#0F3D5E]">{formatDate(proposal.validity_date)}</p>
                  </div>
                </div>
              )}
              {proposal.description && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-2">Serviços incluídos</p>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{proposal.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <ProposalStatusForm id={id} currentStatus={proposal.status as CrmProposalStatus} />
      </div>
    </div>
  );
}
