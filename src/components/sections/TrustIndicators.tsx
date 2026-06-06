import CounterAnimation from "@/components/ui/CounterAnimation";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { STATS } from "@/lib/constants";

export default function TrustIndicators() {
  return (
    <section
      className="bg-[#F8FAFC] border-y border-slate-200 py-14"
      aria-label="Indicadores de confiança"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {STATS.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.08}>
              <div className={`text-center ${i < STATS.length - 1 ? "lg:border-r lg:border-slate-200" : ""}`}>
                <p
                  className="text-3xl sm:text-4xl font-heading font-bold text-[#0F3D5E] tabular-nums mb-1 tracking-tight"
                  aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
                >
                  <CounterAnimation value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-slate-500 uppercase tracking-wider font-medium">{stat.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
