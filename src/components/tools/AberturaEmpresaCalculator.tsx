"use client";

import { useState, useCallback } from "react";
import { Building2 } from "lucide-react";
import AberturaEmpresaForm from "./AberturaEmpresaForm";
import AberturaEmpresaResults from "./AberturaEmpresaResults";
import ToolLeadForm from "./ToolLeadForm";
import {
  calculateAbertura,
  STRUCTURE_LABELS,
  type AberturaResult,
  type AberturaInput,
} from "@/lib/calculators/abertura-empresa";

export default function AberturaEmpresaCalculator() {
  const [result, setResult] = useState<AberturaResult | null>(null);
  const [lastInput, setLastInput] = useState<AberturaInput | null>(null);

  const handleChange = useCallback((data: AberturaInput) => {
    setLastInput(data);
    setResult(calculateAbertura(data));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      {/* Left — Form */}
      <div>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F3D5E] to-[#2563EB] flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base font-heading font-semibold text-[#0F3D5E]">Dados da Abertura</h2>
              <p className="text-xs text-slate-400">Preencha para ver os custos estimados</p>
            </div>
          </div>
          <AberturaEmpresaForm onChange={handleChange} />
        </div>
      </div>

      {/* Right — Results */}
      <div>
        {result ? (
          <div className="space-y-6">
            <AberturaEmpresaResults result={result} />

            <div className="bg-[#F8FAFC] rounded-3xl border border-slate-200 p-6 sm:p-8">
              <div className="mb-5">
                <h3 className="text-base font-heading font-semibold text-[#0F3D5E] mb-1">
                  Quer Abrir sua Empresa com Segurança?
                </h3>
                <p className="text-sm text-slate-500">
                  A Nexus cuida de todo o processo de abertura — da Junta Comercial ao CNPJ —
                  e já deixa sua empresa pronta para faturar.
                </p>
              </div>
              <ToolLeadForm
                monthlySalary={lastInput?.monthlyRevenue ?? 0}
                taxRegime={lastInput ? STRUCTURE_LABELS[lastInput.structure] : ""}
                estimatedSavings={0}
              />
            </div>
          </div>
        ) : (
          <div className="bg-[#F8FAFC] rounded-3xl border border-dashed border-slate-300 p-10 flex flex-col items-center justify-center text-center min-h-[320px]">
            <div className="w-14 h-14 rounded-2xl bg-[#0F3D5E]/8 flex items-center justify-center mb-4">
              <Building2 className="w-7 h-7 text-[#0F3D5E]/40" />
            </div>
            <p className="text-sm font-medium text-slate-400">
              Preencha o faturamento esperado ao lado<br />para ver os custos e recomendações
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
