import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import StatusBadge from "@/components/portal/StatusBadge";
import AdminReplyForm from "./AdminReplyForm";
import type { TicketStatus } from "@/types/database";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default async function AdminRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: adminProfile } = await supabase.from("users").select("id, full_name").eq("auth_user_id", user!.id).single();

  const { data: ticket } = await supabase
    .from("tickets")
    .select("*, companies(company_name), users!created_by(full_name)")
    .eq("id", id)
    .single();

  if (!ticket) notFound();

  const { data: messages } = await supabase
    .from("ticket_messages")
    .select("*, users!sender_id(full_name)")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
    { value: "open", label: "Aberta" },
    { value: "in_progress", label: "Em andamento" },
    { value: "waiting_client", label: "Aguardando cliente" },
    { value: "completed", label: "Concluída" },
    { value: "cancelled", label: "Cancelada" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/admin/requests" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D5E] transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" /> Solicitações
        </Link>
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-heading font-bold text-[#0F3D5E] truncate">{ticket.subject}</h1>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <StatusBadge status={ticket.status} />
              <span className="text-xs text-slate-400">{(ticket.companies as { company_name: string } | null)?.company_name}</span>
              <span className="text-xs text-slate-400">por {(ticket.users as { full_name: string } | null)?.full_name}</span>
              <span className="text-xs text-slate-400">{formatDate(ticket.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Update status */}
      <AdminReplyForm
        ticketId={id}
        adminId={adminProfile?.id ?? ""}
        currentStatus={ticket.status}
        statusOptions={STATUS_OPTIONS}
        messages={(messages ?? []).map((m) => ({
          id: m.id,
          sender_id: m.sender_id,
          sender_name: (m.users as { full_name: string } | null)?.full_name ?? "Usuário",
          message: m.message,
          created_at: m.created_at,
          is_admin: m.sender_id === adminProfile?.id,
        }))}
        currentAdminId={adminProfile?.id ?? ""}
      />

      {/* Original description */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Descrição original</p>
        <p className="text-sm text-slate-600 whitespace-pre-wrap">{ticket.description}</p>
      </div>
    </div>
  );
}
