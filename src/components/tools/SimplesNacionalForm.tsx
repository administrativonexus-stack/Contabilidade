"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type SimplesInput } from "@/lib/calculators/simples-nacional";

const formSchema = z.object({
  monthlyRevenue: z.number().min(500, "Receita mínima de R$ 500"),
  annualRevenue: z.number().min(0).optional(),
  anexo: z.enum(["I", "III", "V"] as const),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onChange: (data: SimplesInput) => void;
}

const fieldClass = (hasError?: boolean) =>
  `w-full h-11 px-4 rounded-xl border text-sm text-[#1E293B] bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-colors ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
      : "border-slate-200 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20"
  }`;

export default function SimplesNacionalForm({ onChange }: Props) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { anexo: "III" },
    mode: "onChange",
  });

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      const monthly = Number(value.monthlyRevenue) || 0;
      if (monthly >= 500) {
        onChange({
          monthlyRevenue: monthly,
          annualRevenue: Number(value.annualRevenue) || monthly * 12,
          anexo: value.anexo ?? "III",
        });
      }
    });
    return () => unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="monthlyRevenue" className="block text-sm font-medium text-slate-600 mb-1.5">
          Receita Bruta Mensal (RBM) <span className="text-red-400" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">R$</span>
          <input
            id="monthlyRevenue"
            type="number"
            min="0"
            step="100"
            placeholder="15.000"
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
          Receita Acumulada — últimos 12 meses (RBT12){" "}
          <span className="text-slate-400 font-normal">(opcional)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">R$</span>
          <input
            id="annualRevenue"
            type="number"
            min="0"
            step="1000"
            placeholder="180.000"
            className={`${fieldClass()} pl-10`}
            {...register("annualRevenue", { valueAsNumber: true })}
          />
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Determina a faixa da tabela. Se em branco, usa RBM × 12.
        </p>
      </div>

      <div>
        <label htmlFor="anexo" className="block text-sm font-medium text-slate-600 mb-1.5">
          Tabela (Anexo)
        </label>
        <select id="anexo" className={`${fieldClass()} cursor-pointer`} {...register("anexo")}>
          <option value="III">Anexo III — Serviços (geral)</option>
          <option value="I">Anexo I — Comércio / Varejo</option>
          <option value="V">Anexo V — Serviços especializados</option>
        </select>
        <p className="text-xs text-slate-400 mt-1">
          Dúvidas sobre o anexo correto? Consulte seu contador.
        </p>
      </div>
    </div>
  );
}
