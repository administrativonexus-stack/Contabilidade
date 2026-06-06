import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ClipboardCheck, FileText } from "lucide-react";
import type { DocumentCategory, DocumentWorkflowStatus } from "@/types/database";
import WorkflowStatusBadge from "@/components/portal/WorkflowStatusBadge";

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  tax: "Fiscal", payroll: "Folha", accounting: "Contabilidade",
  financial: "Financeiro", legal: "Jurídico", certificate: "Certidão",
  contract: "Contrato", report: "Relatório", other: "Outro",
};

// verify complete — all 9 keys match DocumentCategory union

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function ReviewQueuePage() {
  const supabase = await createClient();

  const { data: queue } = await supabase
    .from("documents")
    .select("id, title, category, workflow_status, created_at, uploaded_by_client, companies(company_name), users!uploaded_by(full_name)")
    .in("workflow_status", ["submitted", "under_review", "pending_information"])
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ClipboardCheck className="w-5 h-5 text-[#2563EB]" />
            <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Fila de Revisão</h1>
          </div>
          <p className="text-sm text-slate-400">{queue?.length ?? 0} documento(s) aguardando ação</p>
        </div>
      </div>

      {queue?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1fr_160px_100px_130px_120px_48px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Documento</span>
            <span>Empresa</span>
            <span>Categoria</span>
            <span>Enviado em</span>
            <span>Status</span>
            <span></span>
          </div>
          <div className="divide-y divide-slate-100">
            {queue.map((doc) => (
              <div key={doc.id} className="grid grid-cols-1 lg:grid-cols-[1fr_160px_100px_130px_120px_48px] gap-2 lg:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0F3D5E] truncate">{doc.title}</p>
                    <p className="text-xs text-slate-400">
                      {(doc.users as { full_name: string } | null)?.full_name ?? "—"}
                      {doc.uploaded_by_client && <span className="ml-1 text-[#2563EB]">• cliente</span>}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-500 truncate">{(doc.companies as { company_name: string } | null)?.company_name ?? "—"}</span>
                <span className="text-xs text-slate-500">{CATEGORY_LABELS[doc.category as DocumentCategory]}</span>
                <span className="text-xs text-slate-500">{formatDate(doc.created_at)}</span>
                <WorkflowStatusBadge status={doc.workflow_status as DocumentWorkflowStatus} />
                <Link
                  href={`/admin/documents/${doc.id}`}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#0F3D5E] text-white text-xs font-semibold hover:bg-[#0d3352] transition-colors"
                >
                  →
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <ClipboardCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400">Fila vazia</p>
          <p className="text-xs text-slate-300 mt-1">Nenhum documento aguardando revisão</p>
        </div>
      )}
    </div>
  );
}
