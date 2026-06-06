"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  MessageSquare,
  Megaphone,
  LogOut,
  TrendingUp,
  ClipboardList,
  ClipboardCheck,
  ListChecks,
  BarChart3,
  UserPlus,
  Kanban,
  FileCheck,
  ScrollText,
  CalendarCheck,
  DollarSign,
  Layers,
  RefreshCw,
  Receipt,
  AlertCircle,
  BarChart2,
} from "lucide-react";
import { signOut } from "@/app/client-portal/login/actions";

const mainItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/companies", label: "Empresas", icon: Building2 },
  { href: "/admin/users", label: "Usuários", icon: Users },
  { href: "/admin/documents", label: "Documentos", icon: FileText },
  { href: "/admin/requests", label: "Solicitações", icon: MessageSquare },
  { href: "/admin/announcements", label: "Comunicados", icon: Megaphone },
];

const financeItems = [
  { href: "/admin/payroll", label: "Folha de Pagamento", icon: ClipboardList },
];

const billingItems = [
  { href: "/admin/financeiro", label: "Dashboard", icon: DollarSign },
  { href: "/admin/financeiro/plans", label: "Planos", icon: Layers },
  { href: "/admin/financeiro/subscriptions", label: "Assinaturas", icon: RefreshCw },
  { href: "/admin/financeiro/invoices", label: "Faturas", icon: Receipt },
  { href: "/admin/financeiro/collections", label: "Cobranças", icon: AlertCircle },
  { href: "/admin/financeiro/reports", label: "Relatórios", icon: BarChart2 },
];

const workflowItems = [
  { href: "/admin/review", label: "Fila de Revisão", icon: ClipboardCheck },
  { href: "/admin/pending", label: "Ações Pendentes", icon: ListChecks },
];

const crmItems = [
  { href: "/admin/crm", label: "Dashboard CRM", icon: BarChart3 },
  { href: "/admin/crm/leads", label: "Leads", icon: UserPlus },
  { href: "/admin/crm/pipeline", label: "Pipeline", icon: Kanban },
  { href: "/admin/crm/proposals", label: "Propostas", icon: FileCheck },
  { href: "/admin/crm/contracts", label: "Contratos", icon: ScrollText },
  { href: "/admin/crm/customers", label: "Clientes", icon: Building2 },
  { href: "/admin/crm/activities", label: "Atividades", icon: CalendarCheck },
];

function NavSection({ items, pathname }: { items: { href: string; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[]; pathname: string }) {
  return (
    <>
      {items.map(({ href, label, icon: Icon }) => {
        const exactRoutes = ["/admin/crm", "/admin/financeiro"];
        const active = exactRoutes.includes(href)
          ? pathname === href || pathname === href + "/"
          : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              active ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/8 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-[#0F3D5E] fixed left-0 top-0 z-20">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-heading font-bold text-white leading-none">Nexus</p>
          <p className="text-[10px] text-white/50 leading-none mt-0.5">Painel Admin</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <NavSection items={mainItems} pathname={pathname} />

        <div className="pt-3 pb-1">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">Financeiro</p>
        </div>
        <NavSection items={financeItems} pathname={pathname} />

        <div className="pt-3 pb-1">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">Faturamento</p>
        </div>
        <NavSection items={billingItems} pathname={pathname} />

        <div className="pt-3 pb-1">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">Workflow</p>
        </div>
        <NavSection items={workflowItems} pathname={pathname} />

        <div className="pt-3 pb-1">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">CRM</p>
        </div>
        <NavSection items={crmItems} pathname={pathname} />
      </nav>

      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        <Link href="/client-portal/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-white/40 hover:text-white/60 transition-colors mb-1">
          Portal do cliente →
        </Link>
        <form action={signOut}>
          <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition-colors">
            <LogOut className="w-4 h-4 flex-shrink-0" /> Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
