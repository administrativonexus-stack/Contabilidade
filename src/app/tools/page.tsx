import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator, TrendingDown, Receipt, Users, Building2, Lock,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { TOOLS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Ferramentas de Gestão Empresarial | Nexus Contabilidade",
  description:
    "Calculadoras e simuladores gratuitos para empresários tomarem melhores decisões financeiras e tributárias.",
  openGraph: {
    title: "Ferramentas Gratuitas | Nexus Contabilidade",
    description:
      "Calculadoras interativas para reduzir custos, entender impostos e tomar melhores decisões empresariais.",
    type: "website",
    locale: "pt_BR",
  },
};

const iconMap = {
  Calculator, TrendingDown, Receipt, Users, Building2,
} as const;

type IconName = keyof typeof iconMap;

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-5">
              <span className="w-1 h-1 rounded-full bg-[#2563EB]" />
              100% Gratuito
            </span>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#0F3D5E] mb-4 leading-tight">
              Ferramentas de Gestão para Decisões{" "}
              <span className="text-[#2563EB]">Mais Inteligentes</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Calculadoras interativas criadas para ajudar empresários a reduzir custos,
              entender impostos e tomar melhores decisões de negócio.
            </p>
          </div>
        </div>
      </div>

      {/* Tools grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map((tool, i) => {
            const Icon = iconMap[tool.icon as IconName] ?? Calculator;
            const available = tool.available;

            if (available) {
              return (
                <AnimatedSection key={tool.id} delay={i * 0.07}>
                  <Link href={tool.href} className="group block h-full">
                    <div className="h-full bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#2563EB]/40 hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] transition-all duration-300">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0F3D5E] to-[#2563EB] flex items-center justify-center mb-4 shadow-sm">
                        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h2 className="text-base font-heading font-semibold text-[#0F3D5E] leading-snug">
                          {tool.title}
                        </h2>
                        <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full">
                          Disponível
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed mb-4">{tool.description}</p>
                      <span className="text-sm font-semibold text-[#2563EB] group-hover:underline">
                        Abrir calculadora →
                      </span>
                    </div>
                  </Link>
                </AnimatedSection>
              );
            }

            return (
              <AnimatedSection key={tool.id} delay={i * 0.07}>
                <div className="h-full bg-white rounded-2xl border border-slate-200 p-6 opacity-60 cursor-not-allowed">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-4 relative">
                    <Icon className="w-5 h-5 text-slate-400" strokeWidth={2} />
                    <Lock className="w-3 h-3 text-slate-400 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" />
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-base font-heading font-semibold text-slate-400 leading-snug">
                      {tool.title}
                    </h2>
                    <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Em Breve
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{tool.description}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </div>
  );
}
