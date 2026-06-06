"use client";

import { useState, useCallback } from "react";
import { TrendingDown } from "lucide-react";
import TaxSavingsForm from "./TaxSavingsForm";
import TaxSavingsResults from "./TaxSavingsResults";
import ToolLeadForm from "./ToolLeadForm";
import {
  calculateTaxSavings,
  formatBRL,
  type TaxSavingsResult,
  type TaxSavingsInput,
} from "@/lib/calculators/tax-savings";

export default function TaxSavingsCalculator() {
  const [result, setResult] = useState<TaxSavingsResult | null>(null);
  const [lastInput, setLastInput] = useState<TaxSavingsInput | null>(null);

  const handleChange = useCallback((data: TaxSavingsInput) => {
    setLastInput(data);
    setResult(calculateTaxSavings(data));
  }, []);

  const regimeLabel =
    lastInput?.currentRegime === "simples"
      ? "Simples Nacional"
      : lastInput?.currentRegime === "presumido"
      ? "Lucro Presumido"
      : "Lucro Real";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      {/* Left — Form */}
      <div>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F3D5E] to-[#2563EB] flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base font-heading font-semibold text-[#0F3D5E]">Dados da Empresa</h2>
              <p className="text-xs text-slate-400">Preencha para comparar os regimes em tempo real</p>
            </div>
          </div>
          <TaxSavingsForm onChange={handleChange} />
        </div>
      </div>

      {/* Right — Results */}
      <div>
        {result ? (
          <div className="space-y-6">
            <TaxSavingsResults result={result} />

            <div className="bg-[#F8FAFC] rounded-3xl border border-slate-200 p-6 sm:p-8">
              <div className="mb-5">
                <h3 className="text-base font-heading font-semibold text-[#0F3D5E] mb-1">
                  Quer Mudar de Regime com Segurança?
                </h3>
                <p className="text-sm text-slate-500">
                  {result.annualSavings > 0
                    ? `Nossos especialistas podem economizar até ${formatBRL(result.annualSavings)} por ano na sua empresa.`
                    : "Nossos especialistas analisam seu caso e identificam oportunidades reais de economia."}
                </p>
              </div>
              <ToolLeadForm
                monthlySalary={lastInput?.monthlyRevenue ?? 0}
                taxRegime={regimeLabel}
                estimatedSavings={result.annualSavings}
              />
            </div>
          </div>
        ) : (
          <div className="bg-[#F8FAFC] rounded-3xl border border-dashed border-slate-300 p-10 flex flex-col items-center justify-center text-center min-h-[320px]">
            <div className="w-14 h-14 rounded-2xl bg-[#0F3D5E]/8 flex items-center justify-center mb-4">
              <TrendingDown className="w-7 h-7 text-[#0F3D5E]/40" />
            </div>
            <p className="text-sm font-medium text-slate-400">
              Preencha a receita ao lado para ver<br />a comparação entre os regimes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
