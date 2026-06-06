"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CrmLeadStatus } from "@/types/database";

export async function updateLeadStatus(leadId: string, status: CrmLeadStatus) {
  const supabase = await createClient();
  await supabase.from("crm_leads").update({ status, updated_at: new Date().toISOString() }).eq("id", leadId);
  revalidatePath(`/admin/crm/leads/${leadId}`);
  revalidatePath("/admin/crm/leads");
}

export async function addLeadNote(leadId: string, content: string, authorId: string) {
  const supabase = await createClient();
  await supabase.from("crm_notes").insert({ lead_id: leadId, content, author_id: authorId });
  revalidatePath(`/admin/crm/leads/${leadId}`);
}

export async function convertToOpportunity(leadId: string, leadName: string, companyName: string | null) {
  const supabase = await createClient();
  const { data: opp, error } = await supabase
    .from("crm_opportunities")
    .insert({ title: `Oportunidade – ${companyName ?? leadName}`, lead_id: leadId, stage: "initial_contact" })
    .select("id")
    .single();

  if (error || !opp) return { error: error?.message ?? "Erro ao converter" };

  await supabase.from("crm_leads").update({ status: "qualified", updated_at: new Date().toISOString() }).eq("id", leadId);
  revalidatePath(`/admin/crm/leads/${leadId}`);
  revalidatePath("/admin/crm/leads");
  revalidatePath("/admin/crm/pipeline");
  return { opportunityId: opp.id };
}
