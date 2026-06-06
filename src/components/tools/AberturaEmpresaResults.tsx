"use client";

import { CheckCircle2, Clock, Building2, Star } from "lucide-react";
import { type AberturaResult, formatBRL, formatRange } from "@/lib/calculators/abertura-empresa";

interface Props {
  result: AberturaResult;
}

export default function AberturaEmpresaResults({ result }: Props) {
  const { recommended, costs, timeline } = result;

  return (
    <div className="space-y-4">
      {/* Recommendation card */}
      <div className="bg-[#0F3D5E] rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Star className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
              Recomendação
            </p>
            <p className="text-sm font-semibold text-white mb-0.5">{recommended.structureLabel}</p>
            <p className="text-xs text-white/60 mb-2">{recommended.regimeLabel}</p>
            <p className="text-xs text-white/80 leading-relaxed">{recommended.reason}</p>
          </div>
        </div>
      </div>

      {/* Cost cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-[10px] text-slate-400 mb-1 leading-tight">Abertura</p>
          <p className="text-sm font-heading font-bold text-[#0F3D5E] leading-tight">
            {costs.opening.min === 0 && costs.opening.max === 0
              ? "Grátis"
              : formatBRL(costs.opening.min)}
          </p>
          {costs.opening.max > costs.opening.min && (
            <p className="text-[10px] text-slate-400 mt-0.5">até {formatBRL(costs.opening.max)}</p>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-[10px] text-slate-400 mb-1 leading-tight">Contabil./mês</p>
          <p className="text-sm font-heading font-bold text-[#0F3D5E] leading-tight">
            {formatBRL(costs.monthlyAccounting.min)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">até {formatBRL(costs.monthlyAccounting.max)}</p>
        </div>
        <div className="bg-[#10B981]/5 rounded-2xl border border-[#10B981]/20 p-4">
          <p className="text-[10px] text-slate-400 mb-1 leading-tight">1º Ano Total</p>
          <p className="text-sm font-heading font-bold text-[#10B981] leading-tight">
            {formatBRL(costs.firstYear.min)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">até {formatBRL(costs.firstYear.max)}</p>
        </div>
      </div>

      {/* Cost breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Composição dos Custos de Abertura
        </p>
        <div className="space-y-2.5">
          {costs.breakdown.map((item, i) => (
            <div key={i} className="flex items-start justify-between gap-4 text-sm">
              <div className="flex items-start gap-2 min-w-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-slate-600 block">{item.label}</span>
                  {item.note && <span className="text-[10px] text-slate-400">{item.note}</span>}
                </div>
              </div>
              <span className="flex-shrink-0 font-semibold tabular-nums text-[#0F3D5E] text-xs">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-[#0F3D5E] mb-0.5">Prazo Estimado</p>
            <p className="text-xs text-slate-600">{timeline}</p>
          </div>
        </div>
      </div>

      {/* Process steps */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Etapas do Processo
        </p>
        <div className="space-y-2.5">
          {[
            "Definir CNAE e atividade principal",
            "Verificar viabilidade no município",
            "Registrar na Junta Comercial",
            "Inscrição no CNPJ (Receita Federal)",
            "Alvará de funcionamento",
            "Certificado digital e abertura contábil",
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="w-5 h-5 rounded-full bg-[#0F3D5E]/10 text-[#0F3D5E] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-slate-600">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
