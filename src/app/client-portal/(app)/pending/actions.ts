"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function completePendingAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("pending_actions")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: "Erro ao atualizar ação" };

  revalidatePath("/client-portal/pending");
  return { success: true };
}
