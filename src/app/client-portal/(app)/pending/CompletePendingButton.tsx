"use client";

import { useState, useTransition } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { completePendingAction } from "./actions";

export default function CompletePendingButton({ id }: { id: string }) {
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await completePendingAction(id);
      if (!result.error) setDone(true);
    });
  }

  if (done) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 text-xs font-semibold">
        <CheckCircle className="w-3.5 h-3.5" /> Concluída
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-colors"
    >
      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
      Marcar como Concluída
    </button>
  );
}
