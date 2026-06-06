import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft, FileText, Download, GitBranch } from "lucide-react";
import type { DocumentCategory, DocumentWorkflowStatus } from "@/types/database";
import WorkflowStatusBadge from "@/components/portal/WorkflowStatusBadge";
import DocumentTimeline from "@/components/portal/DocumentTimeline";

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  tax: "Documentos Fiscais", payroll: "Folha de Pagamento", accounting: "Contabilidade",
  financial: "Financeiro", legal: "Jurídico", certificate: "Certidões",
  contract: "Contratos", report: "Relatórios", other: "Outros",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function UploadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client-portal/login");

  const { data: doc } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .eq("uploaded_by_client", true)
    .is("deleted_at", null)
    .single();
  if (!doc) notFound();

  const [historyRes, commentsRes, versionsRes] = await Promise.all([
    supabase
      .from("document_status_history")
      .select("*, users(full_name)")
      .eq("document_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("document_comments")
      .select("*, users!author_id(full_name)")
      .eq("document_id", id)
      .eq("is_internal", false)
      .order("created_at", { ascending: false }),
    supabase
      .from("documents")
      .select("id, title, version, created_at, workflow_status")
      .or(`id.eq.${id},parent_document_id.eq.${id}`)
      .is("deleted_at", null)
      .order("version", { ascending: false }),
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/client-portal/uploads" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Meus Envios
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">{doc.title}</h1>
            <p className="text-sm text-slate-400 mt-0.5">{CATEGORY_LABELS[doc.category as DocumentCategory]} · v{doc.version} · {formatDate(doc.created_at)}</p>
          </div>
          <WorkflowStatusBadge status={doc.workflow_status as DocumentWorkflowStatus} size="md" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Main */}
        <div className="space-y-6">
          {/* File info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-[#2563EB]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0F3D5E] truncate">{doc.file_name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{formatSize(doc.file_size)}</p>
                {doc.description && <p className="text-sm text-slate-600 mt-2">{doc.description}</p>}
              </div>
            </div>
            <Link
              href={`/api/documents/download?id=${doc.id}`}
              className="mt-4 w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold hover:bg-[#0d3352] transition-colors"
            >
              <Download className="w-4 h-4" /> Baixar Documento
            </Link>
          </div>

          {/* Comentários da equipe */}
          {commentsRes.data && commentsRes.data.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <h2 className="text-sm font-semibold text-[#0F3D5E]">Comentários da Equipe</h2>
              <div className="space-y-3">
                {commentsRes.data.map((c) => (
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

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Versions */}
          {versionsRes.data && versionsRes.data.length > 1 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <GitBranch className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-[#0F3D5E]">Versões</h3>
              </div>
              <div className="space-y-2">
                {versionsRes.data.map((v) => (
                  <Link
                    key={v.id}
                    href={`/client-portal/uploads/${v.id}`}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-sm transition-colors ${v.id === id ? "bg-[#0F3D5E]/8 text-[#0F3D5E] font-medium" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <span>Versão {v.version}</span>
                    <WorkflowStatusBadge status={v.workflow_status as DocumentWorkflowStatus} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Status guide */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Guia de Status</h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <p><span className="font-semibold text-blue-700">Enviado</span> — Recebido, aguardando revisão</p>
              <p><span className="font-semibold text-amber-700">Em Revisão</span> — Equipe analisando</p>
              <p><span className="font-semibold text-orange-700">Aguardando Info</span> — Precisamos de mais dados</p>
              <p><span className="font-semibold text-emerald-700">Aprovado</span> — Documento aceito</p>
              <p><span className="font-semibold text-rose-700">Rejeitado</span> — Veja os comentários</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
