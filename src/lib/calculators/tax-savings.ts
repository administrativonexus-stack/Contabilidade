export type BusinessType = "servicos" | "comercio" | "industria";
export type TaxRegime = "simples" | "presumido" | "real";

export interface TaxSavingsInput {
  monthlyRevenue: number;
  annualRevenue: number;
  businessType: BusinessType;
  profitMargin: number;
  currentRegime: TaxRegime;
}

export interface RegimeOption {
  id: TaxRegime;
  label: string;
  monthlyTax: number;
  effectiveRate: number;
  isCurrent: boolean;
  isRecommended: boolean;
}

export interface TaxSavingsResult {
  regimes: RegimeOption[];
  currentTax: number;
  bestTax: number;
  monthlySavings: number;
  annualSavings: number;
  recommendation: string;
}

const SIMPLES_TABLE_SERVICOS = [
  { limit: 180000, nominal: 0.06, pd: 0 },
  { limit: 360000, nominal: 0.112, pd: 9360 },
  { limit: 720000, nominal: 0.135, pd: 17640 },
  { limit: 1800000, nominal: 0.16, pd: 35640 },
  { limit: 3600000, nominal: 0.21, pd: 125640 },
  { limit: 4800000, nominal: 0.33, pd: 648000 },
];

const SIMPLES_TABLE_COMERCIO = [
  { limit: 180000, nominal: 0.04, pd: 0 },
  { limit: 360000, nominal: 0.073, pd: 5940 },
  { limit: 720000, nominal: 0.095, pd: 13860 },
  { limit: 1800000, nominal: 0.107, pd: 22500 },
  { limit: 3600000, nominal: 0.143, pd: 87300 },
  { limit: 4800000, nominal: 0.19, pd: 378000 },
];

function calcSimples(annualRevenue: number, monthlyRevenue: number, type: BusinessType): number {
  const table = type === "comercio" ? SIMPLES_TABLE_COMERCIO : SIMPLES_TABLE_SERVICOS;
  const bracket = table.find((b) => annualRevenue <= b.limit) ?? table[table.length - 1];
  if (annualRevenue === 0) return 0;
  const effectiveRate = (annualRevenue * bracket.nominal - bracket.pd) / annualRevenue;
  return Math.max(effectiveRate, 0) * monthlyRevenue;
}

function calcPresumido(monthlyRevenue: number, type: BusinessType): number {
  if (type === "comercio" || type === "industria") {
    return monthlyRevenue * (0.012 + 0.0072 + 0.0065 + 0.03);
  }
  return monthlyRevenue * (0.048 + 0.0288 + 0.0065 + 0.03);
}

function calcReal(monthlyRevenue: number, profitMargin: number): number {
  const margin = Math.max(0, Math.min(100, profitMargin)) / 100;
  const incomeRate = (0.15 + 0.09) * margin;
  return monthlyRevenue * (incomeRate + 0.0165 + 0.076);
}

const REGIME_LABELS: Record<TaxRegime, string> = {
  simples: "Simples Nacional",
  presumido: "Lucro Presumido",
  real: "Lucro Real",
};

const RECOMMENDATIONS: Record<TaxRegime, string> = {
  simples: "O Simples Nacional oferece a menor carga tributária para o seu perfil. Alíquota unificada e pagamento simplificado via DAS mensal.",
  presumido: "O Lucro Presumido é a opção mais vantajosa. Ideal para empresas com margem de lucro acima da presumida pela Receita Federal.",
  real: "O Lucro Real apresenta a menor carga para empresas com margens apertadas, pois o imposto incide apenas sobre o lucro efetivo.",
};

export function calculateTaxSavings(input: TaxSavingsInput): TaxSavingsResult {
  const { monthlyRevenue, annualRevenue, businessType, profitMargin, currentRegime } = input;

  const simplesTax = calcSimples(annualRevenue, monthlyRevenue, businessType);
  const presumidoTax = calcPresumido(monthlyRevenue, businessType);
  const realTax = calcReal(monthlyRevenue, profitMargin);

  const taxes: Record<TaxRegime, number> = {
    simples: simplesTax,
    presumido: presumidoTax,
    real: realTax,
  };

  const bestRegime = (Object.keys(taxes) as TaxRegime[]).reduce((a, b) =>
    taxes[a] < taxes[b] ? a : b
  );

  const regimes: RegimeOption[] = (Object.keys(taxes) as TaxRegime[]).map((id) => ({
    id,
    label: REGIME_LABELS[id],
    monthlyTax: taxes[id],
    effectiveRate: monthlyRevenue > 0 ? (taxes[id] / monthlyRevenue) * 100 : 0,
    isCurrent: id === currentRegime,
    isRecommended: id === bestRegime,
  }));

  const currentTax = taxes[currentRegime];
  const bestTax = taxes[bestRegime];
  const monthlySavings = currentTax - bestTax;

  return {
    regimes,
    currentTax,
    bestTax,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    recommendation: RECOMMENDATIONS[bestRegime],
  };
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function formatPct(value: number): string {
  return value.toFixed(2).replace(".", ",") + "%";
}
