"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { DocumentCategory } from "@/types/database";

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  tax: "Documentos Fiscais",
  payroll: "Folha de Pagamento",
  accounting: "Contabilidade",
  financial: "Financeiro",
  legal: "Jurídico",
  contract: "Contratos",
  certificate: "Certidões",
  report: "Relatórios",
  other: "Outros",
};

export default function DocumentFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/client-portal/documents?${params.toString()}`);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          defaultValue={sp.get("q") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") update("q", (e.target as HTMLInputElement).value);
          }}
          onBlur={(e) => update("q", e.target.value)}
          placeholder="Buscar documento..."
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20"
        />
      </div>
      <select
        className="h-10 px-3 rounded-xl border border-slate-200 text-sm text-[#1E293B] bg-white focus:outline-none focus:ring-1 focus:border-[#0F3D5E] cursor-pointer"
        defaultValue={sp.get("category") ?? "all"}
        onChange={(e) => update("category", e.target.value === "all" ? "" : e.target.value)}
      >
        <option value="all">Todas as categorias</option>
        {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </div>
  );
}
