import { AlertTriangle, Calculator, Calendar } from "lucide-react";

const SIMPLES_ANEXOS = [
  { anexo: "Anexo I", atividade: "Comércio", faixas: ["4,00%", "7,30%", "9,50%", "10,70%", "14,30%", "19,00%"] },
  { anexo: "Anexo II", atividade: "Indústria", faixas: ["4,50%", "7,80%", "10,00%", "11,20%", "14,70%", "30,00%"] },
  { anexo: "Anexo III", atividade: "Serviços (CPP reduzida)", faixas: ["6,00%", "11,20%", "13,50%", "16,00%", "21,00%", "33,00%"] },
  { anexo: "Anexo IV", atividade: "Serviços (obras, vigilância…)", faixas: ["4,50%", "9,00%", "10,20%", "14,00%", "22,00%", "33,00%"] },
  { anexo: "Anexo V", atividade: "Serviços (TI, auditoria…)", faixas: ["15,50%", "18,00%", "19,50%", "20,50%", "23,00%", "30,50%"] },
];

const FAIXAS_RBT12 = [
  "Até R$ 180.000",
  "R$ 180.001 – R$ 360.000",
  "R$ 360.001 – R$ 720.000",
  "R$ 720.001 – R$ 1.800.000",
  "R$ 1.800.001 – R$ 3.600.000",
  "R$ 3.600.001 – R$ 4.800.000",
];

const LUCRO_PRESUMIDO = [
  { tributo: "IRPJ", aliquota: "15%", obs: "+ adicional de 10% sobre lucro > R$ 20.000/mês" },
  { tributo: "CSLL", aliquota: "9%", obs: "Serviços: base de presunção 32%" },
  { tributo: "PIS", aliquota: "0,65%", obs: "Regime cumulativo" },
  { tributo: "COFINS", aliquota: "3%", obs: "Regime cumulativo" },
];

const INSS_FAIXAS = [
  { faixa: "Até R$ 1.412,00", aliquota: "7,5%" },
  { faixa: "R$ 1.412,01 – R$ 2.666,68", aliquota: "9%" },
  { faixa: "R$ 2.666,69 – R$ 4.000,03", aliquota: "12%" },
  { faixa: "R$ 4.000,04 – R$ 7.786,02", aliquota: "14%" },
];

const VENCIMENTOS = [
  { tributo: "DARF (Simples Nacional – DAS)", prazo: "Dia 20", cor: "bg-blue-50 text-[#2563EB]" },
  { tributo: "FGTS", prazo: "Dia 7", cor: "bg-emerald-50 text-emerald-700" },
  { tributo: "INSS Empregado/Patronal (GPS)", prazo: "Dia 20", cor: "bg-purple-50 text-purple-700" },
  { tributo: "IRRF sobre Folha", prazo: "Dia 20", cor: "bg-orange-50 text-orange-700" },
  { tributo: "ISS (Municipal)", prazo: "Varia por município", cor: "bg-rose-50 text-rose-700" },
];

export default function TaxesPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Calculator className="w-5 h-5 text-[#2563EB]" />
          <h1 className="text-xl font-heading font-bold text-[#0F3D5E]">Guia de Impostos</h1>
        </div>
        <p className="text-sm text-slate-400">Alíquotas e calendário de vencimentos mensais</p>
      </div>

      {/* Aviso */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          As alíquotas são de referência para 2025. Confirme sempre com sua equipe Nexus antes de efetuar recolhimentos.
        </p>
      </div>

      {/* Calendário de vencimentos */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-[#0F3D5E]" />
          <h2 className="text-base font-heading font-semibold text-[#0F3D5E]">Calendário de Vencimentos</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {VENCIMENTOS.map((v) => (
            <div key={v.tributo} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${v.cor}`}>{v.prazo}</span>
              <p className="text-sm font-medium text-[#1E293B]">{v.tributo}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">* Prazos referentes ao mês seguinte à competência. Quando cai em fim de semana ou feriado, prorroga-se para o próximo dia útil.</p>
      </section>

      {/* Simples Nacional */}
      <section>
        <h2 className="text-base font-heading font-semibold text-[#0F3D5E] mb-1">Simples Nacional — Alíquotas por Faixa de RBT12</h2>
        <p className="text-xs text-slate-400 mb-4">DARF unificado (DAS). Alíquota efetiva varia conforme faturamento acumulado dos últimos 12 meses.</p>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">Anexo / Atividade</th>
                {FAIXAS_RBT12.map((f) => (
                  <th key={f} className="text-center px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">{f.replace("–", "–\n")}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SIMPLES_ANEXOS.map((row) => (
                <tr key={row.anexo} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-[#0F3D5E] text-xs">{row.anexo}</p>
                    <p className="text-slate-400 text-[11px]">{row.atividade}</p>
                  </td>
                  {row.faixas.map((f, i) => (
                    <td key={i} className="px-3 py-3 text-center font-semibold text-[#2563EB] text-sm">{f}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FGTS */}
      <section>
        <h2 className="text-base font-heading font-semibold text-[#0F3D5E] mb-4">FGTS — Fundo de Garantia do Tempo de Serviço</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Alíquota Mensal</p>
            <p className="text-3xl font-heading font-bold text-[#2563EB]">8%</p>
            <p className="text-xs text-slate-500 mt-1">sobre remuneração bruta</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Vencimento</p>
            <p className="text-3xl font-heading font-bold text-[#0F3D5E]">Dia 7</p>
            <p className="text-xs text-slate-500 mt-1">do mês seguinte à competência</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Multa Rescisória</p>
            <p className="text-3xl font-heading font-bold text-[#0F3D5E]">40%</p>
            <p className="text-xs text-slate-500 mt-1">do saldo do FGTS (sem justa causa)</p>
          </div>
        </div>
      </section>

      {/* INSS */}
      <section>
        <h2 className="text-base font-heading font-semibold text-[#0F3D5E] mb-1">INSS — Tabela Progressiva 2025</h2>
        <p className="text-xs text-slate-400 mb-4">Desconto do empregado (CPP do empregador: 20% sobre a folha bruta).</p>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="hidden sm:grid grid-cols-2 gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Faixa Salarial</span>
            <span>Alíquota</span>
          </div>
          <div className="divide-y divide-slate-100">
            {INSS_FAIXAS.map((row) => (
              <div key={row.faixa} className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 px-5 py-4 items-center">
                <span className="text-sm text-[#1E293B] font-medium">{row.faixa}</span>
                <span className="text-lg font-heading font-bold text-[#2563EB]">{row.aliquota}</span>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
            <p className="text-xs text-slate-500">Teto do INSS 2025: R$ 7.786,02 · Salário mínimo: R$ 1.518,00</p>
          </div>
        </div>
      </section>

      {/* Lucro Presumido */}
      <section>
        <h2 className="text-base font-heading font-semibold text-[#0F3D5E] mb-1">Lucro Presumido — Tributos Federais</h2>
        <p className="text-xs text-slate-400 mb-4">Recolhimento trimestral (IRPJ/CSLL) e mensal (PIS/COFINS).</p>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="hidden sm:grid grid-cols-3 gap-4 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Tributo</span>
            <span>Alíquota</span>
            <span>Observação</span>
          </div>
          <div className="divide-y divide-slate-100">
            {LUCRO_PRESUMIDO.map((row) => (
              <div key={row.tributo} className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 px-5 py-4 items-center">
                <span className="text-sm font-semibold text-[#0F3D5E]">{row.tributo}</span>
                <span className="text-lg font-heading font-bold text-[#2563EB]">{row.aliquota}</span>
                <span className="text-xs text-slate-500">{row.obs}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
