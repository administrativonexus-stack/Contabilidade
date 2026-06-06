"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type AberturaInput } from "@/lib/calculators/abertura-empresa";

const formSchema = z.object({
  monthlyRevenue: z.number().min(500, "Receita mínima de R$ 500"),
  businessType: z.enum(["servicos", "comercio", "industria"] as const),
  partners: z.number().min(1).max(999),
  structure: z.enum(["mei", "slu", "ltda", "sa"] as const),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onChange: (data: AberturaInput) => void;
}

const fieldClass = (hasError?: boolean) =>
  `w-full h-11 px-4 rounded-xl border text-sm text-[#1E293B] bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-colors ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
      : "border-slate-200 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20"
  }`;

export default function AberturaEmpresaForm({ onChange }: Props) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { businessType: "servicos", partners: 1, structure: "ltda" },
    mode: "onChange",
  });

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      const monthly = Number(value.monthlyRevenue) || 0;
      if (monthly >= 500) {
        onChange({
          monthlyRevenue: monthly,
          businessType: value.businessType ?? "servicos",
          partners: Number(value.partners) || 1,
          structure: value.structure ?? "ltda",
        });
      }
    });
    return () => unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="monthlyRevenue" className="block text-sm font-medium text-slate-600 mb-1.5">
          Faturamento Mensal Esperado <span className="text-red-400" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">R$</span>
          <input
            id="monthlyRevenue"
            type="number"
            min="0"
            step="500"
            placeholder="10.000"
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
        <label htmlFor="partners" className="block text-sm font-medium text-slate-600 mb-1.5">
          Número de Sócios
        </label>
        <input
          id="partners"
          type="number"
          min="1"
          max="999"
          step="1"
          placeholder="1"
          className={fieldClass(!!errors.partners)}
          {...register("partners", { valueAsNumber: true })}
        />
        <p className="text-xs text-slate-400 mt-1">
          1 sócio = pode usar SLU ou MEI. 2+ sócios = LTDA obrigatória.
        </p>
      </div>

      <div>
        <label htmlFor="structure" className="block text-sm font-medium text-slate-600 mb-1.5">
          Estrutura Desejada
        </label>
        <select id="structure" className={`${fieldClass()} cursor-pointer`} {...register("structure")}>
          <option value="mei">MEI — Microempreendedor Individual</option>
          <option value="slu">SLU — Sociedade Unipessoal</option>
          <option value="ltda">LTDA — Sociedade Limitada</option>
          <option value="sa">S.A. — Sociedade Anônima</option>
        </select>
        <p className="text-xs text-slate-400 mt-1">
          Os custos são calculados para a estrutura selecionada. A recomendação aparece nos resultados.
        </p>
      </div>
    </div>
  );
}
