"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const { data: profile } = await supabase
    .from("users")
    .select("id, user_companies(company_id)")
    .eq("auth_user_id", user.id)
    .single();

  if (!profile) return { error: "Perfil não encontrado." };

  const companyId = (profile.user_companies as { company_id: string }[] | null)?.[0]?.company_id;

  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const responsible_person = formData.get("responsible_person") as string;
  const email = formData.get("email") as string;

  // Update company fields
  if (companyId) {
    const { error: companyError } = await supabase
      .from("companies")
      .update({ phone, address, responsible_person })
      .eq("id", companyId);
    if (companyError) return { error: "Erro ao atualizar dados da empresa." };
  }

  // Update user email if changed
  if (email && email !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({ email });
    if (emailError) return { error: "Erro ao atualizar e-mail. Verifique se é um endereço válido." };
  }

  await supabase.from("audit_logs").insert({
    user_id: profile.id,
    action: "profile.update",
    entity_type: "users",
    entity_id: profile.id,
    metadata: { changed_fields: ["phone", "address", "responsible_person"] },
  });

  revalidatePath("/client-portal/profile");
  return { success: "Perfil atualizado com sucesso." };
}
