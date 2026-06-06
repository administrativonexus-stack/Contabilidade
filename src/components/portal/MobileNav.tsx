"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Upload, ClipboardCheck, User } from "lucide-react";

const navItems = [
  { href: "/client-portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/client-portal/documents", label: "Docs", icon: FileText },
  { href: "/client-portal/uploads", label: "Envios", icon: Upload },
  { href: "/client-portal/pending", label: "Pendências", icon: ClipboardCheck },
  { href: "/client-portal/profile", label: "Perfil", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-slate-200 flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors ${
              active ? "text-[#2563EB]" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px] font-medium leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
