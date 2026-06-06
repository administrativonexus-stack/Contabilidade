"use client";

import { useState, useTransition } from "react";
import { CheckCircle, X, Loader2 } from "lucide-react";
import { confirmInvoicePayment } from "./actions";
import type { FinPaymentMethod } from "@/types/database";

const METHODS: { value: FinPaymentMethod; label: string }[] = [
  { value: "pix", label: "PIX" }, { value: "boleto", label: "Boleto" },
  { value: "credit_card", label: "Cartão de Crédito" }, { value: "bank_transfer", label: "Transferência" }, { value: "manual", label: "Outro" },
];

interface Props {
  invoiceId: string;
  amount: number;
}

export default function ConfirmInvoicePayment({ invoiceId, amount }: Props) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const formatted = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await confirmInvoicePayment(invoiceId, fd.get("method") as FinPaymentMethod);
      if (result?.error) setError(result.error);
      else { setDone(true); setTimeout(() => { setOpen(false); setDone(false); }, 1500); }
    });
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors">
        <CheckCircle className="w-3.5 h-3.5" /> Confirmar Pagamento
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-heading font-semibold text-[#0F3D5E]">Confirmar Pagamento</h3>
              <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-400">Valor</p>
                <p className="text-2xl font-heading font-bold text-[#0F3D5E] mt-1">{formatted}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Forma de pagamento</label>
                <select name="method" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:border-[#0F3D5E]">
                  {METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              {error && <p className="text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-xl">{error}</p>}
              <button type="submit" disabled={isPending || done}
                className="w-full h-11 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                {done ? <><CheckCircle className="w-4 h-4" /> Confirmado!</>
                  : isPending ? <Loader2 className="w-4 h-4 animate-spin" />
                  : "Confirmar"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
