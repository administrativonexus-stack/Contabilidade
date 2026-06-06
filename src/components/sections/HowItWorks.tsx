import AnimatedSection from "@/components/ui/AnimatedSection";
import { HOW_IT_WORKS } from "@/lib/constants";

export default function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-5">
            <span className="w-1 h-1 rounded-full bg-[#2563EB]" />
            Como Funciona
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#0F3D5E] mb-4 leading-tight">
            Simples, rápido e{" "}
            <span className="text-[#2563EB]">sem burocracia</span>
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Do diagnóstico ao suporte contínuo, estamos ao seu lado em cada etapa.
          </p>
        </AnimatedSection>

        <div className="relative">
          {/* Desktop connector */}
          <div
            className="hidden lg:block absolute top-8 left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-5">
            {HOW_IT_WORKS.map((step, i) => (
              <AnimatedSection key={step.step} delay={i * 0.1}>
                <div className="flex lg:flex-col items-start lg:items-center gap-5 lg:gap-4 relative">
                  {/* Mobile connector */}
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div
                      className="lg:hidden absolute left-7 top-16 bottom-0 w-px bg-gradient-to-b from-slate-300 to-transparent -translate-x-1/2"
                      aria-hidden="true"
                    />
                  )}

                  {/* Step circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0F3D5E] to-[#2563EB] flex items-center justify-center shadow-[0_4px_16px_rgba(15,61,94,0.25)]">
                      <span className="text-lg font-heading font-bold text-white">{step.step}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:text-center">
                    <h3 className="text-base font-heading font-semibold text-[#0F3D5E] mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-[220px] lg:max-w-none">
                      {step.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
