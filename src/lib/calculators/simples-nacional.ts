export type SimplesAnexo = "I" | "III" | "V";

export interface SimplesInput {
  monthlyRevenue: number;
  annualRevenue: number;
  anexo: SimplesAnexo;
}

export interface SimplesBreakdown {
  irpj: number;
  csll: number;
  cofins: number;
  pis: number;
  cpp: number;
  iss: number;
}

export interface SimplesResult {
  das: number;
  effectiveRate: number;
  nominalRate: number;
  bracket: string;
  nextBracketAt: number | null;
  breakdown: SimplesBreakdown;
  annualDas: number;
}

interface Bracket {
  limit: number;
  nominal: number;
  pd: number;
}

const TABLES: Record<SimplesAnexo, Bracket[]> = {
  I: [
    { limit: 180000, nominal: 0.04, pd: 0 },
    { limit: 360000, nominal: 0.073, pd: 5940 },
    { limit: 720000, nominal: 0.095, pd: 13860 },
    { limit: 1800000, nominal: 0.107, pd: 22500 },
    { limit: 3600000, nominal: 0.143, pd: 87300 },
    { limit: 4800000, nominal: 0.19, pd: 378000 },
  ],
  III: [
    { limit: 180000, nominal: 0.06, pd: 0 },
    { limit: 360000, nominal: 0.112, pd: 9360 },
    { limit: 720000, nominal: 0.135, pd: 17640 },
    { limit: 1800000, nominal: 0.16, pd: 35640 },
    { limit: 3600000, nominal: 0.21, pd: 125640 },
    { limit: 4800000, nominal: 0.33, pd: 648000 },
  ],
  V: [
    { limit: 180000, nominal: 0.155, pd: 0 },
    { limit: 360000, nominal: 0.18, pd: 4500 },
    { limit: 720000, nominal: 0.195, pd: 9900 },
    { limit: 1800000, nominal: 0.205, pd: 17100 },
    { limit: 3600000, nominal: 0.23, pd: 62100 },
    { limit: 4800000, nominal: 0.305, pd: 540000 },
  ],
};

const BRACKET_LABELS = ["Faixa 1", "Faixa 2", "Faixa 3", "Faixa 4", "Faixa 5", "Faixa 6"];

// Distribution percentages of DAS per component (Anexo III as reference)
const DISTRIBUTIONS: Record<SimplesAnexo, SimplesBreakdown> = {
  I: { irpj: 0.055, csll: 0.035, cofins: 0.1274, pis: 0.0276, cpp: 0.415, iss: 0 },
  III: { irpj: 0.06, csll: 0.035, cofins: 0.1282, pis: 0.0278, cpp: 0.434, iss: 0.335 },
  V: { irpj: 0.25, csll: 0.15, cofins: 0.1427, pis: 0.0309, cpp: 0.2885, iss: 0.1379 },
};

export function calculateSimples(input: SimplesInput): SimplesResult {
  const { monthlyRevenue, annualRevenue, anexo } = input;
  const table = TABLES[anexo];
  const rbt12 = annualRevenue > 0 ? annualRevenue : monthlyRevenue * 12;

  const bracketIdx = table.findIndex((b) => rbt12 <= b.limit);
  const idx = bracketIdx === -1 ? table.length - 1 : bracketIdx;
  const bracket = table[idx];

  const effectiveRate = rbt12 > 0 ? Math.max((rbt12 * bracket.nominal - bracket.pd) / rbt12, 0) : 0;
  const das = effectiveRate * monthlyRevenue;

  const dist = DISTRIBUTIONS[anexo];
  const breakdown: SimplesBreakdown = {
    irpj: das * dist.irpj,
    csll: das * dist.csll,
    cofins: das * dist.cofins,
    pis: das * dist.pis,
    cpp: das * dist.cpp,
    iss: das * dist.iss,
  };

  const nextBracket = idx < table.length - 1 ? table[idx + 1].limit : null;

  return {
    das,
    effectiveRate: effectiveRate * 100,
    nominalRate: bracket.nominal * 100,
    bracket: BRACKET_LABELS[idx],
    nextBracketAt: nextBracket,
    breakdown,
    annualDas: das * 12,
  };
}

export const ANEXO_LABELS: Record<SimplesAnexo, string> = {
  I: "Anexo I — Comércio",
  III: "Anexo III — Serviços (geral)",
  V: "Anexo V — Serviços (alto valor)",
};

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function formatPct(value: number): string {
  return value.toFixed(4).replace(".", ",").replace(/0+$/, "").replace(/,$/, "") + "%";
}
