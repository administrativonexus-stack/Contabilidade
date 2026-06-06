"use client";

import { useState, useCallback } from "react";
import { Users } from "lucide-react";
import ProLaboreForm from "./ProLaboreForm";
import ProLaboreResults from "./ProLaboreResults";
import ToolLeadForm from "./ToolLeadForm";
import {
  calculateProLabore,
  REGIME_LABELS,
  formatBRL,
  type ProLaboreResult,
  type ProLaboreInput,
} from "@/lib/calculators/pro-labore";

export default function ProLaboreCalculator() {
  const [result, setResult] = useState<ProLaboreResult | null>(null);
  const [lastInput, setLastInput] = useState<ProLaboreInput | null>(null);

  const handleChange = useCallback((data: ProLaboreInput) => {
    setLastInput(data);
    setResult(calculateProLabore(data));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      {/* Left — Form */}
      <div>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F3D5E] to-[#2563EB] flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base font-heading font-semibold text-[#0F3D5E]">Dados do Sócio</h2>
              <p className="text-xs text-slate-400">Preencha para simular o cenário otimizado</p>
            </div>
          </div>
          <ProLaboreForm onChange={handleChange} />
        </div>
      </div>

      {/* Right — Results */}
      <div>
        {result ? (
          <div className="space-y-6">
            <ProLaboreResults result={result} />

            <div className="bg-[#F8FAFC] rounded-3xl border border-slate-200 p-6 sm:p-8">
              <div className="mb-5">
                <h3 className="text-base font-heading font-semibold text-[#0F3D5E] mb-1">
                  Quer Implementar a Otimização?
                </h3>
                <p className="text-sm text-slate-500">
                  {result.annualSavings > 0
                    ? `Nossos especialistas estruturam a distribuição de ${formatBRL(result.annualSavings)} em dividendos por ano de forma segura e legal.`
                    : "Nossos especialistas revisam sua estrutura de remuneração e identificam oportunidades."}
                </p>
              </div>
              <ToolLeadForm
                monthlySalary={lastInput?.monthlyProfit ?? 0}
                taxRegime={lastInput ? REGIME_LABELS[lastInput.regime] : ""}
                estimatedSavings={result.annualSavings}
              />
            </div>
          </div>
        ) : (
          <div className="bg-[#F8FAFC] rounded-3xl border border-dashed border-slate-300 p-10 flex flex-col items-center justify-center text-center min-h-[320px]">
            <div className="w-14 h-14 rounded-2xl bg-[#0F3D5E]/8 flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-[#0F3D5E]/40" />
            </div>
            <p className="text-sm font-medium text-slate-400">
              Preencha o lucro e o pró-labore ao lado<br />para ver o cenário otimizado
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
