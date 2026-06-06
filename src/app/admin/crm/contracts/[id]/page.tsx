import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft, DollarSign, Calendar } from "lucide-react";
import type { CrmContractStatus } from "@/types/database";
import ContractStatusBadge from "@/components/crm/ContractStatusBadge";
import ContractActions from "./ContractActions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}
function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: contract } = await supabase
    .from("crm_contracts")
    .select("*, companies(company_name, responsible_person, email, phone, cnpj)")
    .eq("id", id)
    .single();

  if (!contract) notFound();

  const company = contract.companies as unknown as { company_name: string; responsible_person: string | null; email: string | null; phone: string | null; cnpj: string | null } | null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <Link href="/admin/crm/contracts" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Voltar para Contratos
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Contrato #{contract.contract_number}</h1>
          <ContractStatusBadge status={contract.status as CrmContractStatus} />
        </div>
        <p className="text-sm text-slate-400 mt-0.5">Criado em {formatDate(contract.created_at)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-[#10B981]" /><span className="text-xs text-slate-400">Mensalidade</span></div>
              <p className="text-2xl font-bold text-[#10B981]">{formatCurrency(contract.monthly_fee)}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-1"><Calendar className="w-4 h-4 text-slate-400" /><span className="text-xs text-slate-400">Vigência</span></div>
              <p className="text-sm font-semibold text-[#0F3D5E]">
                {contract.start_date ? formatDate(contract.start_date) : "—"} →{" "}
                {contract.end_date ? formatDate(contract.end_date) : "Indeterminado"}
              </p>
            </div>
          </div>

          {company && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="text-sm font-heading font-semibold text-[#0F3D5E] mb-3">Empresa Contratante</h2>
              <p className="font-medium text-[#0F3D5E]">{company.company_name}</p>
              {company.cnpj && <p className="text-sm text-slate-500">CNPJ: {company.cnpj}</p>}
              {company.responsible_person && <p className="text-sm text-slate-500">{company.responsible_person}</p>}
              {company.email && <p className="text-sm text-slate-400">{company.email}</p>}
              {company.phone && <p className="text-sm text-slate-400">{company.phone}</p>}
            </div>
          )}
        </div>

        <ContractActions id={id} currentStatus={contract.status as CrmContractStatus} />
      </div>
    </div>
  );
}
