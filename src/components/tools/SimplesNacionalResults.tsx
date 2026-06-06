"use client";

import { AlertCircle } from "lucide-react";
import { type SimplesResult, formatBRL, formatPct } from "@/lib/calculators/simples-nacional";

interface Props {
  result: SimplesResult;
}

const BREAKDOWN_LABELS: Record<string, string> = {
  irpj: "IRPJ",
  csll: "CSLL",
  cofins: "COFINS",
  pis: "PIS/Pasep",
  cpp: "CPP (INSS Patronal)",
  iss: "ISS",
};

const COLORS = ["#0F3D5E", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#1D4ED8"];

export default function SimplesNacionalResults({ result }: Props) {
  const breakdownEntries = (Object.entries(result.breakdown) as [string, number][]).filter(
    ([, v]) => v > 0
  );
  const maxBreakdown = Math.max(...breakdownEntries.map(([, v]) => v), 1);

  return (
    <div className="space-y-4">
      {/* Main cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0F3D5E] rounded-2xl p-4 col-span-2">
          <p className="text-xs text-white/60 mb-1">DAS Mensal Estimado</p>
          <p className="text-2xl font-heading font-bold text-white tabular-nums">
            {formatBRL(result.das)}
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            Alíquota efetiva: {formatPct(result.effectiveRate)} · {result.bracket}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 mb-1">Alíquota Nominal</p>
          <p className="text-lg font-heading font-bold text-[#0F3D5E] tabular-nums">
            {formatPct(result.nominalRate)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">da faixa</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 mb-1">DAS Anual</p>
          <p className="text-lg font-heading font-bold text-[#0F3D5E] tabular-nums">
            {formatBRL(result.annualDas)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">estimativa</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Composição do DAS
        </p>
        <div className="space-y-3">
          {breakdownEntries.map(([key, value], i) => {
            const pct = (value / maxBreakdown) * 100;
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{BREAKDOWN_LABELS[key] ?? key}</span>
                  <span className="text-xs font-semibold tabular-nums text-[#0F3D5E]">
                    {formatBRL(value)}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: COLORS[i] ?? "#64748B" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next bracket warning */}
      {result.nextBracketAt != null && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-700 mb-0.5">Próxima Faixa</p>
              <p className="text-xs text-amber-600 leading-relaxed">
                A partir de {formatBRL(result.nextBracketAt)} de receita acumulada (RBT12), sua
                alíquota nominal aumenta. Planeje o crescimento com seu contador.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
