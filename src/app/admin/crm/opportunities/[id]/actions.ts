"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CrmOpportunityStage } from "@/types/database";

export async function updateOpportunityStage(id: string, stage: CrmOpportunityStage) {
  const supabase = await createClient();
  await supabase.from("crm_opportunities").update({ stage, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath(`/admin/crm/opportunities/${id}`);
  revalidatePath("/admin/crm/pipeline");
}

export async function addOpportunityNote(id: string, content: string, authorId: string) {
  const supabase = await createClient();
  await supabase.from("crm_notes").insert({ opportunity_id: id, content, author_id: authorId });
  revalidatePath(`/admin/crm/opportunities/${id}`);
}
