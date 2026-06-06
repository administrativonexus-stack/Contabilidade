import { createClient } from "@/lib/supabase/server";
import { Users } from "lucide-react";
import type { UserRole } from "@/types/database";

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  staff: "Staff",
  client: "Cliente",
};

const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: "bg-purple-50 text-purple-700",
  admin: "bg-[#0F3D5E]/10 text-[#0F3D5E]",
  staff: "bg-blue-50 text-blue-700",
  client: "bg-slate-100 text-slate-600",
};

function formatDate(iso: string | null) {
  if (!iso) return "Nunca";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Usuários</h1>
        <p className="text-sm text-slate-400 mt-0.5">{users?.length ?? 0} usuário(s) cadastrado(s)</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_160px_80px_80px_100px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span>Usuário</span><span>E-mail</span><span>Role</span><span>Status</span><span>Último acesso</span>
        </div>
        <div className="divide-y divide-slate-100">
          {users?.length ? users.map((u) => (
            <div key={u.id} className="grid grid-cols-1 sm:grid-cols-[1fr_160px_80px_80px_100px] gap-2 sm:gap-4 px-5 py-4 items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F3D5E] to-[#2563EB] flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-white">
                    {u.full_name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
                  </span>
                </div>
                <p className="text-sm font-medium text-[#0F3D5E] truncate">{u.full_name}</p>
              </div>
              <span className="text-xs text-slate-500 truncate">{u.email}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold w-fit ${ROLE_COLORS[u.role as UserRole]}`}>
                {ROLE_LABELS[u.role as UserRole]}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold w-fit ${u.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {u.is_active ? "Ativo" : "Inativo"}
              </span>
              <span className="text-xs text-slate-400">{formatDate(u.last_login_at)}</span>
            </div>
          )) : (
            <div className="px-5 py-12 text-center">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Nenhum usuário cadastrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
