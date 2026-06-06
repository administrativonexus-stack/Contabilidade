"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle, XCircle, Send } from "lucide-react";
import { updateInvoiceStatus } from "../actions";
import type { InvoiceStatus, FinPaymentMethod } from "@/types/database";

const METHODS: { value: FinPaymentMethod; label: string }[] = [
  { value: "pix", label: "PIX" }, { value: "boleto", label: "Boleto" },
  { value: "credit_card", label: "Cartão de Crédito" }, { value: "debit_card", label: "Cartão de Débito" },
  { value: "bank_transfer", label: "Transferência" }, { value: "manual", label: "Manual" },
];

const inputClass = "w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors";

interface Props {
  invoiceId: string;
  currentStatus: InvoiceStatus;
}

export default function InvoiceActions({ invoiceId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();
  const [showPayForm, setShowPayForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateStatus(status: InvoiceStatus) {
    startTransition(async () => {
      const result = await updateInvoiceStatus(invoiceId, status);
      if (result?.error) setError(result.error);
    });
  }

  function handlePaySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateInvoiceStatus(invoiceId, "paid", {
        payment_method: fd.get("payment_method") as FinPaymentMethod,
        external_payment_id: (fd.get("external_payment_id") as string) || undefined,
        receipt_url: (fd.get("receipt_url") as string) || undefined,
      });
      if (result?.error) setError(result.error);
      else setShowPayForm(false);
    });
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {(currentStatus === "draft") && (
          <button onClick={() => updateStatus("pending")} disabled={isPending}
            className="h-9 px-4 rounded-xl bg-[#2563EB] text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-1.5">
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Enviar
          </button>
        )}
        {(currentStatus === "pending" || currentStatus === "overdue") && (
          <>
            <button onClick={() => setShowPayForm(!showPayForm)} disabled={isPending}
              className="h-9 px-4 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> Marcar como Pago
            </button>
            <button onClick={() => updateStatus("overdue")} disabled={isPending || currentStatus === "overdue"}
              className="h-9 px-4 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition-colors disabled:opacity-60">
              Marcar Vencida
            </button>
          </>
        )}
        {currentStatus !== "cancelled" && currentStatus !== "paid" && (
          <button onClick={() => updateStatus("cancelled")} disabled={isPending}
            className="h-9 px-4 rounded-xl bg-slate-500 text-white text-sm font-medium hover:bg-slate-600 transition-colors disabled:opacity-60 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" /> Cancelar
          </button>
        )}
        {currentStatus === "paid" && (
          <button onClick={() => updateStatus("refunded")} disabled={isPending}
            className="h-9 px-4 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:border-slate-300 transition-colors disabled:opacity-60">
            Reembolsar
          </button>
        )}
      </div>

      {showPayForm && (
        <form onSubmit={handlePaySubmit} className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Detalhes do Pagamento</p>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Forma de Pagamento</label>
            <select name="payment_method" className={inputClass}>
              {METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">ID Transação (opcional)</label>
            <input name="external_payment_id" className={inputClass} placeholder="Ex: PIX-20250101-001" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">URL Comprovante (opcional)</label>
            <input name="receipt_url" type="url" className={inputClass} placeholder="https://..." />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={isPending} className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center gap-1.5">
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null} Confirmar Pagamento
            </button>
            <button type="button" onClick={() => setShowPayForm(false)} className="h-9 px-4 rounded-lg border border-slate-200 text-slate-600 text-sm hover:border-slate-300 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
