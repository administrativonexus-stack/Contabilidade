"use client";

import { TrendingDown, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { type TaxSavingsResult, formatBRL, formatPct } from "@/lib/calculators/tax-savings";
import RegimeBarChart from "./RegimeBarChart";

const BAR_COLORS = ["#0F3D5E", "#2563EB", "#64748B"];

interface Props {
  result: TaxSavingsResult;
}

export default function TaxSavingsResults({ result }: Props) {
  const [expanded, setExpanded] = useState(false);

  const bars = result.regimes.map((r, i) => ({
    label: r.label,
    value: r.monthlyTax,
    color: r.isRecommended ? "#10B981" : BAR_COLORS[i] ?? "#64748B",
    isBest: r.isRecommended,
    isCurrent: r.isCurrent,
  }));

  return (
    <div className="space-y-4">
      {/* Main cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 mb-1">Imposto Atual</p>
          <p className="text-lg font-heading font-bold text-[#0F3D5E] tabular-nums">
            {formatBRL(result.currentTax)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">por mês</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#10B981]/30 bg-[#10B981]/5 p-4">
          <p className="text-xs text-slate-500 mb-1">Melhor Regime</p>
          <p className="text-lg font-heading font-bold text-[#10B981] tabular-nums">
            {formatBRL(result.bestTax)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">por mês</p>
        </div>
        <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 mb-1">Economia Mensal</p>
          <p className={`text-lg font-heading font-bold tabular-nums ${result.monthlySavings > 0 ? "text-[#10B981]" : "text-slate-400"}`}>
            {result.monthlySavings > 0 ? formatBRL(result.monthlySavings) : "—"}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">potencial</p>
        </div>
        <div className="bg-[#0F3D5E] rounded-2xl p-4">
          <p className="text-xs text-white/60 mb-1">Economia Anual</p>
          <p className="text-lg font-heading font-bold text-white tabular-nums">
            {result.annualSavings > 0 ? formatBRL(result.annualSavings) : "—"}
          </p>
          <p className="text-[10px] text-white/40 mt-0.5">estimativa</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Comparativo de Regimes
        </p>
        <RegimeBarChart bars={bars} formatValue={formatBRL} />
        <div className="mt-4 space-y-1.5">
          {result.regimes.map((r) => (
            <div key={r.id} className="flex items-center justify-between text-xs text-slate-500">
              <span>{r.label}</span>
              <span className="tabular-nums font-medium">{formatPct(r.effectiveRate)} efetivo</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      {result.monthlySavings > 0 && (
        <div className="bg-[#10B981]/5 rounded-2xl border border-[#10B981]/20 p-4">
          <div className="flex gap-3">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#10B981] mb-0.5">Recomendação</p>
              <p className="text-xs text-slate-600 leading-relaxed">{result.recommendation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Breakdown toggle */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-xs font-medium text-[#2563EB] hover:underline"
      >
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {expanded ? "Ocultar" : "Ver"} composição por regime
      </button>

      {expanded && (
        <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-4 space-y-3">
          {result.regimes.map((r) => (
            <div key={r.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-600">{r.label}</span>
                {r.isRecommended && (
                  <span className="text-[10px] font-semibold text-[#10B981] bg-[#10B981]/10 px-1.5 rounded-full">Melhor</span>
                )}
              </div>
              <div className="text-right">
                <span className="font-semibold tabular-nums text-[#0F3D5E]">{formatBRL(r.monthlyTax)}</span>
                <span className="text-slate-400 text-xs ml-1.5">({formatPct(r.effectiveRate)})</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
