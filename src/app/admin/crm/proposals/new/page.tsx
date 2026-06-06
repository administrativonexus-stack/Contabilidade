import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import NewProposalForm from "./NewProposalForm";

export default async function NewProposalPage({ searchParams }: { searchParams: Promise<{ opportunity_id?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();

  const [{ data: companies }, { data: opportunities }] = await Promise.all([
    supabase.from("companies").select("id, company_name").eq("is_active", true).order("company_name"),
    supabase.from("crm_opportunities").select("id, title").not("stage", "in", '("won","lost")').order("created_at", { ascending: false }),
  ]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/admin/crm/proposals" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Nova Proposta</h1>
      </div>
      <NewProposalForm companies={companies ?? []} opportunities={opportunities ?? []} defaultOpportunityId={params.opportunity_id} />
    </div>
  );
}
