import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FileText, Download, Users } from "lucide-react";
import PayrollMonthPicker from "./PayrollMonthPicker";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function PayrollPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client-portal/login");

  const { data: profile } = await supabase
    .from("users")
    .select("id, user_companies(company_id)")
    .eq("auth_user_id", user.id)
    .single();
  const companyId = (profile?.user_companies as { company_id: string }[] | null)?.[0]?.company_id;

  const now = new Date();
  const year = parseInt(params.year ?? String(now.getFullYear()), 10);
  const month = parseInt(params.month ?? String(now.getMonth() + 1), 10);

  const start = new Date(year, month - 1, 1).toISOString();
  const end = new Date(year, month, 1).toISOString();

  const { data: files } = await supabase
    .from("documents")
    .select("*")
    .eq("company_id", companyId ?? "")
    .eq("category", "payroll")
    .gte("created_at", start)
    .lt("created_at", end)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-[#2563EB]" />
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Folha de Pagamento</h1>
        </div>
        <p className="text-sm text-slate-400">Holerites e relatórios de folha por competência</p>
      </div>

      <PayrollMonthPicker />

      {files?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_100px_80px_56px] gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Documento</span>
            <span>Data</span>
            <span>Tamanho</span>
            <span></span>
          </div>
          <div className="divide-y divide-slate-100">
            {files.map((doc) => (
              <div
                key={doc.id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_100px_80px_56px] gap-2 sm:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <Link
                    href={`/client-portal/documents/${doc.id}`}
                    className="text-sm font-medium text-[#0F3D5E] hover:text-[#2563EB] truncate transition-colors"
                  >
                    {doc.title}
                  </Link>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(doc.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                </span>
                <span className="text-xs text-slate-500">{formatSize(doc.file_size)}</span>
                <Link
                  href={`/api/documents/download?id=${doc.id}`}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#0F3D5E]/8 text-[#0F3D5E] hover:bg-[#2563EB] hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400">Nenhum arquivo encontrado para esta competência</p>
          <p className="text-xs text-slate-300 mt-1">Os arquivos de folha serão disponibilizados pela equipe Nexus</p>
        </div>
      )}
    </div>
  );
}
