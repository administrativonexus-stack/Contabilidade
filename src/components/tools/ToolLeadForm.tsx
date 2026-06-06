"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toolLeadSchema, type ToolLeadFormData } from "@/lib/validations";
import { formatBRL } from "@/lib/calculators/clt-vs-pj";

type FormState = "idle" | "loading" | "success" | "error";

interface Props {
  monthlySalary: number;
  taxRegime: string;
  estimatedSavings: number;
}

const inputClass = (hasError: boolean) =>
  `w-full h-11 px-4 rounded-xl border text-sm text-[#1E293B] bg-white placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-1 ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
      : "border-slate-200 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20"
  }`;

export default function ToolLeadForm({ monthlySalary, taxRegime, estimatedSavings }: Props) {
  const [formState, setFormState] = useState<FormState>("idle");

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ToolLeadFormData>({
    resolver: zodResolver(toolLeadSchema),
  });

  const onSubmit = async (data: ToolLeadFormData) => {
    setFormState("loading");
    try {
      const res = await fetch("/api/tool-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, monthlySalary, taxRegime, estimatedSavings }),
      });
      if (!res.ok) throw new Error();
      setFormState("success");
      reset();
    } catch {
      setFormState("error");
    }
  };

  if (formState === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-14 h-14 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-[#10B981]" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-[#0F3D5E] mb-2">Obrigado!</h3>
        <p className="text-sm text-slate-500">Um especialista entrará em contato em breve.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Formulário de análise tributária">
      {estimatedSavings > 0 && (
        <p className="text-sm text-slate-500 mb-4">
          Nossa equipe vai analisar se a economia estimada de{" "}
          <strong className="text-[#10B981]">{formatBRL(estimatedSavings)}/ano</strong>{" "}
          se aplica ao seu caso específico.
        </p>
      )}

      {formState === "error" && (
        <div role="alert" className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">Erro ao enviar. Tente novamente.</p>
        </div>
      )}

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="lead-name" className="block text-sm font-medium text-slate-600 mb-1.5">
              Nome completo <span className="text-red-400" aria-hidden="true">*</span>
            </label>
            <input id="lead-name" type="text" autoComplete="name" placeholder="Seu nome"
              aria-required="true" aria-invalid={!!errors.name}
              className={inputClass(!!errors.name)} {...register("name")} />
            {errors.name && <p role="alert" className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="lead-company" className="block text-sm font-medium text-slate-600 mb-1.5">
              Empresa <span className="text-red-400" aria-hidden="true">*</span>
            </label>
            <input id="lead-company" type="text" autoComplete="organization" placeholder="Nome da empresa"
              aria-required="true" aria-invalid={!!errors.company}
              className={inputClass(!!errors.company)} {...register("company")} />
            {errors.company && <p role="alert" className="text-xs text-red-500 mt-1">{errors.company.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="lead-email" className="block text-sm font-medium text-slate-600 mb-1.5">
              E-mail <span className="text-red-400" aria-hidden="true">*</span>
            </label>
            <input id="lead-email" type="email" autoComplete="email" placeholder="seu@email.com"
              aria-required="true" aria-invalid={!!errors.email}
              className={inputClass(!!errors.email)} {...register("email")} />
            {errors.email && <p role="alert" className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="lead-whatsapp" className="block text-sm font-medium text-slate-600 mb-1.5">
              WhatsApp <span className="text-red-400" aria-hidden="true">*</span>
            </label>
            <input id="lead-whatsapp" type="tel" autoComplete="tel" placeholder="(11) 99999-9999"
              aria-required="true" aria-invalid={!!errors.whatsapp}
              className={inputClass(!!errors.whatsapp)} {...register("whatsapp")} />
            {errors.whatsapp && <p role="alert" className="text-xs text-red-500 mt-1">{errors.whatsapp.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="lead-employees" className="block text-sm font-medium text-slate-600 mb-1.5">
            Nº de funcionários <span className="text-red-400" aria-hidden="true">*</span>
          </label>
          <select id="lead-employees" aria-required="true" aria-invalid={!!errors.employees}
            defaultValue="" className={`${inputClass(!!errors.employees)} cursor-pointer`}
            {...register("employees")}>
            <option value="" disabled>Selecione</option>
            <option value="1">1 funcionário</option>
            <option value="2-5">2 a 5 funcionários</option>
            <option value="6-20">6 a 20 funcionários</option>
            <option value="21-50">21 a 50 funcionários</option>
            <option value="50+">Mais de 50 funcionários</option>
          </select>
          {errors.employees && <p role="alert" className="text-xs text-red-500 mt-1">{errors.employees.message}</p>}
        </div>

        <button
          type="submit"
          disabled={formState === "loading"}
          className="w-full h-11 rounded-xl bg-[#0F3D5E] text-white font-heading font-semibold text-sm hover:bg-[#1a4f75] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mt-1"
          aria-live="polite"
        >
          {formState === "loading"
            ? <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />Enviando...</>
            : "Solicitar Análise Gratuita"}
        </button>
      </div>
    </form>
  );
}
