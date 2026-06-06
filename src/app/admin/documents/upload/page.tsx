import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import UploadDocumentForm from "./UploadDocumentForm";
import { createClient } from "@/lib/supabase/server";

export default async function UploadDocumentPage() {
  const supabase = await createClient();
  const { data: companies } = await supabase
    .from("companies")
    .select("id, company_name")
    .eq("is_active", true)
    .order("company_name");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/admin/documents" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" /> Documentos
        </Link>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Enviar Documento</h1>
      </div>
      <UploadDocumentForm companies={companies ?? []} />
    </div>
  );
}
