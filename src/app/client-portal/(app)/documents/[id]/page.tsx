import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft, FileText, Download, Calendar, User } from "lucide-react";
import type { DocumentCategory } from "@/types/database";

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  tax: "Documentos Fiscais",
  payroll: "Folha de Pagamento",
  accounting: "Contabilidade",
  financial: "Financeiro",
  legal: "Jurídico",
  contract: "Contratos",
  certificate: "Certidões",
  report: "Relatórios",
  other: "Outros",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client-portal/login");

  const { data: doc } = await supabase.from("documents").select("*, users!uploaded_by(full_name)").eq("id", id).is("deleted_at", null).single();
  if (!doc) notFound();

  const uploader = (doc.users as { full_name: string } | null)?.full_name ?? "Equipe Nexus";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/client-portal/documents" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" /> Voltar aos documentos
        </Link>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">{doc.title}</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <FileText className="w-7 h-7 text-[#2563EB]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-heading font-semibold text-[#0F3D5E] truncate">{doc.file_name}</p>
            <p className="text-sm text-slate-400 mt-0.5">{formatSize(doc.file_size)}</p>
            {doc.description && <p className="text-sm text-slate-600 mt-2">{doc.description}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
            </span>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide">Categoria</p>
              <p className="font-medium text-[#0F3D5E] text-sm">{CATEGORY_LABELS[doc.category]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
            </span>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide">Data</p>
              <p className="font-medium text-[#0F3D5E] text-sm">{formatDate(doc.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-slate-500" />
            </span>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide">Enviado por</p>
              <p className="font-medium text-[#0F3D5E] text-sm">{uploader}</p>
            </div>
          </div>
        </div>

        <Link
          href={`/api/documents/download?id=${doc.id}`}
          className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold hover:bg-[#0d3352] transition-colors"
        >
          <Download className="w-4 h-4" /> Baixar documento
        </Link>
      </div>
    </div>
  );
}
