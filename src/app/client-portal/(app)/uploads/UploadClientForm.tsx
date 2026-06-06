"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { DocumentCategory } from "@/types/database";

const CATEGORIES: { value: DocumentCategory; label: string }[] = [
  { value: "tax", label: "Documentos Fiscais" },
  { value: "payroll", label: "Folha de Pagamento" },
  { value: "accounting", label: "Contabilidade" },
  { value: "financial", label: "Financeiro" },
  { value: "legal", label: "Jurídico" },
  { value: "certificate", label: "Certidões" },
  { value: "contract", label: "Contratos" },
  { value: "other", label: "Outros" },
];

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png", "image/jpeg",
  "application/zip",
  "text/csv",
];
const MAX_SIZE = 50 * 1024 * 1024;

const inputClass = "w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors";

interface Props {
  companyId: string;
  userId: string;
}

export default function UploadClientForm({ companyId, userId }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) { setError("Tipo de arquivo não permitido. Use PDF, DOCX, XLSX, PNG, JPG, ZIP ou CSV."); return; }
    if (f.size > MAX_SIZE) { setError("O arquivo deve ter no máximo 50 MB."); return; }
    setError(null);
    setFile(f);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) { setError("Selecione um arquivo."); return; }
    setError(null);

    const fd = new FormData(e.currentTarget);
    const title = fd.get("title") as string;
    const category = fd.get("category") as DocumentCategory;
    const description = fd.get("description") as string;

    startTransition(async () => {
      const supabase = createClient();

      const ext = file.name.split(".").pop();
      const filePath = `${companyId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file, { contentType: file.type });
      if (uploadError) { setError("Erro ao enviar arquivo: " + uploadError.message); return; }

      const { data: doc, error: dbError } = await supabase.from("documents").insert({
        company_id: companyId,
        title,
        description: description || null,
        category,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: userId,
        workflow_status: "submitted" as const,
        uploaded_by_client: true,
      }).select("id").single();

      if (dbError || !doc) { setError("Erro ao registrar documento: " + (dbError?.message ?? "tente novamente")); return; }

      // Create initial status history entry
      await supabase.from("document_status_history").insert({
        document_id: doc.id,
        previous_status: null,
        new_status: "submitted" as const,
        changed_by: userId,
        reason: "Documento enviado pelo cliente",
      });

      setSuccess(true);
      setFile(null);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => { setSuccess(false); router.refresh(); }, 2000);
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 className="text-sm font-semibold text-[#0F3D5E] mb-5">Enviar Documento</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Título <span className="text-red-400">*</span></label>
          <input name="title" required className={inputClass} placeholder="Ex: Contrato Social Atualizado" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Categoria <span className="text-red-400">*</span></label>
          <select name="category" required className={`${inputClass} cursor-pointer`}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Descrição</label>
          <textarea name="description" rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors resize-none" placeholder="Descreva o documento (opcional)..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Arquivo <span className="text-red-400">*</span></label>
          <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-[#2563EB] transition-colors bg-slate-50">
            <Upload className="w-6 h-6 text-slate-400 mb-1" />
            <span className="text-xs text-slate-500">{file ? file.name : "Clique ou arraste o arquivo aqui"}</span>
            <span className="text-[10px] text-slate-400 mt-0.5">PDF, DOCX, XLSX, PNG, JPG, ZIP, CSV · máx. 50MB</span>
            <input type="file" accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.zip,.csv" onChange={handleFileChange} className="sr-only" />
          </label>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
        {success && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Documento enviado! Aguardando revisão da equipe Nexus.
          </div>
        )}

        <button type="submit" disabled={isPending || !file} className="w-full h-11 rounded-xl bg-[#2563EB] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-60">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-4 h-4" /> Enviar para Revisão</>}
        </button>
      </form>
    </div>
  );
}
