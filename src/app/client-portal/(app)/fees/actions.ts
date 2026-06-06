"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { FinPaymentMethod } from "@/types/database";

export async function confirmInvoicePayment(invoiceId: string, method: FinPaymentMethod) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("invoices")
    .update({
      status: "paid",
      payment_method: method,
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", invoiceId);

  if (error) return { error: "Erro ao confirmar pagamento" };
  revalidatePath("/client-portal/fees");
  return { success: true };
}
