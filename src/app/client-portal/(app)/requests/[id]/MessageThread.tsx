"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { sendMessage } from "../actions";

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

interface Props {
  messages: Message[];
  currentUserId: string;
  ticketId: string;
  isActive: boolean;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function MessageThread({ messages, currentUserId, ticketId, isActive }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await sendMessage(ticketId, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <p className="text-sm font-heading font-semibold text-[#0F3D5E]">Mensagens</p>
      </div>

      <div className="p-5 space-y-4 min-h-[200px] max-h-[480px] overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">Nenhuma mensagem ainda. Envie uma abaixo.</p>
        )}
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} className={`flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${isOwn ? "bg-[#2563EB] text-white" : "bg-slate-200 text-slate-600"}`}>
                {getInitials(msg.sender_name)}
              </div>
              <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${isOwn ? "bg-[#0F3D5E] text-white rounded-tr-sm" : "bg-slate-100 text-[#1E293B] rounded-tl-sm"}`}>
                  {msg.message}
                </div>
                <span className="text-[10px] text-slate-400">{formatTime(msg.created_at)}</span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {isActive && (
        <div className="px-5 py-4 border-t border-slate-100">
          {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
          <form ref={formRef} action={handleSend} className="flex gap-3">
            <textarea
              name="message"
              required
              rows={2}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={isPending}
              className="w-11 h-11 rounded-xl bg-[#0F3D5E] text-white flex items-center justify-center hover:bg-[#0d3352] transition-colors disabled:opacity-60 flex-shrink-0 self-end"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}

      {!isActive && (
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-400 text-center">Esta solicitação está encerrada.</p>
        </div>
      )}
    </div>
  );
}
