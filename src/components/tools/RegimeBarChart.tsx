"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export interface Bar {
  label: string;
  value: number;
  color: string;
  isBest?: boolean;
  isCurrent?: boolean;
}

interface Props {
  bars: Bar[];
  formatValue?: (v: number) => string;
}

export default function RegimeBarChart({ bars, formatValue }: Props) {
  const shouldReduce = useReducedMotion();
  const maxVal = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="space-y-3">
      {bars.map((bar, i) => {
        const pct = (bar.value / maxVal) * 100;
        const display = formatValue ? formatValue(bar.value) : bar.value.toLocaleString("pt-BR");

        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-1 gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs font-medium text-slate-600 truncate">{bar.label}</span>
                {bar.isBest && (
                  <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded-full">
                    Melhor
                  </span>
                )}
                {bar.isCurrent && !bar.isBest && (
                  <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                    Atual
                  </span>
                )}
              </div>
              <span className="flex-shrink-0 text-xs font-semibold tabular-nums" style={{ color: bar.color }}>
                {display}
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: bar.color }}
                initial={{ width: shouldReduce ? `${pct}%` : 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
