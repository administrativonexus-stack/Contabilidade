export const COMPANY = {
  name: "Nexus Contabilidade",
  tagline: "Contabilidade Digital para Empresas",
  whatsapp: "+5511999999999",
  whatsappDisplay: "+55 (11) 99999-9999",
  email: "contato@nexuscontabilidade.com.br",
  phone: "(11) 99999-9999",
  address: "São Paulo, SP",
  social: {
    linkedin: "https://linkedin.com/company/nexus-contabilidade",
    instagram: "https://instagram.com/nexuscontabilidade",
  },
} as const;

export const WHATSAPP_URL = `https://wa.me/${COMPANY.whatsapp}?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20serviços%20da%20Nexus%20Contabilidade.`;

export const NAV_LINKS = [
  { label: "Serviços", href: "/#servicos" },
  { label: "Setores", href: "/#setores" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Ferramentas", href: "/tools" },
  { label: "Blog", href: "/#blog" },
  { label: "Contato", href: "/#contato" },
] as const;

export const TOOLS = [
  {
    id: "clt-vs-pj",
    title: "Calculadora CLT vs PJ",
    description: "Compare o custo real de contratar CLT versus terceirizar como PJ em segundos.",
    href: "/tools/clt-vs-pj",
    available: true,
    icon: "Calculator",
  },
  {
    id: "tax-savings",
    title: "Calculadora de Economia Tributária",
    description: "Descubra quanto sua empresa pode economizar com planejamento tributário.",
    href: "/tools/tax-savings",
    available: true,
    icon: "TrendingDown",
  },
  {
    id: "simples-nacional",
    title: "Simulador Simples Nacional",
    description: "Calcule sua alíquota efetiva e DAS mensal por faixa de receita.",
    href: "/tools/simples-nacional",
    available: true,
    icon: "Receipt",
  },
  {
    id: "pro-labore",
    title: "Calculadora de Pró-Labore",
    description: "Defina o pró-labore ideal para sócios com impacto fiscal otimizado.",
    href: "/tools/pro-labore",
    available: true,
    icon: "Users",
  },
  {
    id: "abertura-empresa",
    title: "Calculadora de Abertura de Empresa",
    description: "Estime os custos de abertura e qual regime tributário mais convém.",
    href: "/tools/abertura-empresa",
    available: true,
    icon: "Building2",
  },
] as const;

export const SERVICES = [
  {
    id: "abertura",
    icon: "Building2",
    title: "Abertura de Empresa",
    description:
      "Constituição empresarial completa, escolha do regime tributário ideal e registro em todos os órgãos competentes.",
  },
  {
    id: "contabilidade",
    icon: "BookOpen",
    title: "Gestão Contábil",
    description:
      "Escrituração contábil, balancetes, balanços patrimoniais e demonstrações financeiras dentro dos prazos.",
  },
  {
    id: "fiscal",
    icon: "Receipt",
    title: "Departamento Fiscal",
    description:
      "Apuração de impostos, entrega de obrigações acessórias e gestão tributária para reduzir sua carga fiscal.",
  },
  {
    id: "rh",
    icon: "Users",
    title: "Departamento Pessoal",
    description:
      "Folha de pagamento, eSocial, admissões, demissões e toda a gestão de RH da sua empresa.",
  },
  {
    id: "planejamento",
    icon: "Calculator",
    title: "Planejamento Tributário",
    description:
      "Análise do regime tributário mais vantajoso e estratégias legais para economia fiscal.",
  },
  {
    id: "consultoria",
    icon: "TrendingUp",
    title: "Consultoria Empresarial",
    description:
      "Assessoria estratégica para crescimento, controle de custos, indicadores financeiros e tomada de decisão.",
  },
] as const;

export const WHY_CHOOSE_US = [
  {
    icon: "MessageCircle",
    title: "Suporte via WhatsApp",
    description:
      "Resposta rápida pelo WhatsApp com atendimento humanizado e sem burocracia.",
  },
  {
    icon: "LayoutDashboard",
    title: "Portal do Cliente",
    description:
      "Acesse documentos, relatórios e boletos 24h pelo nosso portal digital seguro.",
  },
  {
    icon: "FileSignature",
    title: "Assinatura Digital",
    description:
      "Assine documentos de qualquer lugar com validade jurídica. Sem papel, sem deslocamento.",
  },
  {
    icon: "BarChart3",
    title: "Relatórios Mensais",
    description:
      "Receba relatórios gerenciais claros e objetivos para tomar decisões com segurança.",
  },
  {
    icon: "Briefcase",
    title: "Especialistas por Setor",
    description:
      "Contadores especializados no seu segmento de negócio para uma assessoria precisa.",
  },
  {
    icon: "Shield",
    title: "Dados 100% Seguros",
    description:
      "Infraestrutura em nuvem com criptografia e backups automáticos para proteger suas informações.",
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Diagnóstico Gratuito",
    description:
      "Conversamos para entender seu negócio, situação fiscal atual e objetivos financeiros.",
  },
  {
    step: 2,
    title: "Análise Empresarial",
    description:
      "Nossa equipe mapeia o regime ideal, obrigações e oportunidades de economia tributária.",
  },
  {
    step: 3,
    title: "Implementação",
    description:
      "Realizamos a migração, regularização e configuração de todos os processos contábeis.",
  },
  {
    step: 4,
    title: "Suporte Contínuo",
    description:
      "Acompanhamento permanente, relatórios mensais e suporte ágil via WhatsApp.",
  },
] as const;

export const STATS = [
  { value: 500, suffix: "+", label: "Empresas Atendidas" },
  { value: 10, suffix: "+", label: "Anos de Experiência" },
  { value: 98, suffix: "%", label: "Satisfação dos Clientes" },
  { value: 24, suffix: "h", label: "Suporte Humano" },
] as const;

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Carlos Mendonça",
    company: "TechFlow Soluções",
    role: "CEO",
    text: "A Nexus transformou nossa gestão financeira. O portal do cliente facilita muito o dia a dia e o suporte via WhatsApp é ágil. Recomendo para qualquer empresa que quer uma contabilidade moderna.",
    initials: "CM",
  },
  {
    id: 2,
    name: "Ana Paula Reis",
    company: "Reis & Associados",
    role: "Sócia-Diretora",
    text: "Após 5 anos com um escritório tradicional, migrar para a Nexus foi a melhor decisão. Economizei no imposto com o planejamento tributário e tenho visibilidade total das finanças em tempo real.",
    initials: "AR",
  },
  {
    id: 3,
    name: "Roberto Alves",
    company: "Alves Construtora",
    role: "Diretor Financeiro",
    text: "A qualidade dos relatórios mensais é impressionante. Consigo tomar decisões estratégicas com dados claros. A equipe é extremamente profissional e sempre disponível.",
    initials: "RA",
  },
] as const;

export const REVENUE_OPTIONS = [
  { value: "ate-50k", label: "Até R$ 50.000/mês" },
  { value: "50k-150k", label: "R$ 50.000 a R$ 150.000/mês" },
  { value: "150k-500k", label: "R$ 150.000 a R$ 500.000/mês" },
  { value: "acima-500k", label: "Acima de R$ 500.000/mês" },
] as const;
