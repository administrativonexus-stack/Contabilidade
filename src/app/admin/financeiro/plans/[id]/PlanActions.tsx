"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updatePlanStatus } from "../actions";
import type { PlanStatus } from "@/types/database";

interface Props {
  planId: string;
  currentStatus: PlanStatus;
}

export default function PlanActions({ planId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();

  function handle(status: PlanStatus) {
    startTransition(async () => {
      await updatePlanStatus(planId, status);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus !== "active" && (
        <button onClick={() => handle("active")} disabled={isPending}
          className="h-9 px-4 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center gap-1.5">
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null} Ativar
        </button>
      )}
      {currentStatus !== "inactive" && currentStatus !== "archived" && (
        <button onClick={() => handle("inactive")} disabled={isPending}
          className="h-9 px-4 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-60">
          Inativar
        </button>
      )}
      {currentStatus !== "archived" && (
        <button onClick={() => handle("archived")} disabled={isPending}
          className="h-9 px-4 rounded-xl bg-slate-500 text-white text-sm font-medium hover:bg-slate-600 transition-colors disabled:opacity-60">
          Arquivar
        </button>
      )}
    </div>
  );
}
