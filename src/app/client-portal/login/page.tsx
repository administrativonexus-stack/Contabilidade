import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Acesso ao Portal | Nexus Contabilidade",
  description: "Acesse o portal exclusivo da Nexus Contabilidade.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F3D5E] to-[#2563EB] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xl font-heading font-bold text-[#0F3D5E]">Nexus</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-[#0F3D5E]">Portal do Cliente</h1>
          <p className="text-sm text-slate-500 mt-1">Acesse seus documentos e solicitações</p>
        </div>

        <LoginForm />

        {/* REMOVER ANTES DE IR PARA PRODUÇÃO */}
        <div className="mt-5 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-700 mb-3">🧪 Ambiente de Testes</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-amber-800 w-14">Admin</span>
              <span className="text-xs text-amber-700 font-mono">admin@nexus.com</span>
              <span className="text-xs text-amber-700 font-mono font-semibold">Admin@2025</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-amber-800 w-14">Cliente</span>
              <span className="text-xs text-amber-700 font-mono">cliente@teste.com</span>
              <span className="text-xs text-amber-700 font-mono font-semibold">Cliente@2025</span>
            </div>
          </div>
          <p className="text-[10px] text-amber-500 mt-3">Remover antes de ir para produção</p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Problemas de acesso?{" "}
          <a href="https://wa.me/5511999999999" className="text-[#2563EB] hover:underline">
            Fale com nosso suporte
          </a>
        </p>
      </div>
    </div>
  );
}
