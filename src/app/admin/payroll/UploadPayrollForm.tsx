"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png","image/jpeg",
];
const MAX_SIZE = 25 * 1024 * 1024;
const inputClass = "w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors";

interface Props {
  companies: { id: string; company_name: string }[];
}

export default function UploadPayrollForm({ companies }: Props) {
  const now = new Date();
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) { setError("Tipo de arquivo não permitido."); return; }
    if (f.size > MAX_SIZE) { setError("O arquivo deve ter no máximo 25 MB."); return; }
    setError(null);
    setFile(f);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) { setError("Selecione um arquivo."); return; }
    setError(null);

    const fd = new FormData(e.currentTarget);
    const companyId = fd.get("company_id") as string;
    const title = fd.get("title") as string;
    const description = fd.get("description") as string;

    startTransition(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Não autenticado."); return; }

      const { data: profile } = await supabase.from("users").select("id").eq("auth_user_id", user.id).single();
      if (!profile) { setError("Perfil não encontrado."); return; }

      const ext = file.name.split(".").pop();
      const filePath = `${companyId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("documents").upload(filePath, file);
      if (uploadError) { setError("Erro ao enviar arquivo: " + uploadError.message); return; }

      const { error: dbError } = await supabase.from("documents").insert({
        company_id: companyId,
        title,
        description: description || null,
        category: "payroll" as const,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: profile.id,
      });

      if (dbError) { setError("Erro ao salvar: " + dbError.message); return; }

      setSuccess(true);
      setFile(null);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => { setSuccess(false); router.refresh(); }, 1500);
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 className="text-sm font-semibold text-[#0F3D5E] mb-5">Enviar Arquivo de Folha</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Empresa <span className="text-red-400">*</span></label>
          <select name="company_id" required className={`${inputClass} cursor-pointer`}>
            <option value="">Selecione a empresa</option>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Mês <span className="text-red-400">*</span></label>
            <select name="month" required defaultValue={String(now.getMonth() + 1)} className={`${inputClass} cursor-pointer`}>
              {MONTHS.map((m, i) => <option key={i + 1} value={String(i + 1)}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Ano <span className="text-red-400">*</span></label>
            <input name="year" type="number" required defaultValue={now.getFullYear()} min={2020} max={2099} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Título <span className="text-red-400">*</span></label>
          <input name="title" required className={inputClass} placeholder="Ex: Holerite Janeiro 2026" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Descrição</label>
          <textarea name="description" rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors resize-none" placeholder="Descrição opcional..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Arquivo <span className="text-red-400">*</span></label>
          <label className="flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-[#2563EB] transition-colors bg-slate-50">
            <Upload className="w-5 h-5 text-slate-400 mb-1" />
            <span className="text-xs text-slate-500">{file ? file.name : "Clique ou arraste o arquivo"}</span>
            <span className="text-[10px] text-slate-400 mt-0.5">PDF, DOCX, XLSX, PNG, JPG · máx. 25MB</span>
            <input type="file" accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg" onChange={handleFileChange} className="sr-only" />
          </label>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
        {success && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
            <CheckCircle className="w-4 h-4" /> Arquivo enviado com sucesso!
          </div>
        )}

        <button type="submit" disabled={isPending || !file} className="w-full h-11 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0d3352] transition-colors disabled:opacity-60">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-4 h-4" /> Enviar</>}
        </button>
      </form>
    </div>
  );
}
