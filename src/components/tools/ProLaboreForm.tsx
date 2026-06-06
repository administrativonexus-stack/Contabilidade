"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type ProLaboreInput } from "@/lib/calculators/pro-labore";

const formSchema = z.object({
  monthlyProfit: z.number().min(1412, "Lucro mínimo de R$ 1.412"),
  proLabore: z.number().min(1412, "Pró-labore mínimo: R$ 1.412 (salário mínimo)"),
  regime: z.enum(["simples", "presumido", "real"] as const),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onChange: (data: ProLaboreInput) => void;
}

const fieldClass = (hasError?: boolean) =>
  `w-full h-11 px-4 rounded-xl border text-sm text-[#1E293B] bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-colors ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
      : "border-slate-200 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20"
  }`;

export default function ProLaboreForm({ onChange }: Props) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { regime: "simples" },
    mode: "onChange",
  });

  const watched = watch();

  useEffect(() => {
    const profit = Number(watched.monthlyProfit) || 0;
    const proLabore = Number(watched.proLabore) || 0;
    if (profit >= 1412 && proLabore >= 1412) {
      onChange({
        monthlyProfit: profit,
        proLabore,
        regime: watched.regime ?? "simples",
      });
    }
  }, [watched, onChange]);

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="monthlyProfit" className="block text-sm font-medium text-slate-600 mb-1.5">
          Lucro Mensal Disponível <span className="text-red-400" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">R$</span>
          <input
            id="monthlyProfit"
            type="number"
            min="0"
            step="100"
            placeholder="10.000"
            aria-required="true"
            aria-invalid={!!errors.monthlyProfit}
            className={`${fieldClass(!!errors.monthlyProfit)} pl-10`}
            {...register("monthlyProfit", { valueAsNumber: true })}
          />
        </div>
        {errors.monthlyProfit && (
          <p role="alert" className="text-xs text-red-500 mt-1">{errors.monthlyProfit.message}</p>
        )}
        <p className="text-xs text-slate-400 mt-1">
          Valor total disponível para remuneração dos sócios (pró-labore + dividendos)
        </p>
      </div>

      <div>
        <label htmlFor="proLabore" className="block text-sm font-medium text-slate-600 mb-1.5">
          Pró-Labore Atual <span className="text-red-400" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">R$</span>
          <input
            id="proLabore"
            type="number"
            min="1412"
            step="100"
            placeholder="5.000"
            aria-required="true"
            aria-invalid={!!errors.proLabore}
            className={`${fieldClass(!!errors.proLabore)} pl-10`}
            {...register("proLabore", { valueAsNumber: true })}
          />
        </div>
        {errors.proLabore && (
          <p role="alert" className="text-xs text-red-500 mt-1">{errors.proLabore.message}</p>
        )}
        <p className="text-xs text-slate-400 mt-1">
          Mínimo legal: R$ 1.412,00 (salário mínimo 2024)
        </p>
      </div>

      <div>
        <label htmlFor="regime" className="block text-sm font-medium text-slate-600 mb-1.5">
          Regime Tributário
        </label>
        <select id="regime" className={`${fieldClass()} cursor-pointer`} {...register("regime")}>
          <option value="simples">Simples Nacional</option>
          <option value="presumido">Lucro Presumido</option>
          <option value="real">Lucro Real</option>
        </select>
        <p className="text-xs text-slate-400 mt-1">
          Em todos os regimes, os dividendos são isentos de IR para pessoa física.
        </p>
      </div>
    </div>
  );
}
