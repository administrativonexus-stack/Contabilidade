import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import NewRequestForm from "./NewRequestForm";

export default function NewRequestPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/client-portal/requests" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" /> Voltar às solicitações
        </Link>
        <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Nova Solicitação</h1>
        <p className="text-sm text-slate-400 mt-0.5">Descreva o que você precisa e nossa equipe entrará em contato</p>
      </div>
      <NewRequestForm />
    </div>
  );
}
