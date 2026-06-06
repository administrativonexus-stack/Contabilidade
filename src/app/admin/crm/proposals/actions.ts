"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CrmProposalStatus } from "@/types/database";

export async function updateProposalStatus(id: string, status: CrmProposalStatus) {
  const supabase = await createClient();
  await supabase.from("crm_proposals").update({ status, updated_at: new Date().toISOString() }).eq("id", id);

  if (status === "accepted") {
    const { data: proposal } = await supabase.from("crm_proposals").select("company_id, opportunity_id, monthly_fee, proposal_number").eq("id", id).single();
    if (proposal) {
      const contractNum = `CT-${Date.now().toString().slice(-6)}`;
      await supabase.from("crm_contracts").insert({
        contract_number: contractNum,
        company_id: proposal.company_id,
        proposal_id: id,
        monthly_fee: proposal.monthly_fee,
        status: "draft",
      });
    }
  }

  revalidatePath(`/admin/crm/proposals/${id}`);
  revalidatePath("/admin/crm/proposals");
}

export async function createProposal(formData: FormData) {
  const supabase = await createClient();
  const proposalNumber = `PR-${Date.now().toString().slice(-6)}`;

  const { data, error } = await supabase.from("crm_proposals").insert({
    proposal_number: proposalNumber,
    company_id: (formData.get("company_id") as string) || null,
    opportunity_id: (formData.get("opportunity_id") as string) || null,
    plan: (formData.get("plan") as string) || null,
    description: (formData.get("description") as string) || null,
    monthly_fee: Number(formData.get("monthly_fee")),
    setup_fee: Number(formData.get("setup_fee") || 0),
    validity_date: (formData.get("validity_date") as string) || null,
    status: "draft",
  }).select("id").single();

  if (error || !data) return { error: error?.message ?? "Erro ao criar proposta" };
  redirect(`/admin/crm/proposals/${data.id}`);
}
