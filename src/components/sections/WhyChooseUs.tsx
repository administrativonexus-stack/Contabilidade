"use client";

import { motion } from "framer-motion";
import {
  MessageCircle, LayoutDashboard, FileSignature, BarChart3, Briefcase, Shield,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { WHY_CHOOSE_US } from "@/lib/constants";

const iconMap = {
  MessageCircle, LayoutDashboard, FileSignature, BarChart3, Briefcase, Shield,
} as const;

type IconName = keyof typeof iconMap;

export default function WhyChooseUs() {
  return (
    <section id="sobre" className="py-20 lg:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#0F3D5E] bg-[#0F3D5E]/8 border border-[#0F3D5E]/15 px-3 py-1.5 rounded-full mb-5">
            <span className="w-1 h-1 rounded-full bg-[#0F3D5E]" />
            Por que a Nexus
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#0F3D5E] mb-4 leading-tight">
            Tecnologia e expertise{" "}
            <span className="text-[#2563EB]">em um só lugar</span>
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Combinamos contadores experientes com ferramentas digitais modernas para
            entregar uma experiência sem precedentes na contabilidade.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WHY_CHOOSE_US.map((feature, i) => {
            const Icon = iconMap[feature.icon as IconName];
            return (
              <AnimatedSection key={feature.title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-4 bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#2563EB]/30 hover:shadow-[0_8px_24px_rgba(37,99,235,0.07)] transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F3D5E] to-[#2563EB] flex items-center justify-center flex-shrink-0 shadow-sm">
                    {Icon && <Icon className="w-5 h-5 text-white" strokeWidth={2} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-heading font-semibold text-[#0F3D5E] mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
