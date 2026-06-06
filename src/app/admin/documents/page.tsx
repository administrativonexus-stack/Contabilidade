import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FileText, Upload } from "lucide-react";
import type { DocumentCategory } from "@/types/database";

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  tax: "Fiscal", payroll: "Folha", contract: "Contrato",
  certificate: "Certidão", report: "Relatório", other: "Outro",
  accounting: "Contabilidade", financial: "Financeiro", legal: "Jurídico",
};

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminDocumentsPage() {
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from("documents")
    .select("*, companies(company_name), users!uploaded_by(full_name)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Documentos</h1>
          <p className="text-sm text-slate-400 mt-0.5">{documents?.length ?? 0} documento(s)</p>
        </div>
        <Link href="/admin/documents/upload" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Upload className="w-4 h-4" /> Enviar documento
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="hidden lg:grid grid-cols-[1fr_160px_100px_80px_100px_80px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span>Documento</span><span>Empresa</span><span>Categoria</span><span>Tamanho</span><span>Enviado por</span><span>Data</span>
        </div>
        <div className="divide-y divide-slate-100">
          {documents?.length ? documents.map((d) => (
            <div key={d.id} className="grid grid-cols-1 lg:grid-cols-[1fr_160px_100px_80px_100px_80px] gap-2 lg:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-[#2563EB]" />
                </div>
                <p className="text-sm font-medium text-[#0F3D5E] truncate">{d.title}</p>
              </div>
              <span className="text-xs text-slate-500 truncate">{(d.companies as { company_name: string } | null)?.company_name ?? "—"}</span>
              <span className="text-xs text-slate-500">{CATEGORY_LABELS[d.category]}</span>
              <span className="text-xs text-slate-500">{formatSize(d.file_size)}</span>
              <span className="text-xs text-slate-500 truncate">{(d.users as { full_name: string } | null)?.full_name ?? "—"}</span>
              <span className="text-xs text-slate-400">{formatDate(d.created_at)}</span>
            </div>
          )) : (
            <div className="px-5 py-12 text-center">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Nenhum documento enviado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
