export type TaxRegime = "simples" | "presumido" | "real";

export interface CltVsPjInput {
  salary: number;
  transportation: number;
  meal: number;
  health: number;
  regime: TaxRegime;
}

export interface CltVsPjResult {
  cltCost: number;
  pjCost: number;
  monthlySavings: number;
  annualSavings: number;
  breakdown: {
    fgts: number;
    thirteenth: number;
    vacation: number;
    inss: number;
    benefits: number;
  };
  taxAmount: number;
}

const TAX_RATES: Record<TaxRegime, number> = {
  simples: 0.08,
  presumido: 0.1333,
  real: 0.15,
};

export const TAX_REGIME_LABELS: Record<TaxRegime, string> = {
  simples: "Simples Nacional (8%)",
  presumido: "Lucro Presumido (13,33%)",
  real: "Lucro Real (15%)",
};

export function calculateCltVsPj(input: CltVsPjInput): CltVsPjResult {
  const { salary, transportation, meal, health, regime } = input;
  const benefits = transportation + meal + health;

  const fgts = salary * 0.08;
  const thirteenth = salary * 0.0833;
  const vacation = salary * 0.1111;
  const inss = salary * 0.2;

  const cltCost = salary + fgts + thirteenth + vacation + inss + benefits;

  const taxRate = TAX_RATES[regime];
  const taxAmount = salary * taxRate;
  const pjCost = salary + taxAmount;

  const monthlySavings = cltCost - pjCost;
  const annualSavings = monthlySavings * 12;

  return {
    cltCost,
    pjCost,
    monthlySavings,
    annualSavings,
    breakdown: { fgts, thirteenth, vacation, inss, benefits },
    taxAmount,
  };
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}
