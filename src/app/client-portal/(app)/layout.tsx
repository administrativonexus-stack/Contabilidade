import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/portal/Sidebar";
import MobileNav from "@/components/portal/MobileNav";
import TopBar from "@/components/portal/TopBar";

export default async function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/client-portal/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (!profile) redirect("/client-portal/login");

  const { data: userCompany } = await supabase
    .from("user_companies")
    .select("company_id")
    .eq("user_id", profile.id)
    .single();

  const { data: company } = userCompany
    ? await supabase.from("companies").select("*").eq("id", userCompany.company_id).single()
    : { data: null };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      {/* Main area offset by sidebar on desktop */}
      <div className="lg:ml-60 flex flex-col min-h-screen">
        <TopBar user={profile} company={company} />
        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-6">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
