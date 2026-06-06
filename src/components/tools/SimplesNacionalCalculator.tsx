"use client";

import { useState, useCallback } from "react";
import { Receipt } from "lucide-react";
import SimplesNacionalForm from "./SimplesNacionalForm";
import SimplesNacionalResults from "./SimplesNacionalResults";
import ToolLeadForm from "./ToolLeadForm";
import {
  calculateSimples,
  ANEXO_LABELS,
  formatBRL,
  type SimplesResult,
  type SimplesInput,
} from "@/lib/calculators/simples-nacional";

export default function SimplesNacionalCalculator() {
  const [result, setResult] = useState<SimplesResult | null>(null);
  const [lastInput, setLastInput] = useState<SimplesInput | null>(null);

  const handleChange = useCallback((data: SimplesInput) => {
    setLastInput(data);
    setResult(calculateSimples(data));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      {/* Left — Form */}
      <div>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F3D5E] to-[#2563EB] flex items-center justify-center flex-shrink-0">
              <Receipt className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base font-heading font-semibold text-[#0F3D5E]">Dados da Empresa</h2>
              <p className="text-xs text-slate-400">Preencha para calcular o DAS em tempo real</p>
            </div>
          </div>
          <SimplesNacionalForm onChange={handleChange} />
        </div>
      </div>

      {/* Right — Results */}
      <div>
        {result ? (
          <div className="space-y-6">
            <SimplesNacionalResults result={result} />

            <div className="bg-[#F8FAFC] rounded-3xl border border-slate-200 p-6 sm:p-8">
              <div className="mb-5">
                <h3 className="text-base font-heading font-semibold text-[#0F3D5E] mb-1">
                  Precisa de Apoio com o Simples?
                </h3>
                <p className="text-sm text-slate-500">
                  {result.das > 0
                    ? `Nossos especialistas revisam seu ${lastInput ? ANEXO_LABELS[lastInput.anexo] : "regime"} e identificam oportunidades de economia no seu DAS de ${formatBRL(result.das)}/mês.`
                    : "Nossos especialistas otimizam sua gestão no Simples Nacional."}
                </p>
              </div>
              <ToolLeadForm
                monthlySalary={lastInput?.monthlyRevenue ?? 0}
                taxRegime={lastInput ? ANEXO_LABELS[lastInput.anexo] : ""}
                estimatedSavings={result.annualDas}
              />
            </div>
          </div>
        ) : (
          <div className="bg-[#F8FAFC] rounded-3xl border border-dashed border-slate-300 p-10 flex flex-col items-center justify-center text-center min-h-[320px]">
            <div className="w-14 h-14 rounded-2xl bg-[#0F3D5E]/8 flex items-center justify-center mb-4">
              <Receipt className="w-7 h-7 text-[#0F3D5E]/40" />
            </div>
            <p className="text-sm font-medium text-slate-400">
              Preencha a receita ao lado para ver<br />seu DAS mensal estimado
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
