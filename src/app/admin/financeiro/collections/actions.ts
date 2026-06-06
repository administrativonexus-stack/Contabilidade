"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CollectionStatus } from "@/types/database";

export async function updateCollectionStatus(collectionId: string, status: CollectionStatus, notes?: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("collections").update({
    status,
    notes: notes || null,
    resolved_at: status === "resolved" ? new Date().toISOString() : undefined,
    updated_at: new Date().toISOString(),
  }).eq("id", collectionId);
  if (error) return { error: error.message };
  revalidatePath("/admin/financeiro/collections");
  revalidatePath(`/admin/financeiro/collections/${collectionId}`);
}
