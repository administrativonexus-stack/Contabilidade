"use client";

import { useState, useCallback } from "react";
import { Calculator } from "lucide-react";
import CalculatorForm from "./CalculatorForm";
import ResultsDashboard from "./ResultsDashboard";
import ToolLeadForm from "./ToolLeadForm";
import { calculateCltVsPj, type CltVsPjResult, type CltVsPjInput, TAX_REGIME_LABELS } from "@/lib/calculators/clt-vs-pj";

export default function CltVsPjCalculator() {
  const [result, setResult] = useState<CltVsPjResult | null>(null);
  const [lastInput, setLastInput] = useState<CltVsPjInput | null>(null);

  const handleChange = useCallback((data: CltVsPjInput) => {
    setLastInput(data);
    setResult(calculateCltVsPj(data));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      {/* Left — Form */}
      <div>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F3D5E] to-[#2563EB] flex items-center justify-center flex-shrink-0">
              <Calculator className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base font-heading font-semibold text-[#0F3D5E]">Dados da Contratação</h2>
              <p className="text-xs text-slate-400">Preencha para ver os resultados em tempo real</p>
            </div>
          </div>
          <CalculatorForm onChange={handleChange} />
        </div>
      </div>

      {/* Right — Results */}
      <div>
        {result ? (
          <div className="space-y-6">
            <ResultsDashboard result={result} />

            {/* Lead form */}
            <div className="bg-[#F8FAFC] rounded-3xl border border-slate-200 p-6 sm:p-8">
              <div className="mb-5">
                <h3 className="text-base font-heading font-semibold text-[#0F3D5E] mb-1">
                  Quer uma Análise Tributária Personalizada?
                </h3>
                <p className="text-sm text-slate-500">
                  Nossos especialistas analisam seu caso específico e identificam oportunidades reais de economia.
                </p>
              </div>
              <ToolLeadForm
                monthlySalary={lastInput?.salary ?? 0}
                taxRegime={lastInput ? TAX_REGIME_LABELS[lastInput.regime] : ""}
                estimatedSavings={result.annualSavings}
              />
            </div>
          </div>
        ) : (
          <div className="bg-[#F8FAFC] rounded-3xl border border-dashed border-slate-300 p-10 flex flex-col items-center justify-center text-center min-h-[320px]">
            <div className="w-14 h-14 rounded-2xl bg-[#0F3D5E]/8 flex items-center justify-center mb-4">
              <Calculator className="w-7 h-7 text-[#0F3D5E]/40" />
            </div>
            <p className="text-sm font-medium text-slate-400">
              Preencha o salário ao lado para ver<br />os resultados em tempo real
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
