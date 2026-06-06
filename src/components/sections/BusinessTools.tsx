import Link from "next/link";
import { Calculator, TrendingDown, Receipt, Users, Building2, Lock, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { TOOLS } from "@/lib/constants";

const iconMap = {
  Calculator, TrendingDown, Receipt, Users, Building2,
} as const;

type IconName = keyof typeof iconMap;

export default function BusinessTools() {
  return (
    <section id="ferramentas" className="py-20 lg:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-5">
            <span className="w-1 h-1 rounded-full bg-[#2563EB]" />
            Ferramentas Gratuitas
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#0F3D5E] mb-4 leading-tight">
            Ferramentas para Decisões{" "}
            <span className="text-[#2563EB]">Financeiras Mais Inteligentes</span>
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Calculadoras interativas criadas para ajudar empresários a reduzir custos,
            entender impostos e tomar melhores decisões de negócio.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {TOOLS.map((tool, i) => {
            const Icon = iconMap[tool.icon as IconName] ?? Calculator;
            const available = tool.available;

            if (available) {
              return (
                <AnimatedSection key={tool.id} delay={i * 0.07}>
                  <Link href={tool.href} className="group block h-full">
                    <div className="h-full bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#2563EB]/40 hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F3D5E] to-[#2563EB] flex items-center justify-center mb-3 shadow-sm">
                        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="text-sm font-heading font-semibold text-[#0F3D5E] leading-snug">
                          {tool.title}
                        </h3>
                        <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full">
                          Novo
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">{tool.description}</p>
                      <span className="text-xs font-semibold text-[#2563EB] group-hover:underline">
                        Abrir calculadora →
                      </span>
                    </div>
                  </Link>
                </AnimatedSection>
              );
            }

            return (
              <AnimatedSection key={tool.id} delay={i * 0.07}>
                <div className="h-full bg-white rounded-2xl border border-slate-200 border-dashed p-5 opacity-55">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-3 relative">
                    <Icon className="w-5 h-5 text-slate-300" strokeWidth={2} />
                    <Lock className="w-3 h-3 text-slate-300 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" />
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="text-sm font-heading font-semibold text-slate-400 leading-snug">
                      {tool.title}
                    </h3>
                    <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Em Breve
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{tool.description}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        <AnimatedSection className="text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#0F3D5E] text-[#0F3D5E] font-semibold text-sm hover:bg-[#0F3D5E] hover:text-white transition-all duration-200"
          >
            Ver todas as ferramentas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
