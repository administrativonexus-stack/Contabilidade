import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProLaboreCalculator from "@/components/tools/ProLaboreCalculator";

export const metadata: Metadata = {
  title: "Calculadora de Pró-Labore | Nexus Contabilidade",
  description:
    "Simule pró-labore vs dividendos e descubra quanto sua empresa economiza com INSS e IR usando a distribuição otimizada.",
  openGraph: {
    title: "Calculadora de Pró-Labore | Nexus Contabilidade",
    description:
      "Compare pró-labore e dividendos para sócios. Calcule INSS, IR e o líquido no bolso em tempo real.",
    type: "website",
    locale: "pt_BR",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Calculadora de Pró-Labore",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
  description:
    "Simulador gratuito de pró-labore vs dividendos para sócios: calcula INSS, IR e otimiza a remuneração.",
};

export default function ProLaborePage() {
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
              <span className="text-[#0F3D5E] font-medium">Pró-Labore</span>
            </nav>
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-4">
                <span className="w-1 h-1 rounded-full bg-[#2563EB]" />
                100% Gratuito
              </span>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#0F3D5E] mb-3 leading-tight">
                Calculadora de{" "}
                <span className="text-[#2563EB]">Pró-Labore</span>
              </h1>
              <p className="text-slate-500 text-base leading-relaxed">
                Compare pró-labore e dividendos para sócios. Descubra quanto você paga de INSS
                e IR, e veja o cenário otimizado com pró-labore mínimo e máximo de dividendos isentos.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <ProLaboreCalculator />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            <strong>Aviso:</strong> Esta calculadora usa a tabela de INSS e IR vigente em 2024.
            Valores aproximados para fins de simulação. A distribuição de dividendos depende de
            lucro contábil apurado. Consulte um contador antes de alterar sua estrutura de remuneração.
          </p>
        </div>
      </div>
    </>
  );
}
