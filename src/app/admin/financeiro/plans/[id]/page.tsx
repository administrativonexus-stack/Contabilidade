import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Layers } from "lucide-react";
import type { PlanStatus } from "@/types/database";
import PlanActions from "./PlanActions";

const STATUS_CONFIG: Record<PlanStatus, { label: string; className: string }> = {
  active:   { label: "Ativo",     className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  inactive: { label: "Inativo",   className: "bg-amber-100 text-amber-700 border border-amber-200" },
  archived: { label: "Arquivado", className: "bg-slate-100 text-slate-400 border border-slate-200" },
};

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-400 font-medium uppercase tracking-wide w-28 flex-shrink-0">{label}</span>
      <span className="text-sm text-[#0F3D5E] font-medium text-right">{value}</span>
    </div>
  );
}

export default async function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: plan } = await supabase.from("plans").select("*").eq("id", id).single();
  if (!plan) notFound();

  const { data: subs } = await supabase
    .from("subscriptions")
    .select("id, status, companies(company_name)")
    .eq("plan_id", id)
    .in("status", ["active", "trial"]);

  const cfg = STATUS_CONFIG[plan.status as PlanStatus] ?? STATUS_CONFIG.active;
  const features: string[] = Array.isArray(plan.features)
    ? (plan.features as string[])
    : typeof plan.features === "string"
    ? JSON.parse(plan.features as string)
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/admin/financeiro/plans" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">{plan.name}</h1>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.className}`}>{cfg.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-[#0F3D5E] mb-3">Informações do Plano</h2>
            <InfoRow label="Mensalidade" value={<span className="text-[#10B981] font-bold">{formatCurrency(plan.monthly_price)}</span>} />
            <InfoRow label="Setup" value={formatCurrency(plan.setup_fee)} />
            <InfoRow label="Máx. Usuários" value={plan.max_users ?? "—"} />
            {plan.description && <InfoRow label="Descrição" value={plan.description} />}
          </div>

          {features.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-[#0F3D5E] mb-3">Serviços Incluídos</h2>
              <ul className="space-y-1.5">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-[#0F3D5E] mb-3">Ações</h2>
            <PlanActions planId={plan.id} currentStatus={plan.status as PlanStatus} />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-[#0F3D5E] mb-3">Assinantes Ativos ({subs?.length ?? 0})</h2>
            {subs?.length ? (
              <div className="space-y-2">
                {subs.map((s) => (
                  <p key={s.id} className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-slate-300 flex-shrink-0" />
                    {(s.companies as unknown as { company_name: string } | null)?.company_name ?? "—"}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Nenhum assinante ativo</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
