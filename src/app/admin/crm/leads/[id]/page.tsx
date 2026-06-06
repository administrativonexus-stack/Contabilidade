import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft, Mail, Phone, Building2, Globe, DollarSign, Calendar } from "lucide-react";
import type { CrmLeadStatus } from "@/types/database";
import LeadStatusBadge from "@/components/crm/LeadStatusBadge";
import LeadActions from "./LeadActions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client-portal/login");

  const { data: profile } = await supabase.from("users").select("id").eq("auth_user_id", user.id).single();

  const [{ data: lead }, { data: notes }, { data: opportunities }] = await Promise.all([
    supabase.from("crm_leads").select("*").eq("id", id).single(),
    supabase.from("crm_notes").select("*, users(full_name)").eq("lead_id", id).order("created_at", { ascending: false }),
    supabase.from("crm_opportunities").select("id, title, stage, estimated_value").eq("lead_id", id),
  ]);

  if (!lead) notFound();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin/crm/leads" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-3">
            <ChevronLeft className="w-4 h-4" /> Voltar para Leads
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">{lead.name}</h1>
            <LeadStatusBadge status={lead.status as CrmLeadStatus} />
          </div>
          <p className="text-sm text-slate-400 mt-0.5">Criado em {formatDate(lead.created_at)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Main content */}
        <div className="space-y-6">
          {/* Lead info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-heading font-semibold text-[#0F3D5E] mb-4">Informações do Lead</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={Mail} label="Email" value={lead.email} />
              <InfoRow icon={Phone} label="Telefone" value={lead.phone} />
              <InfoRow icon={Building2} label="Empresa" value={lead.company_name} />
              <InfoRow icon={Building2} label="CNPJ" value={lead.cnpj} />
              <InfoRow icon={Globe} label="Segmento" value={lead.industry} />
              <InfoRow icon={Globe} label="Origem" value={lead.source} />
              {lead.estimated_revenue && (
                <InfoRow icon={DollarSign} label="Faturamento estimado" value={formatCurrency(lead.estimated_revenue) + "/mês"} />
              )}
            </div>
            {lead.notes && (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-medium text-slate-500 mb-1">Observações</p>
                <p className="text-sm text-slate-600">{lead.notes}</p>
              </div>
            )}
          </div>

          {/* Opportunities */}
          {opportunities && opportunities.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="text-sm font-heading font-semibold text-[#0F3D5E] mb-3">Oportunidades</h2>
              <div className="space-y-2">
                {opportunities.map((opp) => (
                  <Link key={opp.id} href={`/admin/crm/opportunities/${opp.id}`} className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 hover:bg-blue-50 transition-colors border border-blue-100">
                    <span className="text-sm font-medium text-[#0F3D5E]">{opp.title}</span>
                    {opp.estimated_value && <span className="text-sm text-[#10B981] font-semibold">{formatCurrency(opp.estimated_value)}</span>}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-heading font-semibold text-[#0F3D5E] mb-4">Notas & Histórico</h2>
            {notes?.length ? (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="border-l-2 border-[#2563EB]/20 pl-3">
                    <p className="text-sm text-slate-600">{note.content}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {(note.users as unknown as { full_name: string } | null)?.full_name ?? "—"} · <span className="flex items-center gap-0.5 inline-flex"><Calendar className="w-3 h-3" />{formatDate(note.created_at)}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">Nenhuma nota ainda.</p>
            )}
          </div>
        </div>

        {/* Actions sidebar */}
        <LeadActions
          leadId={id}
          leadName={lead.name}
          companyName={lead.company_name}
          currentStatus={lead.status as CrmLeadStatus}
          authorId={profile?.id ?? ""}
        />
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm text-[#1E293B] font-medium">{value}</p>
      </div>
    </div>
  );
}
