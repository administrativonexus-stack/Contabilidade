import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import NewPlanForm from "./NewPlanForm";

export default function NewPlanPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/admin/financeiro/plans" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Novo Plano</h1>
      </div>
      <NewPlanForm />
    </div>
  );
}
