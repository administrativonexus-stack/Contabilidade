"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, MessageCircle, TrendingUp, PieChart, DollarSign, BarChart3 } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function DashboardMockup() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(15,61,94,0.12),0_4px_16px_rgba(15,61,94,0.06)] overflow-hidden border border-slate-100"
      >
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-[#0F3D5E] flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-semibold text-[#0F3D5E] font-heading">Painel Financeiro</span>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-[#10B981] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Atualizado
          </span>
        </div>

        <div className="p-5">
          {/* Revenue metric */}
          <div className="mb-5">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-medium">
              Receita Bruta · Jun/25
            </p>
            <div className="flex items-end justify-between mb-2">
              <p className="text-3xl font-heading font-bold text-[#0F3D5E] tabular-nums tracking-tight">
                R$ 284.500
              </p>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" /> +12,4%
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#0F3D5E] to-[#2563EB] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "72%" }}
                transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">72% da meta mensal</p>
          </div>

          {/* Metric grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: "DRE", value: "R$ 45k", icon: PieChart, color: "#2563EB", bg: "bg-blue-50" },
              { label: "Impostos", value: "R$ 28k", icon: DollarSign, color: "#0F3D5E", bg: "bg-slate-50" },
              { label: "Margem", value: "31,2%", icon: BarChart3, color: "#10B981", bg: "bg-emerald-50" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
                className={`${item.bg} rounded-xl p-3 border border-white`}
              >
                <item.icon className="w-3.5 h-3.5 mb-1.5" style={{ color: item.color }} strokeWidth={2} />
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">{item.label}</p>
                <p className="text-sm font-heading font-bold text-[#0F3D5E] tabular-nums">{item.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Micro bar chart */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-end gap-1 h-8">
              {[35, 52, 44, 61, 48, 72, 65, 80, 71, 88, 76, 92].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-sm bg-[#2563EB]/20"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 1.2 + i * 0.04, duration: 0.3, ease: "easeOut" }}
                  style={{ height: `${h}%`, transformOrigin: "bottom" }}
                />
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Últimos 12 meses</p>
          </div>
        </div>
      </motion.div>

      {/* Floating notification */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 1.5 }}
        className="absolute -bottom-4 -right-3 bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg"
      >
        <span className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-4 h-4 text-[#10B981]" />
        </span>
        <div>
          <p className="text-xs font-semibold text-[#0F3D5E]">DARF gerado</p>
          <p className="text-[11px] text-slate-400">Agora mesmo</p>
        </div>
      </motion.div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 1.7 }}
        className="absolute -top-3 -left-3 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 flex items-center gap-2 shadow-lg"
      >
        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
        <p className="text-xs font-semibold text-[#0F3D5E] whitespace-nowrap">
          500+ empresas ativas
        </p>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const cv = shouldReduceMotion ? undefined : containerVariants;
  const iv = shouldReduceMotion ? undefined : itemVariants;

  return (
    <section className="relative min-h-dvh flex items-center pt-20 pb-16 overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-white to-[#EFF6FF]">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#2563EB] opacity-[0.04] blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#0F3D5E] opacity-[0.04] blur-[80px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            variants={cv}
            initial={shouldReduceMotion ? false : "hidden"}
            animate="visible"
          >
            <motion.div
              variants={iv}
              className="inline-flex items-center gap-2 bg-[#0F3D5E]/8 border border-[#0F3D5E]/20 rounded-full px-4 py-1.5 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-xs font-semibold text-[#0F3D5E] uppercase tracking-wide">
                Contabilidade Digital para Empresas
              </span>
            </motion.div>

            <motion.h1
              variants={iv}
              className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-heading font-bold text-[#0F3D5E] leading-[1.08] tracking-tight mb-5"
            >
              Contabilidade{" "}
              <span className="text-[#2563EB]">Moderna</span>{" "}
              Para Empresas{" "}
              <span className="text-[#0F3D5E]">Prontas Para Crescer.</span>
            </motion.h1>

            <motion.p
              variants={iv}
              className="text-lg text-slate-500 leading-relaxed mb-8 max-w-[480px]"
            >
              Serviços completos de contabilidade, fiscal e gestão financeira
              com tecnologia de ponta e suporte especializado.
            </motion.p>

            <motion.div
              variants={iv}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="#contato"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0F3D5E] text-white font-semibold text-sm hover:bg-[#1a4f75] transition-colors duration-200"
              >
                Consultoria Gratuita
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#10B981] text-[#10B981] font-semibold text-sm hover:bg-[#10B981]/8 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                Falar no WhatsApp
              </a>
            </motion.div>

            <motion.div
              variants={iv}
              className="flex items-center gap-8 mt-10 pt-8 border-t border-slate-200"
            >
              {[
                { value: "500+", label: "Empresas" },
                { value: "10+", label: "Anos" },
                { value: "98%", label: "Satisfação" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-heading font-bold text-[#0F3D5E] tabular-nums">{stat.value}</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Dashboard */}
          <div className="relative flex justify-center lg:justify-end">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
