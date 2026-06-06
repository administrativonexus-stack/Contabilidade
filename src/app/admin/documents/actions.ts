"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { DocumentWorkflowStatus } from "@/types/database";

export async function reviewDocument(
  documentId: string,
  newStatus: DocumentWorkflowStatus,
  reason?: string,
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { data: profile } = await supabase.from("users").select("id, role").eq("auth_user_id", user.id).single();
  if (!profile || !["admin", "super_admin", "staff"].includes(profile.role)) {
    return { error: "Sem permissão" };
  }

  const { data: current } = await supabase
    .from("documents")
    .select("workflow_status, company_id")
    .eq("id", documentId)
    .single();
  if (!current) return { error: "Documento não encontrado" };

  const { error: updateError } = await supabase
    .from("documents")
    .update({ workflow_status: newStatus })
    .eq("id", documentId);
  if (updateError) return { error: "Erro ao atualizar status" };

  await supabase.from("document_status_history").insert({
    document_id: documentId,
    previous_status: current.workflow_status as DocumentWorkflowStatus,
    new_status: newStatus,
    changed_by: profile.id,
    reason: reason || null,
  });

  // Create in-app notification for the company's users
  const { data: companyUsers } = await supabase
    .from("user_companies")
    .select("user_id")
    .eq("company_id", current.company_id);

  if (companyUsers?.length) {
    const statusLabels: Record<DocumentWorkflowStatus, string> = {
      submitted: "Enviado",
      under_review: "Em Revisão",
      pending_information: "Aguardando Informações",
      approved: "Aprovado",
      rejected: "Rejeitado",
      archived: "Arquivado",
    };
    await supabase.from("notifications").insert(
      companyUsers.map(({ user_id }) => ({
        user_id,
        title: `Documento ${statusLabels[newStatus]}`,
        message: reason ? `Motivo: ${reason}` : `Status atualizado para ${statusLabels[newStatus]}.`,
      })),
    );
  }

  revalidatePath(`/admin/documents/${documentId}`);
  revalidatePath("/admin/review");
  return { success: true };
}

export async function addInternalNote(documentId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { data: profile } = await supabase.from("users").select("id, role").eq("auth_user_id", user.id).single();
  if (!profile || !["admin", "super_admin", "staff"].includes(profile.role)) {
    return { error: "Sem permissão" };
  }

  const { error } = await supabase.from("document_comments").insert({
    document_id: documentId,
    author_id: profile.id,
    content,
    is_internal: true,
  });

  if (error) return { error: "Erro ao salvar nota" };

  revalidatePath(`/admin/documents/${documentId}`);
  return { success: true };
}

export async function addPublicComment(documentId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { data: profile } = await supabase.from("users").select("id, role").eq("auth_user_id", user.id).single();
  if (!profile || !["admin", "super_admin", "staff"].includes(profile.role)) {
    return { error: "Sem permissão" };
  }

  const { error } = await supabase.from("document_comments").insert({
    document_id: documentId,
    author_id: profile.id,
    content,
    is_internal: false,
  });

  if (error) return { error: "Erro ao salvar comentário" };

  revalidatePath(`/admin/documents/${documentId}`);
  return { success: true };
}
