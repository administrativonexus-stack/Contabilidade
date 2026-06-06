"use client";

import { motion } from "framer-motion";
import {
  Building2, BookOpen, Receipt, Users, Calculator, TrendingUp,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { SERVICES } from "@/lib/constants";

const iconMap = {
  Building2, BookOpen, Receipt, Users, Calculator, TrendingUp,
} as const;

type IconName = keyof typeof iconMap;

export default function Services() {
  return (
    <section id="servicos" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-5">
            <span className="w-1 h-1 rounded-full bg-[#2563EB]" />
            Nossos Serviços
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#0F3D5E] mb-4 leading-tight">
            Solução completa para a{" "}
            <span className="text-[#2563EB]">gestão da sua empresa</span>
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            De ponta a ponta, cuidamos de toda a burocracia para você focar no que importa — crescer.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((service, i) => {
            const Icon = iconMap[service.icon as IconName];
            return (
              <AnimatedSection key={service.id} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="group h-full bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#2563EB]/30 hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] transition-all duration-300 cursor-default"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-4 group-hover:bg-[#0F3D5E] transition-colors duration-300">
                    {Icon && (
                      <Icon
                        className="w-5 h-5 text-[#2563EB] group-hover:text-white transition-colors duration-300"
                        strokeWidth={2}
                      />
                    )}
                  </div>
                  <h3 className="text-base font-heading font-semibold text-[#0F3D5E] mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
