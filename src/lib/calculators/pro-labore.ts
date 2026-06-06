export type ProLaboreRegime = "simples" | "presumido" | "real";

export interface ProLaboreInput {
  monthlyProfit: number;
  regime: ProLaboreRegime;
  proLabore: number;
}

export interface ProLaboreScenario {
  proLabore: number;
  dividends: number;
  inssEmpresa: number;
  inssSocio: number;
  ir: number;
  takeHome: number;
  totalTaxBurden: number;
  effectiveTaxRate: number;
}

export interface ProLaboreResult {
  current: ProLaboreScenario;
  optimized: ProLaboreScenario;
  monthlySavings: number;
  annualSavings: number;
}

const INSS_CEILING = 7786.02;
const INSS_EMPLOYER_RATE = 0.2;
const INSS_EMPLOYEE_RATE = 0.11;
const MIN_WAGE = 1412;

const IR_TABLE = [
  { limit: 2259.2, rate: 0, deduction: 0 },
  { limit: 2826.65, rate: 0.075, deduction: 169.44 },
  { limit: 3751.05, rate: 0.15, deduction: 381.44 },
  { limit: 4664.68, rate: 0.225, deduction: 662.77 },
  { limit: Infinity, rate: 0.275, deduction: 896.0 },
];

function calcINSSEmployee(proLabore: number): number {
  return Math.min(proLabore, INSS_CEILING) * INSS_EMPLOYEE_RATE;
}

function calcINSSEmployer(proLabore: number): number {
  return proLabore * INSS_EMPLOYER_RATE;
}

function calcIR(proLabore: number, inssSocio: number): number {
  const base = proLabore - inssSocio;
  const bracket = IR_TABLE.find((b) => base <= b.limit) ?? IR_TABLE[IR_TABLE.length - 1];
  const ir = base * bracket.rate - bracket.deduction;
  return Math.max(ir, 0);
}

function calcScenario(proLabore: number, monthlyProfit: number): ProLaboreScenario {
  const clampedProLabore = Math.min(proLabore, monthlyProfit);
  const dividends = Math.max(monthlyProfit - clampedProLabore, 0);
  const inssEmpresa = calcINSSEmployer(clampedProLabore);
  const inssSocio = calcINSSEmployee(clampedProLabore);
  const ir = calcIR(clampedProLabore, inssSocio);
  const takeHome = clampedProLabore - inssSocio - ir + dividends;
  const totalTaxBurden = inssEmpresa + inssSocio + ir;
  const effectiveTaxRate = monthlyProfit > 0 ? (totalTaxBurden / monthlyProfit) * 100 : 0;

  return {
    proLabore: clampedProLabore,
    dividends,
    inssEmpresa,
    inssSocio,
    ir,
    takeHome,
    totalTaxBurden,
    effectiveTaxRate,
  };
}

export function calculateProLabore(input: ProLaboreInput): ProLaboreResult {
  const { monthlyProfit, proLabore } = input;
  const current = calcScenario(proLabore, monthlyProfit);
  const optimized = calcScenario(MIN_WAGE, monthlyProfit);
  const monthlySavings = current.totalTaxBurden - optimized.totalTaxBurden;

  return {
    current,
    optimized,
    monthlySavings,
    annualSavings: monthlySavings * 12,
  };
}

export const REGIME_LABELS: Record<ProLaboreRegime, string> = {
  simples: "Simples Nacional",
  presumido: "Lucro Presumido",
  real: "Lucro Real",
};

export const MIN_PRO_LABORE = MIN_WAGE;

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function formatPct(value: number): string {
  return value.toFixed(1).replace(".", ",") + "%";
}
