import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft, FileText, Download, Lock } from "lucide-react";
import type { DocumentCategory, DocumentWorkflowStatus } from "@/types/database";
import WorkflowStatusBadge from "@/components/portal/WorkflowStatusBadge";
import DocumentTimeline from "@/components/portal/DocumentTimeline";
import ReviewActions from "./ReviewActions";

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  tax: "Documentos Fiscais", payroll: "Folha de Pagamento", accounting: "Contabilidade",
  financial: "Financeiro", legal: "Jurídico", certificate: "Certidões",
  contract: "Contratos", report: "Relatórios", other: "Outros",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminDocumentReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: doc } = await supabase
    .from("documents")
    .select("*, companies(company_name), users!uploaded_by(full_name)")
    .eq("id", id)
    .is("deleted_at", null)
    .single();
  if (!doc) notFound();

  const [historyRes, internalNotesRes, publicCommentsRes] = await Promise.all([
    supabase
      .from("document_status_history")
      .select("*, users(full_name)")
      .eq("document_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("document_comments")
      .select("*, users!author_id(full_name)")
      .eq("document_id", id)
      .eq("is_internal", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("document_comments")
      .select("*, users!author_id(full_name)")
      .eq("document_id", id)
      .eq("is_internal", false)
      .order("created_at", { ascending: false }),
  ]);

  const company = (doc.companies as { company_name: string } | null)?.company_name ?? "—";
  const uploader = (doc.users as { full_name: string } | null)?.full_name ?? "—";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <Link href="/admin/review" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Fila de Revisão
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">{doc.title}</h1>
            <p className="text-sm text-slate-400 mt-0.5">{company} · {CATEGORY_LABELS[doc.category as DocumentCategory]} · v{doc.version}</p>
          </div>
          <WorkflowStatusBadge status={doc.workflow_status as DocumentWorkflowStatus} size="md" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Main column */}
        <div className="space-y-6">
          {/* File card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-[#2563EB]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0F3D5E] truncate">{doc.file_name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{formatSize(doc.file_size)} · {doc.mime_type}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 text-sm">
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide">Empresa</p>
                <p className="font-medium text-[#0F3D5E] mt-0.5">{company}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide">Enviado por</p>
                <p className="font-medium text-[#0F3D5E] mt-0.5">{uploader}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide">Data</p>
                <p className="font-medium text-[#0F3D5E] mt-0.5">{formatDate(doc.created_at)}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide">Versão</p>
                <p className="font-medium text-[#0F3D5E] mt-0.5">v{doc.version}</p>
              </div>
            </div>
            {doc.description && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-1">Descrição</p>
                <p className="text-sm text-slate-700">{doc.description}</p>
              </div>
            )}
            <Link
              href={`/api/documents/download?id=${doc.id}`}
              className="mt-4 w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold hover:bg-[#0d3352] transition-colors"
            >
              <Download className="w-4 h-4" /> Baixar Documento
            </Link>
          </div>

          {/* Internal notes */}
          <div className="bg-white rounded-2xl border border-amber-200 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-semibold text-[#0F3D5E]">Notas Internas</h2>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Apenas equipe</span>
            </div>
            {internalNotesRes.data?.length ? (
              <div className="space-y-3">
                {internalNotesRes.data.map((n) => (
                  <div key={n.id} className="bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-amber-800">
                        {(n.users as { full_name: string } | null)?.full_name ?? "—"}
                      </p>
                      <time className="text-[11px] text-amber-600">
                        {new Date(n.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </time>
                    </div>
                    <p className="text-sm text-amber-900">{n.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Nenhuma nota interna ainda.</p>
            )}
          </div>

          {/* Public comments */}
          {publicCommentsRes.data && publicCommentsRes.data.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <h2 className="text-sm font-semibold text-[#0F3D5E]">Comentários ao Cliente</h2>
              <div className="space-y-3">
                {publicCommentsRes.data.map((c) => (
                  <div key={c.id} className="bg-slate-50 rounded-xl p-3.5">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-[#0F3D5E]">
                        {(c.users as { full_name: string } | null)?.full_name ?? "Equipe Nexus"}
                      </p>
                      <time className="text-[11px] text-slate-400">
                        {new Date(c.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                      </time>
                    </div>
                    <p className="text-sm text-slate-700">{c.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-[#0F3D5E] mb-5">Histórico de Status</h2>
            <DocumentTimeline history={(historyRes.data ?? []) as Parameters<typeof DocumentTimeline>[0]["history"]} />
          </div>
        </div>

        {/* Review actions sidebar */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <ReviewActions documentId={id} currentStatus={doc.workflow_status as DocumentWorkflowStatus} />
        </div>
      </div>
    </div>
  );
}
