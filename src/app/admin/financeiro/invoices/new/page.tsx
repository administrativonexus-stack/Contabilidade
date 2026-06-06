import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import NewInvoiceForm from "./NewInvoiceForm";

export default async function NewInvoicePage() {
  const supabase = await createClient();
  const [{ data: companies }, { data: subscriptions }] = await Promise.all([
    supabase.from("companies").select("id, company_name").eq("is_active", true).order("company_name"),
    supabase.from("subscriptions").select("id, company_id, monthly_amount, plans(name)").in("status", ["active", "trial"]),
  ]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/admin/financeiro/invoices" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Nova Fatura</h1>
      </div>
      <NewInvoiceForm
        companies={companies ?? []}
        subscriptions={(subscriptions ?? []) as unknown as { id: string; company_id: string; monthly_amount: number; plans: { name: string } | null }[]}
      />
    </div>
  );
}
