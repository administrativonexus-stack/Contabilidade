"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CrmContractStatus } from "@/types/database";

export async function updateContractStatus(id: string, status: CrmContractStatus) {
  const supabase = await createClient();
  await supabase.from("crm_contracts").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath(`/admin/crm/contracts/${id}`);
  revalidatePath("/admin/crm/contracts");
}

export async function createContract(formData: FormData) {
  const supabase = await createClient();
  const contractNumber = `CT-${Date.now().toString().slice(-6)}`;

  const { data, error } = await supabase.from("crm_contracts").insert({
    contract_number: contractNumber,
    company_id: (formData.get("company_id") as string) || null,
    monthly_fee: Number(formData.get("monthly_fee")),
    start_date: (formData.get("start_date") as string) || null,
    end_date: (formData.get("end_date") as string) || null,
    status: "draft",
  }).select("id").single();

  if (error || !data) return { error: error?.message ?? "Erro ao criar contrato" };
  redirect(`/admin/crm/contracts/${data.id}`);
}
