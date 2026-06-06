import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import StatusBadge from "@/components/portal/StatusBadge";
import MessageThread from "./MessageThread";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client-portal/login");

  const { data: profile } = await supabase.from("users").select("id, full_name, user_companies(company_id)").eq("auth_user_id", user.id).single();
  const companyId = (profile?.user_companies as { company_id: string }[] | null)?.[0]?.company_id;

  const { data: ticket } = await supabase.from("tickets").select("*").eq("id", id).eq("company_id", companyId ?? "").single();
  if (!ticket) notFound();

  const { data: messages } = await supabase
    .from("ticket_messages")
    .select("*, users!sender_id(full_name)")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  const isActive = ticket.status !== "completed" && ticket.status !== "cancelled";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/client-portal/requests" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" /> Voltar às solicitações
        </Link>
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-heading font-bold text-[#0F3D5E] truncate">{ticket.subject}</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <StatusBadge status={ticket.status} />
              <span className="text-xs text-slate-400">Criada em {formatDate(ticket.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Original description */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Descrição da solicitação</p>
        <p className="text-sm text-slate-600 whitespace-pre-wrap">{ticket.description}</p>
      </div>

      {/* Message thread */}
      <MessageThread
        messages={(messages ?? []).map((m) => ({
          id: m.id,
          sender_id: m.sender_id,
          sender_name: (m.users as { full_name: string } | null)?.full_name ?? "Usuário",
          message: m.message,
          created_at: m.created_at,
        }))}
        currentUserId={profile?.id ?? ""}
        ticketId={id}
        isActive={isActive}
      />
    </div>
  );
}
