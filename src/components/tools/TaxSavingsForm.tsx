"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type TaxSavingsInput } from "@/lib/calculators/tax-savings";

const formSchema = z.object({
  monthlyRevenue: z.number().min(1000, "Receita mínima de R$ 1.000"),
  annualRevenue: z.number().min(0).optional(),
  businessType: z.enum(["servicos", "comercio", "industria"] as const),
  profitMargin: z.number().min(1).max(99).optional(),
  currentRegime: z.enum(["simples", "presumido", "real"] as const),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onChange: (data: TaxSavingsInput) => void;
}

const fieldClass = (hasError?: boolean) =>
  `w-full h-11 px-4 rounded-xl border text-sm text-[#1E293B] bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-colors ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
      : "border-slate-200 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20"
  }`;

export default function TaxSavingsForm({ onChange }: Props) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { businessType: "servicos", currentRegime: "simples", profitMargin: 20 },
    mode: "onChange",
  });

  const watched = watch();

  useEffect(() => {
    const monthly = Number(watched.monthlyRevenue) || 0;
    if (monthly >= 1000) {
      onChange({
        monthlyRevenue: monthly,
        annualRevenue: Number(watched.annualRevenue) || monthly * 12,
        businessType: watched.businessType ?? "servicos",
        profitMargin: Number(watched.profitMargin) || 20,
        currentRegime: watched.currentRegime ?? "simples",
      });
    }
  }, [watched, onChange]);

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="monthlyRevenue" className="block text-sm font-medium text-slate-600 mb-1.5">
          Receita Bruta Mensal <span className="text-red-400" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">R$</span>
          <input
            id="monthlyRevenue"
            type="number"
            min="0"
            step="100"
            placeholder="20.000"
            aria-required="true"
            aria-invalid={!!errors.monthlyRevenue}
            className={`${fieldClass(!!errors.monthlyRevenue)} pl-10`}
            {...register("monthlyRevenue", { valueAsNumber: true })}
          />
        </div>
        {errors.monthlyRevenue && (
          <p role="alert" className="text-xs text-red-500 mt-1">{errors.monthlyRevenue.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="annualRevenue" className="block text-sm font-medium text-slate-600 mb-1.5">
          Receita Acumulada (últimos 12 meses){" "}
          <span className="text-slate-400 font-normal">(opcional)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">R$</span>
          <input
            id="annualRevenue"
            type="number"
            min="0"
            step="1000"
            placeholder="Deixe em branco para usar mensal × 12"
            className={`${fieldClass()} pl-10`}
            {...register("annualRevenue", { valueAsNumber: true })}
          />
        </div>
        <p className="text-xs text-slate-400 mt-1">Usado para calcular a alíquota efetiva do Simples Nacional</p>
      </div>

      <div>
        <label htmlFor="businessType" className="block text-sm font-medium text-slate-600 mb-1.5">
          Tipo de Atividade
        </label>
        <select id="businessType" className={`${fieldClass()} cursor-pointer`} {...register("businessType")}>
          <option value="servicos">Prestação de Serviços</option>
          <option value="comercio">Comércio / Varejo</option>
          <option value="industria">Indústria / Fabricação</option>
        </select>
      </div>

      <div>
        <label htmlFor="profitMargin" className="block text-sm font-medium text-slate-600 mb-1.5">
          Margem de Lucro Estimada <span className="text-slate-400 font-normal">(para Lucro Real)</span>
        </label>
        <div className="relative">
          <input
            id="profitMargin"
            type="number"
            min="1"
            max="99"
            step="1"
            placeholder="20"
            className={`${fieldClass()} pr-10`}
            {...register("profitMargin", { valueAsNumber: true })}
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">%</span>
        </div>
      </div>

      <div>
        <label htmlFor="currentRegime" className="block text-sm font-medium text-slate-600 mb-1.5">
          Regime Atual
        </label>
        <select id="currentRegime" className={`${fieldClass()} cursor-pointer`} {...register("currentRegime")}>
          <option value="simples">Simples Nacional</option>
          <option value="presumido">Lucro Presumido</option>
          <option value="real">Lucro Real</option>
        </select>
      </div>
    </div>
  );
}
