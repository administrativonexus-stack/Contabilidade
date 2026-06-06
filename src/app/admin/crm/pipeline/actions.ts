"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CrmOpportunityStage } from "@/types/database";

export async function moveOpportunity(id: string, stage: CrmOpportunityStage) {
  const supabase = await createClient();
  await supabase.from("crm_opportunities").update({ stage, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/crm/pipeline");
}
