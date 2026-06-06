"use client";

import { useState, useTransition } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { generateMonthlyInvoices } from "./actions";

export default function GenerateInvoicesButton() {
  const [result, setResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handle() {
    setResult(null);
    startTransition(async () => {
      const res = await generateMonthlyInvoices();
      setResult(res.created === 0 ? "Nenhuma assinatura pendente" : `${res.created} fatura(s) gerada(s)`);
    });
  }

  return (
    <div className="flex items-center gap-2">
      {result && <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">{result}</span>}
      <button onClick={handle} disabled={isPending}
        className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-[#0F3D5E] hover:text-[#0F3D5E] transition-colors disabled:opacity-60">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        Gerar Faturas do Mês
      </button>
    </div>
  );
}
