"use client";

import { useState } from "react";
import { ChevronDown, TrendingDown } from "lucide-react";
import { type CltVsPjResult, formatBRL } from "@/lib/calculators/clt-vs-pj";
import ComparisonChart from "./ComparisonChart";

interface Props {
  result: CltVsPjResult;
}

function ResultCard({ label, value, highlight, large }: {
  label: string;
  value: string;
  highlight?: "green" | "navy";
  large?: boolean;
}) {
  const bg = highlight === "green"
    ? "bg-[#10B981]/8 border-[#10B981]/20"
    : highlight === "navy"
    ? "bg-[#0F3D5E] border-[#0F3D5E]"
    : "bg-white border-slate-200";

  const labelColor = highlight === "navy" ? "text-white/70" : "text-slate-500";
  const valueColor = highlight === "green"
    ? "text-[#10B981]"
    : highlight === "navy"
    ? "text-white"
    : "text-[#0F3D5E]";

  return (
    <div className={`rounded-2xl border p-4 ${bg}`}>
      <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${labelColor}`}>{label}</p>
      <p className={`font-heading font-bold tabular-nums ${large ? "text-2xl" : "text-xl"} ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}

export default function ResultsDashboard({ result }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { cltCost, pjCost, monthlySavings, annualSavings, breakdown } = result;

  const breakdownItems = [
    { label: "Salário base", value: cltCost - breakdown.fgts - breakdown.thirteenth - breakdown.vacation - breakdown.inss - breakdown.benefits },
    { label: "FGTS (8%)", value: breakdown.fgts },
    { label: "Provisão 13º (8,33%)", value: breakdown.thirteenth },
    { label: "Provisão férias (11,11%)", value: breakdown.vacation },
    { label: "INSS patronal (20%)", value: breakdown.inss },
    { label: "Benefícios", value: breakdown.benefits },
  ];

  return (
    <div className="space-y-5">
      {/* Main cards */}
      <div className="grid grid-cols-2 gap-3">
        <ResultCard label="Custo CLT / mês" value={formatBRL(cltCost)} />
        <ResultCard label="Custo PJ / mês" value={formatBRL(pjCost)} />
        <ResultCard label="Economia mensal" value={formatBRL(monthlySavings)} highlight="green" />
        <ResultCard label="Economia anual" value={formatBRL(annualSavings)} highlight="navy" large />
      </div>

      {/* Comparison chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <ComparisonChart cltCost={cltCost} pjCost={pjCost} />
      </div>

      {/* CLT Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-[#0F3D5E] hover:bg-slate-50 transition-colors"
          aria-expanded={expanded}
        >
          Detalhamento do Custo CLT
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </button>
        {expanded && (
          <div className="border-t border-slate-100 px-5 pb-4">
            <div className="divide-y divide-slate-100">
              {breakdownItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-slate-500">{item.label}</span>
                  <span className="text-sm font-semibold text-[#0F3D5E] tabular-nums">{formatBRL(item.value)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-2.5">
                <span className="text-sm font-semibold text-[#0F3D5E]">Total CLT</span>
                <span className="text-sm font-bold text-[#0F3D5E] tabular-nums">{formatBRL(cltCost)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Savings highlight */}
      {monthlySavings > 0 && (
        <div className="flex items-start gap-3 bg-[#10B981]/8 border border-[#10B981]/20 rounded-xl px-4 py-3">
          <TrendingDown className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#059669]">
            Contratando como PJ, você pode economizar <strong>{formatBRL(annualSavings)}</strong> por ano neste colaborador.
          </p>
        </div>
      )}
    </div>
  );
}
