"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type CltVsPjInput } from "@/lib/calculators/clt-vs-pj";

const formSchema = z.object({
  salary: z.number().min(100, "Salário mínimo de R$ 100"),
  transportation: z.number().min(0).optional(),
  meal: z.number().min(0).optional(),
  health: z.number().min(0).optional(),
  regime: z.enum(["simples", "presumido", "real"] as const),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onChange: (data: CltVsPjInput) => void;
}

const fieldClass = (hasError?: boolean) =>
  `w-full h-11 px-4 rounded-xl border text-sm text-[#1E293B] bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-colors ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
      : "border-slate-200 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20"
  }`;

export default function CalculatorForm({ onChange }: Props) {
  const { register, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { regime: "simples" },
    mode: "onChange",
  });

  const watched = watch();

  useEffect(() => {
    const salary = Number(watched.salary) || 0;
    if (salary >= 100) {
      onChange({
        salary,
        transportation: Number(watched.transportation) || 0,
        meal: Number(watched.meal) || 0,
        health: Number(watched.health) || 0,
        regime: watched.regime ?? "simples",
      });
    }
  }, [watched, onChange]);

  return (
    <div className="space-y-5">
      {/* Salary */}
      <div>
        <label htmlFor="salary" className="block text-sm font-medium text-slate-600 mb-1.5">
          Salário Mensal <span className="text-red-400" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">R$</span>
          <input
            id="salary"
            type="number"
            min="0"
            step="0.01"
            placeholder="5.000"
            aria-required="true"
            aria-invalid={!!errors.salary}
            className={`${fieldClass(!!errors.salary)} pl-10`}
            {...register("salary", { valueAsNumber: true })}
          />
        </div>
        {errors.salary && <p role="alert" className="text-xs text-red-500 mt-1">{errors.salary.message}</p>}
      </div>

      {/* Benefits */}
      <div>
        <p className="text-sm font-medium text-slate-600 mb-3">
          Benefícios Mensais <span className="text-slate-400 font-normal">(opcionais)</span>
        </p>
        <div className="space-y-3">
          {[
            { id: "transportation", label: "Vale Transporte", key: "transportation" as const },
            { id: "meal", label: "Vale Refeição / Alimentação", key: "meal" as const },
            { id: "health", label: "Plano de Saúde", key: "health" as const },
          ].map(({ id, label, key }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm text-slate-500 mb-1.5">{label}</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">R$</span>
                <input
                  id={id}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  className={`${fieldClass()} pl-10`}
                  {...register(key, { valueAsNumber: true })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Regime */}
      <div>
        <label htmlFor="regime" className="block text-sm font-medium text-slate-600 mb-1.5">
          Regime Tributário da Empresa
        </label>
        <select
          id="regime"
          className={`${fieldClass()} cursor-pointer`}
          {...register("regime")}
        >
          <option value="simples">Simples Nacional</option>
          <option value="presumido">Lucro Presumido</option>
          <option value="real">Lucro Real</option>
        </select>
      </div>
    </div>
  );
}
