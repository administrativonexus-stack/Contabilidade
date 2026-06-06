"use client";

import { useState, useTransition, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { TicketStatus } from "@/types/database";

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  created_at: string;
  is_admin: boolean;
}

interface Props {
  ticketId: string;
  adminId: string;
  currentStatus: TicketStatus;
  statusOptions: { value: TicketStatus; label: string }[];
  messages: Message[];
  currentAdminId: string;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function AdminReplyForm({ ticketId, adminId, currentStatus, statusOptions, messages, currentAdminId }: Props) {
  const [status, setStatus] = useState<TicketStatus>(currentStatus);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const message = fd.get("message") as string;
    const newStatus = fd.get("status") as TicketStatus;

    startTransition(async () => {
      const supabase = createClient();

      if (message?.trim()) {
        const { error: msgError } = await supabase.from("ticket_messages").insert({
          ticket_id: ticketId,
          sender_id: adminId,
          message: message.trim(),
        });
        if (msgError) { setError("Erro ao enviar mensagem."); return; }
      }

      if (newStatus !== currentStatus) {
        const { error: statusError } = await supabase.from("tickets").update({ status: newStatus }).eq("id", ticketId);
        if (statusError) { setError("Erro ao atualizar status."); return; }
        setStatus(newStatus);
      }

      formRef.current?.reset();
      router.refresh();
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <p className="text-sm font-heading font-semibold text-[#0F3D5E]">Mensagens</p>
        <form>
          <select
            name="status_quick"
            value={status}
            onChange={async (e) => {
              const newStatus = e.target.value as TicketStatus;
              setStatus(newStatus);
              const supabase = createClient();
              await supabase.from("tickets").update({ status: newStatus }).eq("id", ticketId);
              router.refresh();
            }}
            className="h-8 px-3 rounded-xl border border-slate-200 text-xs text-[#1E293B] bg-white focus:outline-none cursor-pointer"
          >
            {statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </form>
      </div>

      <div className="p-5 space-y-4 min-h-[200px] max-h-[400px] overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">Nenhuma mensagem ainda.</p>
        )}
        {messages.map((msg) => {
          const isAdmin = msg.sender_id === currentAdminId;
          return (
            <div key={msg.id} className={`flex gap-3 ${isAdmin ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${isAdmin ? "bg-[#0F3D5E] text-white" : "bg-slate-200 text-slate-600"}`}>
                {getInitials(msg.sender_name)}
              </div>
              <div className={`max-w-[75%] flex flex-col gap-1 ${isAdmin ? "items-end" : "items-start"}`}>
                <p className="text-[10px] text-slate-400">{msg.sender_name}</p>
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${isAdmin ? "bg-[#0F3D5E] text-white rounded-tr-sm" : "bg-slate-100 text-[#1E293B] rounded-tl-sm"}`}>
                  {msg.message}
                </div>
                <span className="text-[10px] text-slate-400">{formatTime(msg.created_at)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-4 border-t border-slate-100">
        {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
        <form ref={formRef} onSubmit={handleReply} className="flex gap-3">
          <textarea
            name="message"
            rows={2}
            placeholder="Responder ao cliente..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors resize-none"
          />
          <input type="hidden" name="status" value={status} />
          <button type="submit" disabled={isPending} className="w-11 h-11 rounded-xl bg-[#0F3D5E] text-white flex items-center justify-center hover:bg-[#0d3352] transition-colors disabled:opacity-60 flex-shrink-0 self-end">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
