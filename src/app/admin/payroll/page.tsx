import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FileText, Download } from "lucide-react";
import UploadPayrollForm from "./UploadPayrollForm";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminPayrollPage() {
  const supabase = await createClient();

  const [{ data: companies }, { data: files }] = await Promise.all([
    supabase.from("companies").select("id, company_name").eq("is_active", true).order("company_name"),
    supabase
      .from("documents")
      .select("*, companies(company_name)")
      .eq("category", "payroll")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Folha de Pagamento</h1>
        <p className="text-sm text-slate-400 mt-0.5">Upload e gerenciamento de holerites e arquivos de folha</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        {/* Form */}
        <UploadPayrollForm companies={companies ?? []} />

        {/* List */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-[#0F3D5E]">Arquivos enviados</p>
            <span className="text-xs text-slate-400">{files?.length ?? 0} arquivo(s)</span>
          </div>
          <div className="hidden sm:grid grid-cols-[1fr_140px_100px_80px_56px] gap-4 px-5 py-2 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Documento</span>
            <span>Empresa</span>
            <span>Data</span>
            <span>Tamanho</span>
            <span></span>
          </div>
          <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
            {files?.length ? files.map((f) => (
              <div key={f.id} className="grid grid-cols-1 sm:grid-cols-[1fr_140px_100px_80px_56px] gap-2 sm:gap-4 px-5 py-3 items-center hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-sm font-medium text-[#0F3D5E] truncate">{f.title}</p>
                </div>
                <span className="text-xs text-slate-500 truncate">{(f.companies as { company_name: string } | null)?.company_name ?? "—"}</span>
                <span className="text-xs text-slate-500">{formatDate(f.created_at)}</span>
                <span className="text-xs text-slate-500">{formatSize(f.file_size)}</span>
                <Link href={`/api/documents/download?id=${f.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#0F3D5E]/8 text-[#0F3D5E] hover:bg-[#2563EB] hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </Link>
              </div>
            )) : (
              <div className="px-5 py-12 text-center">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Nenhum arquivo enviado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
