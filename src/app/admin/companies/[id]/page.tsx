import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Building2, FileText, MessageSquare } from "lucide-react";

function formatCnpj(cnpj: string | null) {
  if (!cnpj) return "—";
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: company } = await supabase.from("companies").select("*").eq("id", id).single();
  if (!company) notFound();

  const [{ count: docCount }, { count: ticketCount }, { data: users }] = await Promise.all([
    supabase.from("documents").select("id", { count: "exact", head: true }).eq("company_id", id).is("deleted_at", null),
    supabase.from("tickets").select("id", { count: "exact", head: true }).eq("company_id", id),
    supabase.from("user_companies").select("users(full_name, email, role)").eq("company_id", id),
  ]);

  const fields = [
    { label: "Razão Social", value: company.company_name },
    { label: "Nome Fantasia", value: company.trade_name ?? "—" },
    { label: "CNPJ", value: formatCnpj(company.cnpj) },
    { label: "E-mail", value: company.email ?? "—" },
    { label: "Telefone", value: company.phone ?? "—" },
    { label: "Endereço", value: company.address ?? "—" },
    { label: "Cidade", value: company.city ?? "—" },
    { label: "Estado", value: company.state ?? "—" },
    { label: "CEP", value: company.zip_code ?? "—" },
    { label: "Responsável", value: company.responsible_person ?? "—" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/admin/companies" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" /> Empresas
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0F3D5E]/8 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-[#0F3D5E]" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">{company.company_name}</h1>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${company.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
              {company.is_active ? "Ativo" : "Inativo"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#2563EB]" />
          <div>
            <p className="text-xl font-heading font-bold text-[#0F3D5E]">{docCount ?? 0}</p>
            <p className="text-xs text-slate-400">Documentos</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-amber-500" />
          <div>
            <p className="text-xl font-heading font-bold text-[#0F3D5E]">{ticketCount ?? 0}</p>
            <p className="text-xs text-slate-400">Solicitações</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Dados Cadastrais</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
              <p className="text-sm font-medium text-[#0F3D5E]">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {users && users.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Usuários vinculados</p>
          <div className="space-y-3">
            {users.map((uc, i) => {
              const u = uc.users as { full_name: string; email: string; role: string } | null;
              if (!u) return null;
              return (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0F3D5E]">{u.full_name}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                  <span className="text-xs text-slate-500 capitalize">{u.role}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
