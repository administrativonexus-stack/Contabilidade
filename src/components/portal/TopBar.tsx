import { Bell } from "lucide-react";
import type { UserRow, CompanyRow } from "@/types/database";

interface Props {
  user: UserRow;
  company: CompanyRow | null;
}

export default function TopBar({ user, company }: Props) {
  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#0F3D5E] truncate">
          {company?.company_name ?? "Portal do Cliente"}
        </p>
        <p className="text-xs text-slate-400 hidden sm:block">
          Bem-vindo, {user.full_name.split(" ")[0]}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors relative">
          <Bell className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F3D5E] to-[#2563EB] flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">{initials}</span>
        </div>
      </div>
    </header>
  );
}
