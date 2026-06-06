import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import NewCompanyForm from "./NewCompanyForm";

export default function NewCompanyPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/admin/companies" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" /> Empresas
        </Link>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Nova Empresa</h1>
      </div>
      <NewCompanyForm />
    </div>
  );
}
