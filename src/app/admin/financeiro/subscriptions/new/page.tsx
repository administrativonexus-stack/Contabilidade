import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import NewSubscriptionForm from "./NewSubscriptionForm";

export default async function NewSubscriptionPage() {
  const supabase = await createClient();
  const [{ data: companies }, { data: plans }] = await Promise.all([
    supabase.from("companies").select("id, company_name").eq("is_active", true).order("company_name"),
    supabase.from("plans").select("id, name, monthly_price, setup_fee").eq("status", "active").order("monthly_price"),
  ]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/admin/financeiro/subscriptions" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Nova Assinatura</h1>
      </div>
      <NewSubscriptionForm companies={companies ?? []} plans={plans ?? []} />
    </div>
  );
}
