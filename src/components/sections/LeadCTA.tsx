"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { leadSchema, type LeadFormData } from "@/lib/validations";
import { REVENUE_OPTIONS } from "@/lib/constants";

type FormState = "idle" | "loading" | "success" | "error";

export default function LeadCTA() {
  const [formState, setFormState] = useState<FormState>("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({ resolver: zodResolver(leadSchema) });

  const onSubmit = async (data: LeadFormData) => {
    setFormState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setFormState("success");
      reset();
    } catch {
      setFormState("error");
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full h-12 px-4 rounded-xl border text-sm text-[#1E293B] bg-white placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-[#0F3D5E]/30 ${
      hasError
        ? "border-red-400 focus:border-red-400"
        : "border-slate-200 focus:border-[#0F3D5E]"
    }`;

  return (
    <section id="contato" className="py-20 lg:py-28 bg-[#0F3D5E] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#2563EB] opacity-[0.15] blur-[100px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-white opacity-[0.04] blur-[80px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left */}
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 px-3 py-1.5 rounded-full mb-6">
              <span className="w-1 h-1 rounded-full bg-[#10B981]" />
              Fale com um Especialista
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white mb-6 leading-[1.1]">
              Pronto para modernizar sua{" "}
              <span className="text-[#10B981]">contabilidade?</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Agende uma consultoria gratuita. Nossos especialistas vão analisar
              sua situação e apresentar a melhor solução para o seu negócio.
            </p>
            <ul className="space-y-3">
              {[
                "Diagnóstico gratuito e sem compromisso",
                "Proposta personalizada para sua empresa",
                "Resposta em até 24 horas úteis",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          {/* Right — Form */}
          <AnimatedSection delay={0.15}>
            <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.2)]">
              {formState === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-14 h-14 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-7 h-7 text-[#10B981]" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-[#0F3D5E] mb-2">
                    Solicitação enviada!
                  </h3>
                  <p className="text-slate-500 text-sm mb-6">
                    Entraremos em contato em até 24 horas úteis.
                  </p>
                  <button
                    onClick={() => setFormState("idle")}
                    className="text-sm text-[#2563EB] font-semibold hover:underline"
                  >
                    Enviar outra solicitação
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Formulário de consultoria">
                  <h3 className="text-xl font-heading font-semibold text-[#0F3D5E] mb-6">
                    Solicitar Consultoria Gratuita
                  </h3>

                  {formState === "error" && (
                    <div role="alert" aria-live="assertive" className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-600">
                        Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1.5">
                        Nome completo <span className="text-red-400" aria-hidden="true">*</span>
                      </label>
                      <input id="name" type="text" autoComplete="name" placeholder="Seu nome" aria-required="true" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} className={inputClass(!!errors.name)} {...register("name")} />
                      {errors.name && <p id="name-error" role="alert" className="text-xs text-red-500 mt-1.5">{errors.name.message}</p>}
                    </div>

                    {/* Company */}
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-slate-600 mb-1.5">
                        Empresa <span className="text-red-400" aria-hidden="true">*</span>
                      </label>
                      <input id="company" type="text" autoComplete="organization" placeholder="Nome da sua empresa" aria-required="true" aria-invalid={!!errors.company} aria-describedby={errors.company ? "company-error" : undefined} className={inputClass(!!errors.company)} {...register("company")} />
                      {errors.company && <p id="company-error" role="alert" className="text-xs text-red-500 mt-1.5">{errors.company.message}</p>}
                    </div>

                    {/* Email + Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1.5">
                          E-mail <span className="text-red-400" aria-hidden="true">*</span>
                        </label>
                        <input id="email" type="email" autoComplete="email" placeholder="seu@email.com" aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} className={inputClass(!!errors.email)} {...register("email")} />
                        {errors.email && <p id="email-error" role="alert" className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-600 mb-1.5">
                          Telefone <span className="text-red-400" aria-hidden="true">*</span>
                        </label>
                        <input id="phone" type="tel" autoComplete="tel" placeholder="(11) 99999-9999" aria-required="true" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} className={inputClass(!!errors.phone)} {...register("phone")} />
                        {errors.phone && <p id="phone-error" role="alert" className="text-xs text-red-500 mt-1.5">{errors.phone.message}</p>}
                      </div>
                    </div>

                    {/* Revenue */}
                    <div>
                      <label htmlFor="revenue" className="block text-sm font-medium text-slate-600 mb-1.5">
                        Faturamento mensal <span className="text-red-400" aria-hidden="true">*</span>
                      </label>
                      <select id="revenue" aria-required="true" aria-invalid={!!errors.revenue} aria-describedby={errors.revenue ? "revenue-error" : undefined} className={`${inputClass(!!errors.revenue)} cursor-pointer`} defaultValue="" {...register("revenue")}>
                        <option value="" disabled>Selecione uma faixa</option>
                        {REVENUE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {errors.revenue && <p id="revenue-error" role="alert" className="text-xs text-red-500 mt-1.5">{errors.revenue.message}</p>}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={formState === "loading"}
                      className="w-full h-12 rounded-xl bg-[#0F3D5E] text-white font-heading font-semibold text-sm hover:bg-[#1a4f75] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mt-2"
                      aria-live="polite"
                    >
                      {formState === "loading" ? (
                        <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />Enviando...</>
                      ) : (
                        "Solicitar Consultoria Gratuita"
                      )}
                    </button>

                    <p className="text-[11px] text-slate-400 text-center">
                      Seus dados estão seguros. Não fazemos spam.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
