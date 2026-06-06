import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SimplesNacionalCalculator from "@/components/tools/SimplesNacionalCalculator";

export const metadata: Metadata = {
  title: "Simulador Simples Nacional | Nexus Contabilidade",
  description:
    "Calcule o DAS mensal e a alíquota efetiva do Simples Nacional pela tabela oficial. Anexos I, III e V.",
  openGraph: {
    title: "Simulador Simples Nacional | Nexus Contabilidade",
    description:
      "Simule o DAS do Simples Nacional pela tabela oficial e veja a composição por imposto.",
    type: "website",
    locale: "pt_BR",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Simulador Simples Nacional",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
  description:
    "Simulador gratuito do DAS do Simples Nacional com tabela oficial e breakdown por componente tributário.",
};

export default function SimplesNacionalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
            <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
              <Link href="/" className="hover:text-[#0F3D5E] transition-colors">Início</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/tools" className="hover:text-[#0F3D5E] transition-colors">Ferramentas</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#0F3D5E] font-medium">Simples Nacional</span>
            </nav>
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-4">
                <span className="w-1 h-1 rounded-full bg-[#2563EB]" />
                Tabela Oficial
              </span>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#0F3D5E] mb-3 leading-tight">
                Simulador{" "}
                <span className="text-[#2563EB]">Simples Nacional</span>
              </h1>
              <p className="text-slate-500 text-base leading-relaxed">
                Calcule o DAS mensal e a alíquota efetiva pela tabela oficial do Simples Nacional.
                Veja a composição por IRPJ, CSLL, COFINS, PIS, CPP e ISS.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <SimplesNacionalCalculator />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            <strong>Aviso:</strong> Esta simulação usa as tabelas vigentes do Simples Nacional (LC 123/2006).
            Alíquotas de ISS podem variar por município. A distribuição dos componentes é uma estimativa
            baseada nas médias dos anexos. Consulte seu contador para apuração oficial via PGDAS-D.
          </p>
        </div>
      </div>
    </>
  );
}
