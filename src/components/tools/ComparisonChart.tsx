"use client";

import { motion, useReducedMotion } from "framer-motion";
import { formatBRL } from "@/lib/calculators/clt-vs-pj";

interface Props {
  cltCost: number;
  pjCost: number;
}

export default function ComparisonChart({ cltCost, pjCost }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const max = Math.max(cltCost, pjCost, 1);
  const cltPct = Math.round((cltCost / max) * 100);
  const pjPct = Math.round((pjCost / max) * 100);

  const bars = [
    { label: "Custo CLT", value: cltCost, pct: cltPct, color: "#0F3D5E" },
    { label: "Custo PJ", value: pjCost, pct: pjPct, color: "#2563EB" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Comparativo Visual</p>
      {bars.map((bar) => (
        <div key={bar.label}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: bar.color }} />
              <span className="text-sm font-medium text-[#0F3D5E]">{bar.label}</span>
            </div>
            <span className="text-sm font-semibold text-[#0F3D5E] tabular-nums">{formatBRL(bar.value)}</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: bar.color }}
              initial={{ width: shouldReduceMotion ? `${bar.pct}%` : 0 }}
              animate={{ width: `${bar.pct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
