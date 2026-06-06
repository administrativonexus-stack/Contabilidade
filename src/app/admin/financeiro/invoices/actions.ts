"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { InvoiceStatus, FinPaymentMethod, BillingCycle } from "@/types/database";

function nextRenewalDate(from: string, cycle: BillingCycle): string {
  const d = new Date(from);
  switch (cycle) {
    case "monthly":    d.setMonth(d.getMonth() + 1); break;
    case "quarterly":  d.setMonth(d.getMonth() + 3); break;
    case "semiannual": d.setMonth(d.getMonth() + 6); break;
    case "annual":     d.setFullYear(d.getFullYear() + 1); break;
  }
  return d.toISOString().split("T")[0];
}

export async function createInvoice(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };
  const { data: profile } = await supabase.from("users").select("id").eq("auth_user_id", user.id).single();

  const { error } = await supabase.from("invoices").insert({
    company_id: formData.get("company_id") as string,
    subscription_id: (formData.get("subscription_id") as string) || null,
    description: (formData.get("description") as string) || null,
    amount: Number(formData.get("amount")),
    due_date: formData.get("due_date") as string,
    issue_date: (formData.get("issue_date") as string) || new Date().toISOString().split("T")[0],
    boleto_url: (formData.get("boleto_url") as string) || null,
    pix_code: (formData.get("pix_code") as string) || null,
    notes: (formData.get("notes") as string) || null,
    status: "pending",
    created_by: profile?.id ?? null,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/financeiro/invoices");
  redirect("/admin/financeiro/invoices");
}

export async function updateInvoiceStatus(
  invoiceId: string,
  status: InvoiceStatus,
  extra?: { payment_method?: FinPaymentMethod; external_payment_id?: string; receipt_url?: string; paid_at?: string }
) {
  const supabase = await createClient();
  if (status === "overdue") {
    const company_id_res = await supabase.from("invoices").select("company_id").eq("id", invoiceId).single();
    if (company_id_res.data) {
      await supabase.from("collections").upsert({
        company_id: company_id_res.data.company_id,
        invoice_id: invoiceId,
        status: "current" as const,
        days_overdue: 0,
        updated_at: new Date().toISOString(),
      }, { onConflict: "invoice_id" });
    }
  }
  const { error } = await supabase.from("invoices").update({
    status,
    updated_at: new Date().toISOString(),
    paid_at: status === "paid" ? (extra?.paid_at || new Date().toISOString()) : undefined,
    payment_method: status === "paid" ? (extra?.payment_method ?? null) : undefined,
    external_payment_id: status === "paid" ? (extra?.external_payment_id ?? null) : undefined,
    receipt_url: status === "paid" ? (extra?.receipt_url ?? null) : undefined,
  }).eq("id", invoiceId);
  if (error) return { error: error.message };
  revalidatePath("/admin/financeiro/invoices");
  revalidatePath(`/admin/financeiro/invoices/${invoiceId}`);
}

export async function generateMonthlyInvoices() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: subs } = await supabase
    .from("subscriptions")
    .select("id, company_id, monthly_amount, billing_cycle, renewal_date")
    .eq("status", "active")
    .lte("renewal_date", today);

  if (!subs?.length) return { created: 0 };

  const due_date = new Date();
  due_date.setDate(due_date.getDate() + 5);
  const dueDateStr = due_date.toISOString().split("T")[0];

  let created = 0;
  for (const sub of subs) {
    const { error } = await supabase.from("invoices").insert({
      company_id: sub.company_id,
      subscription_id: sub.id,
      amount: sub.monthly_amount,
      due_date: dueDateStr,
      issue_date: today,
      description: `Mensalidade — ${new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}`,
      status: "pending",
    });
    if (!error) {
      created++;
      if (sub.renewal_date) {
        await supabase.from("subscriptions").update({
          renewal_date: nextRenewalDate(sub.renewal_date, sub.billing_cycle as BillingCycle),
          updated_at: new Date().toISOString(),
        }).eq("id", sub.id);
      }
    }
  }

  revalidatePath("/admin/financeiro/invoices");
  revalidatePath("/admin/financeiro/subscriptions");
  return { created };
}
