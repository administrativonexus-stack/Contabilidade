import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TaxSavingsCalculator from "@/components/tools/TaxSavingsCalculator";

export const metadata: Metadata = {
  title: "Calculadora de Economia Tributária | Nexus Contabilidade",
  description:
    "Compare Simples Nacional, Lucro Presumido e Lucro Real e descubra quanto sua empresa pode economizar em impostos.",
  openGraph: {
    title: "Calculadora de Economia Tributária | Nexus Contabilidade",
    description:
      "Simulação gratuita: compare regimes tributários e descubra a melhor opção para sua empresa.",
    type: "website",
    locale: "pt_BR",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Calculadora de Economia Tributária",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
  description: "Comparador gratuito de regimes tributários: Simples Nacional, Lucro Presumido e Lucro Real.",
};

export default function TaxSavingsPage() {
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
              <span className="text-[#0F3D5E] font-medium">Economia Tributária</span>
            </nav>
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-4">
                <span className="w-1 h-1 rounded-full bg-[#2563EB]" />
                100% Gratuito
              </span>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#0F3D5E] mb-3 leading-tight">
                Calculadora de{" "}
                <span className="text-[#2563EB]">Economia Tributária</span>
              </h1>
              <p className="text-slate-500 text-base leading-relaxed">
                Compare Simples Nacional, Lucro Presumido e Lucro Real em segundos e descubra qual regime
                oferece a menor carga tributária para a sua empresa.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <TaxSavingsCalculator />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            <strong>Aviso:</strong> Esta calculadora utiliza alíquotas aproximadas para fins de simulação.
            Os valores reais dependem do enquadramento específico, CNAE e demais particularidades de cada empresa.
            Consulte um contador antes de tomar decisões sobre mudança de regime tributário.
          </p>
        </div>
      </div>
    </>
  );
}
