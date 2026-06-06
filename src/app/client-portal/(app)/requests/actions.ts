"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createTicket(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const { data: profile } = await supabase.from("users").select("id, user_companies(company_id)").eq("auth_user_id", user.id).single();
  const companyId = (profile?.user_companies as { company_id: string }[] | null)?.[0]?.company_id;
  if (!companyId || !profile) return { error: "Empresa não encontrada." };

  const subject = formData.get("subject") as string;
  const description = formData.get("description") as string;

  if (!subject?.trim() || !description?.trim()) {
    return { error: "Assunto e descrição são obrigatórios." };
  }

  const { data: ticket, error } = await supabase.from("tickets").insert({
    company_id: companyId,
    created_by: profile.id,
    subject: subject.trim(),
    description: description.trim(),
    status: "open",
  }).select().single();

  if (error || !ticket) return { error: "Erro ao criar solicitação. Tente novamente." };

  await supabase.from("audit_logs").insert({
    user_id: profile.id,
    action: "ticket.create",
    entity_type: "tickets",
    entity_id: ticket.id,
    metadata: { subject },
  });

  revalidatePath("/client-portal/requests");
  redirect(`/client-portal/requests/${ticket.id}`);
}

export async function sendMessage(ticketId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const { data: profile } = await supabase.from("users").select("id").eq("auth_user_id", user.id).single();
  if (!profile) return { error: "Perfil não encontrado." };

  const message = formData.get("message") as string;
  if (!message?.trim()) return { error: "Mensagem não pode ser vazia." };

  const { error } = await supabase.from("ticket_messages").insert({
    ticket_id: ticketId,
    sender_id: profile.id,
    message: message.trim(),
  });

  if (error) return { error: "Erro ao enviar mensagem." };

  revalidatePath(`/client-portal/requests/${ticketId}`);
  return { success: true };
}
