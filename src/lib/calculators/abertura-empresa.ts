export type BusinessStructure = "mei" | "slu" | "ltda" | "sa";
export type BusinessType = "servicos" | "comercio" | "industria";

export interface AberturaInput {
  monthlyRevenue: number;
  businessType: BusinessType;
  partners: number;
  structure: BusinessStructure;
}

export interface CostRange {
  min: number;
  max: number;
}

export interface AberturaResult {
  recommended: {
    structure: BusinessStructure;
    structureLabel: string;
    regime: string;
    regimeLabel: string;
    reason: string;
  };
  costs: {
    opening: CostRange;
    monthlyAccounting: CostRange;
    firstYear: CostRange;
    breakdown: Array<{ label: string; value: string; note?: string }>;
  };
  timeline: string;
}

const STRUCTURE_LABELS: Record<BusinessStructure, string> = {
  mei: "MEI — Microempreendedor Individual",
  slu: "SLU — Sociedade Limitada Unipessoal",
  ltda: "LTDA — Sociedade Limitada",
  sa: "S.A. — Sociedade Anônima",
};

const OPENING_COSTS: Record<BusinessStructure, CostRange> = {
  mei: { min: 0, max: 0 },
  slu: { min: 1250, max: 2150 },
  ltda: { min: 1250, max: 2500 },
  sa: { min: 3000, max: 6000 },
};

const ACCOUNTING_COSTS: Record<string, CostRange> = {
  mei: { min: 80, max: 200 },
  simples: { min: 350, max: 600 },
  presumido: { min: 600, max: 1200 },
  real: { min: 1200, max: 2500 },
};

const TIMELINES: Record<BusinessStructure, string> = {
  mei: "1 dia útil (100% online)",
  slu: "5 a 15 dias úteis",
  ltda: "5 a 15 dias úteis",
  sa: "30 a 60 dias úteis",
};

function recommendStructure(partners: number, monthlyRevenue: number): BusinessStructure {
  if (partners === 1 && monthlyRevenue <= 6750) return "mei";
  if (partners === 1) return "slu";
  if (partners <= 50) return "ltda";
  return "sa";
}

function recommendRegime(monthlyRevenue: number, structure: BusinessStructure): string {
  if (structure === "mei") return "mei";
  const annual = monthlyRevenue * 12;
  if (annual <= 4800000) return "simples";
  return "presumido";
}

const REGIME_LABELS: Record<string, string> = {
  mei: "MEI (DAS fixo mensal)",
  simples: "Simples Nacional",
  presumido: "Lucro Presumido",
  real: "Lucro Real",
};

function buildBreakdown(structure: BusinessStructure): Array<{ label: string; value: string; note?: string }> {
  if (structure === "mei") {
    return [
      { label: "Registro MEI (gov.br)", value: "Gratuito" },
      { label: "CNPJ", value: "Gratuito" },
      { label: "Licença municipal (alvará)", value: "R$ 0 – R$ 200", note: "Varia por município" },
    ];
  }
  return [
    { label: "Registro na Junta Comercial", value: "R$ 200 – R$ 400", note: "Varia por estado" },
    { label: "CNPJ", value: "Gratuito" },
    { label: "Alvará / Licença municipal", value: "R$ 200 – R$ 500", note: "Varia por município" },
    { label: "Certificado digital e-CNPJ", value: "R$ 200 – R$ 300" },
    { label: "Honorários contábeis de abertura", value: "R$ 600 – R$ 1.000" },
    ...(structure === "sa" ? [{ label: "Registro na CVM / custos adicionais", value: "R$ 1.500 – R$ 3.000" }] : []),
  ];
}

export function calculateAbertura(input: AberturaInput): AberturaResult {
  const { monthlyRevenue, partners, structure } = input;

  const recommendedStructure = recommendStructure(partners, monthlyRevenue);
  const recommendedRegime = recommendRegime(monthlyRevenue, recommendedStructure);

  const opening = OPENING_COSTS[structure];
  const accountingKey = recommendedRegime;
  const monthlyAccounting = ACCOUNTING_COSTS[accountingKey] ?? ACCOUNTING_COSTS["simples"];

  const firstYear: CostRange = {
    min: opening.min + monthlyAccounting.min * 12,
    max: opening.max + monthlyAccounting.max * 12,
  };

  const reasons: Record<BusinessStructure, string> = {
    mei: "Ideal para autônomos e prestadores individuais com faturamento até R$ 81.000/ano. Processo 100% online e gratuito.",
    slu: "Recomendado para empreendedores solos que faturam acima do limite do MEI. Sem sócios, responsabilidade limitada.",
    ltda: "A estrutura mais comum para empresas com múltiplos sócios. Flexível, econômica e amplamente reconhecida.",
    sa: "Indicada para grandes empresas que planejam captar investimentos ou ter ações negociadas em bolsa.",
  };

  return {
    recommended: {
      structure: recommendedStructure,
      structureLabel: STRUCTURE_LABELS[recommendedStructure],
      regime: recommendedRegime,
      regimeLabel: REGIME_LABELS[recommendedRegime],
      reason: reasons[recommendedStructure],
    },
    costs: {
      opening,
      monthlyAccounting,
      firstYear,
      breakdown: buildBreakdown(structure),
    },
    timeline: TIMELINES[structure],
  };
}

export { STRUCTURE_LABELS, REGIME_LABELS };

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function formatRange(range: CostRange): string {
  if (range.min === 0 && range.max === 0) return "Gratuito";
  if (range.min === range.max) return formatBRL(range.min);
  return `${formatBRL(range.min)} – ${formatBRL(range.max)}`;
}
