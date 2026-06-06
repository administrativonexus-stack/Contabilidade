import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ahnuwtsyfxieijdnrsvx.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFobnV3dHN5ZnhpZWlqZG5yc3Z4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY3MTk3MiwiZXhwIjoyMDk2MjQ3OTcyfQ.rOuPf4T7JhaFIPfUj81M093mGR9fUf4aLV3d6xbmg6k";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function getOrCreateAuthUser(email, password, label) {
  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing?.users?.find((u) => u.email === email);
  if (found) {
    console.log(`  ↩  ${label} já existe (${found.id})`);
    return found;
  }
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw new Error(`Erro ao criar ${label}: ${error.message}`);
  console.log(`  ✅ ${label} criado (${data.user.id})`);
  return data.user;
}

async function seed() {
  console.log("\n🌱 Iniciando seed do banco Nexus...\n");

  // ─── Auth users ───────────────────────────────────────────
  console.log("👤 Criando usuários auth...");
  const adminAuth  = await getOrCreateAuthUser("admin@nexus.com",    "Admin@2025",   "Admin");
  const clientAuth = await getOrCreateAuthUser("cliente@teste.com",  "Cliente@2025", "Cliente");

  // ─── Profiles na tabela users ─────────────────────────────
  console.log("\n📋 Inserindo perfis...");

  const { data: adminProfile, error: e1 } = await supabase
    .from("users")
    .upsert({ auth_user_id: adminAuth.id, full_name: "Administrador Nexus", email: "admin@nexus.com", role: "admin", is_active: true }, { onConflict: "auth_user_id" })
    .select().single();
  if (e1) throw new Error("Perfil admin: " + e1.message);
  console.log("  ✅ Perfil admin inserido");

  const { data: clientProfile, error: e2 } = await supabase
    .from("users")
    .upsert({ auth_user_id: clientAuth.id, full_name: "João Silva", email: "cliente@teste.com", role: "client", is_active: true }, { onConflict: "auth_user_id" })
    .select().single();
  if (e2) throw new Error("Perfil cliente: " + e2.message);
  console.log("  ✅ Perfil cliente inserido");

  // ─── Empresa de teste ─────────────────────────────────────
  console.log("\n🏢 Criando empresa de teste...");
  const { data: company, error: e3 } = await supabase
    .from("companies")
    .insert({
      company_name: "Empresa Teste LTDA",
      trade_name: "Empresa Teste",
      cnpj: "12.345.678/0001-90",
      email: "contato@empresateste.com.br",
      phone: "(11) 99999-9999",
      address: "Rua das Flores, 123",
      city: "São Paulo",
      state: "SP",
      zip_code: "01310-100",
      responsible_person: "João Silva",
      is_active: true,
    })
    .select().single();
  if (e3) throw new Error("Empresa: " + e3.message);
  console.log("  ✅ Empresa criada:", company.id);

  // ─── Vincular cliente à empresa ───────────────────────────
  await supabase.from("user_companies").upsert(
    { user_id: clientProfile.id, company_id: company.id },
    { onConflict: "user_id,company_id" }
  );
  console.log("  ✅ Cliente vinculado à empresa");

  // ─── Comunicado de boas-vindas ────────────────────────────
  console.log("\n📢 Criando comunicado de boas-vindas...");
  const { error: e4 } = await supabase.from("announcements").insert({
    title: "Bem-vindo ao Portal Nexus!",
    summary: "Seu portal contábil digital está pronto para uso.",
    content:
      "Olá, João!\n\nSeja bem-vindo ao Portal do Cliente da Nexus Contabilidade.\n\nAqui você pode:\n• Acessar seus documentos fiscais e contábeis\n• Abrir solicitações e acompanhar o andamento\n• Ver comunicados importantes da sua contabilidade\n• Atualizar seus dados cadastrais\n\nQualquer dúvida, estamos à disposição!\n\nAtenciosamente,\nEquipe Nexus Contabilidade",
    category: "general",
    published: true,
    published_at: new Date().toISOString(),
    created_by: adminProfile.id,
  });
  if (e4) throw new Error("Comunicado: " + e4.message);
  console.log("  ✅ Comunicado criado");

  // ─── Resultado ────────────────────────────────────────────
  console.log("\n✨ Seed concluído com sucesso!\n");
  console.log("┌─────────────────────────────────────────────────┐");
  console.log("│           CREDENCIAIS DE TESTE                  │");
  console.log("├─────────────────────────────────────────────────┤");
  console.log("│  👤 ADMIN                                        │");
  console.log("│     Email:  admin@nexus.com                     │");
  console.log("│     Senha:  Admin@2025                          │");
  console.log("│     Acesso: /admin/dashboard                    │");
  console.log("├─────────────────────────────────────────────────┤");
  console.log("│  👤 CLIENTE                                      │");
  console.log("│     Email:  cliente@teste.com                   │");
  console.log("│     Senha:  Cliente@2025                        │");
  console.log("│     Acesso: /client-portal/dashboard            │");
  console.log("└─────────────────────────────────────────────────┘\n");
}

seed().catch((err) => {
  console.error("\n❌ Erro no seed:", err.message);
  process.exit(1);
});
