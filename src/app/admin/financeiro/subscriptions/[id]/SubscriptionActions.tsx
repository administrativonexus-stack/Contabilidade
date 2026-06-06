"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateSubscriptionStatus, renewSubscription } from "../actions";
import type { SubscriptionStatus, BillingCycle } from "@/types/database";

interface Props {
  subId: string;
  currentStatus: SubscriptionStatus;
  renewalDate: string | null;
  billingCycle: BillingCycle;
}

export default function SubscriptionActions({ subId, currentStatus, renewalDate, billingCycle }: Props) {
  const [isPending, startTransition] = useTransition();

  function handle(status: SubscriptionStatus) {
    startTransition(async () => { await updateSubscriptionStatus(subId, status); });
  }

  function handleRenew() {
    if (!renewalDate) return;
    startTransition(async () => { await renewSubscription(subId, renewalDate, billingCycle); });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus !== "active" && currentStatus !== "trial" && (
        <button onClick={() => handle("active")} disabled={isPending}
          className="h-9 px-4 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center gap-1.5">
          {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Reativar
        </button>
      )}
      {(currentStatus === "active" || currentStatus === "trial") && (
        <button onClick={() => handle("suspended")} disabled={isPending}
          className="h-9 px-4 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-60">
          Pausar
        </button>
      )}
      {currentStatus !== "cancelled" && (
        <button onClick={() => handle("cancelled")} disabled={isPending}
          className="h-9 px-4 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition-colors disabled:opacity-60">
          Cancelar
        </button>
      )}
      {renewalDate && (
        <button onClick={handleRenew} disabled={isPending}
          className="h-9 px-4 rounded-xl bg-[#0F3D5E] text-white text-sm font-medium hover:bg-[#0d3352] transition-colors disabled:opacity-60">
          Renovar
        </button>
      )}
    </div>
  );
}
