import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { UserPlus, Phone, Mail } from "lucide-react";
import type { CrmLeadStatus } from "@/types/database";
import LeadStatusBadge from "@/components/crm/LeadStatusBadge";

const STATUSES: { value: CrmLeadStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "new", label: "Novos" },
  { value: "contacted", label: "Contactados" },
  { value: "qualified", label: "Qualificados" },
  { value: "proposal_sent", label: "Proposta Enviada" },
  { value: "negotiation", label: "Negociação" },
  { value: "won", label: "Ganhos" },
  { value: "lost", label: "Perdidos" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function CrmLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status || "all";

  const supabase = await createClient();
  let query = supabase.from("crm_leads").select("*").order("created_at", { ascending: false });
  if (statusFilter !== "all") query = query.eq("status", statusFilter as CrmLeadStatus);

  const { data: leads } = await query;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Leads</h1>
          <p className="text-sm text-slate-400 mt-0.5">{leads?.length ?? 0} lead(s)</p>
        </div>
        <Link href="/admin/crm/leads/new" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          <UserPlus className="w-4 h-4" /> Novo Lead
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit flex-wrap">
        {STATUSES.map((s) => (
          <Link
            key={s.value}
            href={s.value === "all" ? "/admin/crm/leads" : `/admin/crm/leads?status=${s.value}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${statusFilter === s.value ? "bg-white text-[#0F3D5E] shadow-sm" : "text-slate-500 hover:text-[#0F3D5E]"}`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {leads?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1fr_160px_120px_130px_110px_48px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Nome</span><span>Empresa</span><span>Contato</span><span>Fonte</span><span>Status</span><span></span>
          </div>
          <div className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <div key={lead.id} className="grid grid-cols-1 lg:grid-cols-[1fr_160px_120px_130px_110px_48px] gap-2 lg:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-[#0F3D5E]">{lead.name}</p>
                  <p className="text-xs text-slate-400">{formatDate(lead.created_at)}</p>
                </div>
                <span className="text-xs text-slate-500 truncate">{lead.company_name ?? "—"}</span>
                <div className="flex flex-col gap-0.5">
                  {lead.email && <span className="text-xs text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>}
                  {lead.phone && <span className="text-xs text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>}
                </div>
                <span className="text-xs text-slate-500">{lead.source ?? "—"}</span>
                <LeadStatusBadge status={lead.status as CrmLeadStatus} />
                <Link href={`/admin/crm/leads/${lead.id}`} className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#0F3D5E] text-white text-xs font-semibold hover:bg-[#0d3352] transition-colors flex-shrink-0">→</Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <UserPlus className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400">Nenhum lead encontrado</p>
          <Link href="/admin/crm/leads/new" className="inline-flex items-center gap-1 mt-3 text-sm text-[#2563EB] hover:underline">
            <UserPlus className="w-3.5 h-3.5" /> Criar primeiro lead
          </Link>
        </div>
      )}
    </div>
  );
}
