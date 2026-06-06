import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Upload, FileText } from "lucide-react";
import type { DocumentCategory, DocumentWorkflowStatus } from "@/types/database";
import WorkflowStatusBadge from "@/components/portal/WorkflowStatusBadge";
import UploadClientForm from "./UploadClientForm";

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  tax: "Fiscal", payroll: "Folha", accounting: "Contabilidade",
  financial: "Financeiro", legal: "Jurídico", certificate: "Certidão",
  contract: "Contrato", report: "Relatório", other: "Outro",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function UploadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client-portal/login");

  const { data: profile } = await supabase
    .from("users")
    .select("id, user_companies(company_id)")
    .eq("auth_user_id", user.id)
    .single();

  const companyId = (profile?.user_companies as { company_id: string }[] | null)?.[0]?.company_id ?? "";
  const userId = profile?.id ?? "";

  const { data: uploads } = await supabase
    .from("documents")
    .select("id, title, category, workflow_status, created_at")
    .eq("company_id", companyId)
    .eq("uploaded_by_client", true)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Upload className="w-5 h-5 text-[#2563EB]" />
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Meus Envios</h1>
        </div>
        <p className="text-sm text-slate-400">Envie documentos para revisão da equipe Nexus</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        <UploadClientForm companyId={companyId} userId={userId} />

        {/* Upload history */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-[#0F3D5E]">Histórico de Envios</p>
            <span className="text-xs text-slate-400">{uploads?.length ?? 0} documento(s)</span>
          </div>
          <div className="hidden sm:grid grid-cols-[1fr_100px_120px_40px] gap-4 px-5 py-2 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Documento</span>
            <span>Categoria</span>
            <span>Status</span>
            <span></span>
          </div>
          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {uploads?.length ? uploads.map((doc) => (
              <div key={doc.id} className="grid grid-cols-1 sm:grid-cols-[1fr_100px_120px_40px] gap-2 sm:gap-4 px-5 py-3.5 items-center hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0F3D5E] truncate">{doc.title}</p>
                    <p className="text-[11px] text-slate-400">{formatDate(doc.created_at)}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500">{CATEGORY_LABELS[doc.category as DocumentCategory]}</span>
                <WorkflowStatusBadge status={doc.workflow_status as DocumentWorkflowStatus} />
                <Link href={`/client-portal/uploads/${doc.id}`} className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:bg-[#0F3D5E] hover:text-white transition-colors text-xs font-medium">
                  →
                </Link>
              </div>
            )) : (
              <div className="px-5 py-12 text-center">
                <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Nenhum documento enviado ainda</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
