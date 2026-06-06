"use client";

import { TrendingDown, Users, Lightbulb } from "lucide-react";
import { type ProLaboreResult, formatBRL, formatPct, MIN_PRO_LABORE } from "@/lib/calculators/pro-labore";

interface Props {
  result: ProLaboreResult;
}

function ScenarioCard({
  title,
  scenario,
  highlight,
}: {
  title: string;
  scenario: ProLaboreResult["current"];
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "bg-[#10B981]/5 border-[#10B981]/30"
          : "bg-white border-slate-200"
      }`}
    >
      <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${highlight ? "text-[#10B981]" : "text-slate-500"}`}>
        {title}
      </p>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Pró-labore
          </span>
          <span className="font-semibold tabular-nums text-[#0F3D5E]">{formatBRL(scenario.proLabore)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Dividendos (isentos)</span>
          <span className="font-semibold tabular-nums text-[#10B981]">{formatBRL(scenario.dividends)}</span>
        </div>
        <div className="h-px bg-slate-100 my-1" />
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">INSS Empresa</span>
          <span className="tabular-nums text-red-500">- {formatBRL(scenario.inssEmpresa)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">INSS Sócio</span>
          <span className="tabular-nums text-red-500">- {formatBRL(scenario.inssSocio)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">IR (IRPF)</span>
          <span className="tabular-nums text-red-500">- {formatBRL(scenario.ir)}</span>
        </div>
        <div className="h-px bg-slate-100 my-1" />
        <div className="flex justify-between text-sm font-semibold">
          <span className={highlight ? "text-[#10B981]" : "text-[#0F3D5E]"}>Líquido no bolso</span>
          <span className={`tabular-nums ${highlight ? "text-[#10B981]" : "text-[#0F3D5E]"}`}>
            {formatBRL(scenario.takeHome)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>Carga tributária efetiva</span>
          <span className="tabular-nums">{formatPct(scenario.effectiveTaxRate)}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProLaboreResults({ result }: Props) {
  const hasSavings = result.monthlySavings > 0;

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      {hasSavings && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-4">
            <p className="text-xs text-slate-400 mb-1">Economia Mensal</p>
            <p className="text-lg font-heading font-bold text-[#10B981] tabular-nums">
              {formatBRL(result.monthlySavings)}
            </p>
          </div>
          <div className="bg-[#0F3D5E] rounded-2xl p-4">
            <p className="text-xs text-white/60 mb-1">Economia Anual</p>
            <p className="text-lg font-heading font-bold text-white tabular-nums">
              {formatBRL(result.annualSavings)}
            </p>
          </div>
        </div>
      )}

      {/* Scenario comparison */}
      <ScenarioCard title="Cenário Atual" scenario={result.current} />
      <ScenarioCard title={`Cenário Otimizado (pró-labore mín. ${formatBRL(MIN_PRO_LABORE)})`} scenario={result.optimized} highlight />

      {/* Tip */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
        <div className="flex gap-3">
          <Lightbulb className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-[#2563EB] mb-0.5">Como funciona</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pró-labore paga INSS (11% sócio + 20% empresa) e IR progressivo.
              Dividendos são isentos de IR para pessoa física. A estratégia é minimizar o
              pró-labore ao mínimo legal e distribuir o restante como dividendos.
            </p>
          </div>
        </div>
      </div>

      {!hasSavings && (
        <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-4">
          <div className="flex gap-3">
            <TrendingDown className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500">
              Seu pró-labore já está no mínimo legal. Não há otimização adicional a fazer.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
