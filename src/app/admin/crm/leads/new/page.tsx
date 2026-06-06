import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import NewLeadForm from "./NewLeadForm";

export default function NewLeadPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/admin/crm/leads" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Novo Lead</h1>
        <p className="text-sm text-slate-400 mt-0.5">Cadastrar novo potencial cliente</p>
      </div>
      <NewLeadForm />
    </div>
  );
}
