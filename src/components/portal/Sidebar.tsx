"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Megaphone,
  User,
  LogOut,
  TrendingUp,
  Calculator,
  Users,
  Receipt,
  Upload,
  ClipboardCheck,
} from "lucide-react";
import { signOut } from "@/app/client-portal/login/actions";

const mainItems = [
  { href: "/client-portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/client-portal/documents", label: "Documentos", icon: FileText },
  { href: "/client-portal/uploads", label: "Meus Envios", icon: Upload },
  { href: "/client-portal/pending", label: "Ações Pendentes", icon: ClipboardCheck },
  { href: "/client-portal/requests", label: "Solicitações", icon: MessageSquare },
  { href: "/client-portal/announcements", label: "Comunicados", icon: Megaphone },
  { href: "/client-portal/profile", label: "Perfil", icon: User },
];

const financeItems = [
  { href: "/client-portal/taxes", label: "Guia de Impostos", icon: Calculator },
  { href: "/client-portal/payroll", label: "Folha de Pagamento", icon: Users },
  { href: "/client-portal/fees", label: "Faturas", icon: Receipt },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen bg-[#0F3D5E] fixed left-0 top-0 z-20">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-heading font-bold text-white leading-none">Nexus</p>
          <p className="text-[10px] text-white/50 leading-none mt-0.5">Portal do Cliente</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/30">
        {mainItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}

        {/* Financeiro */}
        <div className="pt-3 pb-1">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">Financeiro</p>
        </div>
        {financeItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
