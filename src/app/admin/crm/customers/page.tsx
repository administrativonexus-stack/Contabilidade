import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Building2, Award } from "lucide-react";
import type { CrmHealthStatus } from "@/types/database";

const HEALTH_CONFIG: Record<CrmHealthStatus, { label: string; className: string; dot: string }> = {
  excellent: { label: "Excelente", className: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  healthy: { label: "Saudável", className: "bg-blue-100 text-blue-700 border border-blue-200", dot: "bg-blue-500" },
  attention: { label: "Atenção", className: "bg-amber-100 text-amber-700 border border-amber-200", dot: "bg-amber-500" },
  critical: { label: "Crítico", className: "bg-rose-100 text-rose-600 border border-rose-200", dot: "bg-rose-500" },
};

function calcHealth(data: { pendingActions: number; openTickets: number; docs: number }): CrmHealthStatus {
  const score = data.pendingActions * 2 + data.openTickets;
  if (score === 0 && data.docs > 0) return "excellent";
  if (score <= 1) return "healthy";
  if (score <= 3) return "attention";
  return "critical";
}

export default async function CrmCustomersPage() {
  const supabase = await createClient();

  const { data: companies } = await supabase
    .from("companies")
    .select("id, company_name, responsible_person, email, phone, created_at")
    .eq("is_active", true)
    .order("company_name");

  if (!companies?.length) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Clientes</h1>
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-400">Nenhum cliente ativo</p>
        </div>
      </div>
    );
  }

  const healthData = await Promise.all(companies.map(async (c) => {
    const [pendingRes, ticketsRes, docsRes] = await Promise.all([
      supabase.from("pending_actions").select("id", { count: "exact", head: true }).eq("company_id", c.id).eq("status", "pending"),
      supabase.from("tickets").select("id", { count: "exact", head: true }).eq("company_id", c.id).eq("status", "open"),
      supabase.from("documents").select("id", { count: "exact", head: true }).eq("company_id", c.id).is("deleted_at", null),
    ]);
    const health = calcHealth({ pendingActions: pendingRes.count ?? 0, openTickets: ticketsRes.count ?? 0, docs: docsRes.count ?? 0 });
    return { ...c, health, docsCount: docsRes.count ?? 0, pendingCount: pendingRes.count ?? 0 };
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Clientes</h1>
          <p className="text-sm text-slate-400 mt-0.5">{companies.length} cliente(s) ativo(s)</p>
        </div>
      </div>

      {/* Health summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(["excellent", "healthy", "attention", "critical"] as CrmHealthStatus[]).map((h) => {
          const count = healthData.filter((c) => c.health === h).length;
          const cfg = HEALTH_CONFIG[h];
          return (
            <div key={h} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${cfg.dot}`} />
              <div>
                <p className="text-lg font-bold text-[#0F3D5E]">{count}</p>
                <p className="text-xs text-slate-400">{cfg.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="hidden lg:grid grid-cols-[1fr_160px_100px_100px_120px_48px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span>Empresa</span><span>Responsável</span><span>Documentos</span><span>Pendências</span><span>Saúde</span><span></span>
        </div>
        <div className="divide-y divide-slate-100">
          {healthData.map((c) => {
            const cfg = HEALTH_CONFIG[c.health];
            return (
              <div key={c.id} className="grid grid-cols-1 lg:grid-cols-[1fr_160px_100px_100px_120px_48px] gap-2 lg:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-[#0F3D5E]">{c.company_name}</p>
                  {c.email && <p className="text-xs text-slate-400">{c.email}</p>}
                </div>
                <span className="text-xs text-slate-500 truncate">{c.responsible_person ?? "—"}</span>
                <span className="text-sm font-semibold text-[#0F3D5E]">{c.docsCount}</span>
                <span className={`text-sm font-semibold ${c.pendingCount > 0 ? "text-rose-600" : "text-slate-400"}`}>{c.pendingCount}</span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.className}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cfg.label}
                </span>
                <Link href={`/admin/companies/${c.id}`} className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#0F3D5E] text-white text-xs hover:bg-[#0d3352] transition-colors flex-shrink-0">→</Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
