import Link from "next/link";
import { TrendingUp, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal do Cliente | Nexus Contabilidade",
  description: "Portal do cliente da Nexus Contabilidade — em breve.",
  robots: { index: false, follow: false },
};

export default function PortalPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-[#0F3D5E] flex items-center justify-center mx-auto mb-6">
          <TrendingUp className="w-8 h-8 text-white" strokeWidth={2} />
        </div>

        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-5">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-xs font-semibold text-amber-700">Em desenvolvimento</span>
        </div>

        <h1 className="text-3xl font-bold font-heading text-[#1E293B] mb-3">
          Portal do Cliente
        </h1>
        <p className="text-[#475569] leading-relaxed mb-8">
          Estamos construindo o portal de acesso exclusivo para nossos clientes.
          Em breve você poderá acessar documentos, relatórios e muito mais.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F3D5E] text-white font-semibold text-sm hover:bg-[#1a4f75] transition-colors"
        >
          ← Voltar ao site
        </Link>
      </div>
    </div>
  );
}
