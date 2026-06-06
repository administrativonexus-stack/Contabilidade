import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CltVsPjCalculator from "@/components/tools/CltVsPjCalculator";

export const metadata: Metadata = {
  title: "Calculadora CLT vs PJ | Nexus Contabilidade",
  description:
    "Calcule a diferença estimada de custo entre contratar um funcionário CLT e contratar um profissional como PJ. Ferramenta gratuita.",
  openGraph: {
    title: "Calculadora CLT vs PJ | Nexus Contabilidade",
    description:
      "Compare o custo real de CLT vs PJ em segundos. Ferramenta gratuita para empresários.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function CltVsPjPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Calculadora CLT vs PJ",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
    description:
      "Calcule o custo estimado de contratar CLT versus PJ considerando FGTS, 13º, férias, INSS e impostos.",
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "O que é incluído no custo CLT?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FGTS (8%), provisão do 13º salário (8,33%), provisão de férias (11,11%), INSS patronal (20%) e benefícios como vale transporte, vale refeição e plano de saúde.",
        },
      },
      {
        "@type": "Question",
        name: "Como é calculado o custo PJ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O custo PJ é o valor do contrato mais os impostos estimados conforme o regime tributário: 8% para Simples Nacional, 13,33% para Lucro Presumido e 15% para Lucro Real.",
        },
      },
      {
        "@type": "Question",
        name: "Os valores são exatos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Não. Os valores são estimativas para fins de comparação. Custos reais variam conforme convenção coletiva, benefícios, setor e regime tributário específico da empresa.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Page header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-slate-400 mb-5">
              <Link href="/" className="hover:text-[#0F3D5E] transition-colors">Início</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/tools" className="hover:text-[#0F3D5E] transition-colors">Ferramentas</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#0F3D5E] font-medium">CLT vs PJ</span>
            </nav>

            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-4">
                <span className="w-1 h-1 rounded-full bg-[#2563EB]" />
                Ferramenta Gratuita
              </span>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#0F3D5E] mb-3 leading-tight">
                Calculadora CLT vs PJ
              </h1>
              <p className="text-slate-500 text-base leading-relaxed">
                Descubra a diferença estimada entre contratar um funcionário CLT e contratar um profissional como PJ.
                Preencha o salário e veja os resultados em tempo real.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <CltVsPjCalculator />

          {/* Disclaimer */}
          <p className="mt-10 text-xs text-slate-400 text-center max-w-2xl mx-auto leading-relaxed">
            Esta calculadora fornece valores estimados para fins informativos. Os custos reais podem variar
            de acordo com convenções coletivas, regime tributário, benefícios, regulamentações do setor e
            condições específicas de cada empresa.
          </p>
        </div>
      </div>
    </>
  );
}
