import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: "blue" | "green" | "yellow" | "navy" | "red";
  href?: string;
}

const colorMap = {
  blue: { bg: "bg-blue-50", text: "text-[#2563EB]", icon: "text-[#2563EB]" },
  green: { bg: "bg-emerald-50", text: "text-[#10B981]", icon: "text-[#10B981]" },
  yellow: { bg: "bg-amber-50", text: "text-amber-600", icon: "text-amber-500" },
  navy: { bg: "bg-[#0F3D5E]/8", text: "text-[#0F3D5E]", icon: "text-[#0F3D5E]" },
  red: { bg: "bg-rose-50", text: "text-rose-600", icon: "text-rose-500" },
};

export default function StatCard({ label, value, icon: Icon, color = "navy", href }: Props) {
  const c = colorMap[color];
  const content = (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${c.icon}`} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className={`text-xl font-heading font-bold ${c.text} leading-none`}>{value}</p>
        <p className="text-xs text-slate-400 mt-0.5 leading-snug">{label}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block hover:scale-[1.02] transition-transform">
        {content}
      </Link>
    );
  }

  return content;
}
