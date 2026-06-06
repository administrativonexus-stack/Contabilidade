"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function PayrollMonthPicker() {
  const router = useRouter();
  const sp = useSearchParams();

  const now = new Date();
  const year = parseInt(sp.get("year") ?? String(now.getFullYear()), 10);
  const month = parseInt(sp.get("month") ?? String(now.getMonth() + 1), 10);

  function navigate(newYear: number, newMonth: number) {
    const params = new URLSearchParams();
    params.set("year", String(newYear));
    params.set("month", String(newMonth));
    router.push(`/client-portal/payroll?${params.toString()}`);
  }

  function prev() {
    if (month === 1) navigate(year - 1, 12);
    else navigate(year, month - 1);
  }

  function next() {
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
    if (isCurrentMonth) return;
    if (month === 12) navigate(year + 1, 1);
    else navigate(year, month + 1);
  }

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-4">
      <button
        onClick={prev}
        className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#0F3D5E] hover:text-[#0F3D5E] transition-colors"
        aria-label="Mês anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="text-center">
        <p className="text-base font-heading font-semibold text-[#0F3D5E]">
          {MONTHS[month - 1]} {year}
        </p>
        <p className="text-xs text-slate-400">Competência</p>
      </div>

      <button
        onClick={next}
        disabled={isCurrentMonth}
        className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#0F3D5E] hover:text-[#0F3D5E] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Próximo mês"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
