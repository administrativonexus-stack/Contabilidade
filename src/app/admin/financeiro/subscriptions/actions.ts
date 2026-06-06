"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SubscriptionStatus, BillingCycle } from "@/types/database";

function nextRenewalDate(startDate: string, cycle: BillingCycle): string {
  const d = new Date(startDate);
  switch (cycle) {
    case "monthly":    d.setMonth(d.getMonth() + 1); break;
    case "quarterly":  d.setMonth(d.getMonth() + 3); break;
    case "semiannual": d.setMonth(d.getMonth() + 6); break;
    case "annual":     d.setFullYear(d.getFullYear() + 1); break;
  }
  return d.toISOString().split("T")[0];
}

export async function createSubscription(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };
  const { data: profile } = await supabase.from("users").select("id").eq("auth_user_id", user.id).single();

  const company_id = formData.get("company_id") as string;
  const plan_id = (formData.get("plan_id") as string) || null;
  const billing_cycle = formData.get("billing_cycle") as BillingCycle;
  const monthly_amount = Number(formData.get("monthly_amount"));
  const setup_fee = Number(formData.get("setup_fee") || 0);
  const start_date = (formData.get("start_date") as string) || new Date().toISOString().split("T")[0];
  const renewal_date = nextRenewalDate(start_date, billing_cycle);
  const notes = (formData.get("notes") as string) || null;

  const { error } = await supabase.from("subscriptions").insert({
    company_id, plan_id, billing_cycle, monthly_amount, setup_fee,
    start_date, renewal_date, notes, status: "active",
    created_by: profile?.id ?? null,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/financeiro/subscriptions");
  redirect("/admin/financeiro/subscriptions");
}

export async function updateSubscriptionStatus(subId: string, status: SubscriptionStatus) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("subscriptions")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", subId);
  if (error) return { error: error.message };
  revalidatePath("/admin/financeiro/subscriptions");
  revalidatePath(`/admin/financeiro/subscriptions/${subId}`);
}

export async function renewSubscription(subId: string, currentRenewal: string, cycle: BillingCycle) {
  const supabase = await createClient();
  const renewal_date = nextRenewalDate(currentRenewal, cycle);
  const { error } = await supabase
    .from("subscriptions")
    .update({ renewal_date, status: "active", updated_at: new Date().toISOString() })
    .eq("id", subId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/financeiro/subscriptions/${subId}`);
}
