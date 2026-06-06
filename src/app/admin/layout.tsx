import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileMenu from "@/components/admin/AdminMobileMenu";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client-portal/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role, full_name")
    .eq("auth_user_id", user.id)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
    redirect("/client-portal/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />
      <div className="lg:ml-60 flex flex-col min-h-screen">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <AdminMobileMenu />
            <p className="text-sm font-semibold text-[#0F3D5E]">Painel Administrativo</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{profile.full_name}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0F3D5E]/10 text-[#0F3D5E]">
              {profile.role === "super_admin" ? "Super Admin" : "Admin"}
            </span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
