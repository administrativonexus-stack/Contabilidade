import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import AberturaEmpresaCalculator from "@/components/tools/AberturaEmpresaCalculator";

export const metadata: Metadata = {
  title: "Calculadora de Abertura de Empresa | Nexus Contabilidade",
  description:
    "Estime os custos de abrir uma empresa, escolha a estrutura ideal (MEI, SLU, LTDA, S.A.) e veja o regime tributário recomendado.",
  openGraph: {
    title: "Calculadora de Abertura de Empresa | Nexus Contabilidade",
    description:
      "Simule os custos de abertura, escolha entre MEI, SLU, LTDA ou S.A. e descubra o regime tributário ideal.",
    type: "website",
    locale: "pt_BR",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Calculadora de Abertura de Empresa",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
  description:
    "Simulador gratuito de custos de abertura de empresa com recomendação de estrutura e regime tributário.",
};

export default function AberturaEmpresaPage() {
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
              <span className="text-[#0F3D5E] font-medium">Abertura de Empresa</span>
            </nav>
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-4">
                <span className="w-1 h-1 rounded-full bg-[#2563EB]" />
                100% Gratuito
              </span>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#0F3D5E] mb-3 leading-tight">
                Calculadora de{" "}
                <span className="text-[#2563EB]">Abertura de Empresa</span>
              </h1>
              <p className="text-slate-500 text-base leading-relaxed">
                Estime os custos de abrir sua empresa, descubra a estrutura ideal entre MEI, SLU,
                LTDA e S.A., e veja o regime tributário recomendado para o seu perfil.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <AberturaEmpresaCalculator />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            <strong>Aviso:</strong> Os custos apresentados são estimativas com base em médias nacionais.
            Taxas da Junta Comercial e alvarás variam por estado e município. Consulte um contador para
            um orçamento preciso e personalizados para sua situação.
          </p>
        </div>
      </div>
    </>
  );
}
