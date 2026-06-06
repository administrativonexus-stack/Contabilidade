import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Building2, Plus } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function formatCnpj(cnpj: string | null) {
  if (!cnpj) return "—";
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

export default async function AdminCompaniesPage() {
  const supabase = await createClient();
  const { data: companies } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Empresas</h1>
          <p className="text-sm text-slate-400 mt-0.5">{companies?.length ?? 0} empresa(s) cadastrada(s)</p>
        </div>
        <Link href="/admin/companies/new" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Nova empresa
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_140px_120px_80px_80px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span>Empresa</span><span>CNPJ</span><span>Cidade / UF</span><span>Status</span><span>Cadastro</span>
        </div>
        <div className="divide-y divide-slate-100">
          {companies?.length ? companies.map((c) => (
            <Link key={c.id} href={`/admin/companies/${c.id}`} className="grid grid-cols-1 sm:grid-cols-[1fr_140px_120px_80px_80px] gap-2 sm:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0F3D5E]/8 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-[#0F3D5E]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#0F3D5E] truncate">{c.company_name}</p>
                  {c.trade_name && <p className="text-xs text-slate-400 truncate">{c.trade_name}</p>}
                </div>
              </div>
              <span className="text-xs text-slate-500 font-mono">{formatCnpj(c.cnpj)}</span>
              <span className="text-xs text-slate-500">{c.city && c.state ? `${c.city} / ${c.state}` : "—"}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${c.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {c.is_active ? "Ativo" : "Inativo"}
              </span>
              <span className="text-xs text-slate-400">{formatDate(c.created_at)}</span>
            </Link>
          )) : (
            <div className="px-5 py-12 text-center">
              <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Nenhuma empresa cadastrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
