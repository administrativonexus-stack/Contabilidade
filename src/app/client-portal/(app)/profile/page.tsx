import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";
import { Building2, User } from "lucide-react";

function formatCnpj(cnpj: string | null) {
  if (!cnpj) return "—";
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client-portal/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*, user_companies(company_id)")
    .eq("auth_user_id", user.id)
    .single();

  const companyId = (profile?.user_companies as { company_id: string }[] | null)?.[0]?.company_id;

  const { data: company } = companyId
    ? await supabase.from("companies").select("*").eq("id", companyId).single()
    : { data: null };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Perfil</h1>
        <p className="text-sm text-slate-400 mt-0.5">Gerencie as informações da sua empresa</p>
      </div>

      {/* Read-only company info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#0F3D5E]/8 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[#0F3D5E]" />
          </div>
          <div>
            <p className="text-sm font-heading font-semibold text-[#0F3D5E]">Dados da Empresa</p>
            <p className="text-xs text-slate-400">Informações cadastrais</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Razão Social</p>
            <p className="text-sm font-medium text-[#0F3D5E]">{company?.company_name ?? "—"}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">CNPJ</p>
            <p className="text-sm font-medium text-[#0F3D5E]">{formatCnpj(company?.cnpj ?? null)}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Cidade / Estado</p>
            <p className="text-sm font-medium text-[#0F3D5E]">
              {company?.city && company?.state ? `${company.city} / ${company.state}` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Editable fields */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/8 flex items-center justify-center">
            <User className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <p className="text-sm font-heading font-semibold text-[#0F3D5E]">Informações de Contato</p>
            <p className="text-xs text-slate-400">Você pode editar estes campos</p>
          </div>
        </div>
        <ProfileForm
          defaultValues={{
            email: profile?.email ?? "",
            phone: company?.phone ?? "",
            address: company?.address ?? "",
            responsible_person: company?.responsible_person ?? "",
          }}
        />
      </div>
    </div>
  );
}
