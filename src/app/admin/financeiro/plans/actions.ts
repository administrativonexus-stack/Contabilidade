"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { PlanStatus } from "@/types/database";

export async function createPlan(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const name = formData.get("name") as string;
  const monthly_price = Number(formData.get("monthly_price"));
  const setup_fee = Number(formData.get("setup_fee") || 0);
  const max_users = Number(formData.get("max_users") || 5);
  const description = (formData.get("description") as string) || null;
  const featuresRaw = (formData.get("features") as string) || "";
  const features = featuresRaw ? featuresRaw.split("\n").map((f) => f.trim()).filter(Boolean) : [];

  const { error } = await supabase.from("plans").insert({
    name,
    description,
    monthly_price,
    setup_fee,
    max_users,
    features: JSON.stringify(features),
    status: "active",
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/financeiro/plans");
  redirect("/admin/financeiro/plans");
}

export async function updatePlanStatus(planId: string, status: PlanStatus) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("plans")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", planId);
  if (error) return { error: error.message };
  revalidatePath("/admin/financeiro/plans");
  revalidatePath(`/admin/financeiro/plans/${planId}`);
}
