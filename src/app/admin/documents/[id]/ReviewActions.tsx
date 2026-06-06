"use client";

import { useState, useTransition } from "react";
import { CheckCircle, XCircle, MessageCircle, Archive, Loader2, Send } from "lucide-react";
import type { DocumentWorkflowStatus } from "@/types/database";
import { reviewDocument, addInternalNote, addPublicComment } from "../actions";

interface Props {
  documentId: string;
  currentStatus: DocumentWorkflowStatus;
}

const ACTIONS: { status: DocumentWorkflowStatus; label: string; icon: React.ElementType; color: string }[] = [
  { status: "approved", label: "Aprovar", icon: CheckCircle, color: "bg-emerald-600 hover:bg-emerald-700 text-white" },
  { status: "under_review", label: "Em Revisão", icon: MessageCircle, color: "bg-amber-500 hover:bg-amber-600 text-white" },
  { status: "pending_information", label: "Solicitar Info", icon: MessageCircle, color: "bg-orange-500 hover:bg-orange-600 text-white" },
  { status: "rejected", label: "Rejeitar", icon: XCircle, color: "bg-rose-600 hover:bg-rose-700 text-white" },
  { status: "archived", label: "Arquivar", icon: Archive, color: "bg-slate-500 hover:bg-slate-600 text-white" },
];

export default function ReviewActions({ documentId, currentStatus }: Props) {
  const [reason, setReason] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleReview(newStatus: DocumentWorkflowStatus) {
    setFeedback(null);
    startTransition(async () => {
      const result = await reviewDocument(documentId, newStatus, reason || undefined);
      if (result.error) setFeedback({ type: "error", text: result.error });
      else { setFeedback({ type: "success", text: "Status atualizado!" }); setReason(""); }
    });
  }

  function handleNote() {
    if (!noteContent.trim()) return;
    setFeedback(null);
    startTransition(async () => {
      const result = await addInternalNote(documentId, noteContent);
      if (result.error) setFeedback({ type: "error", text: result.error });
      else { setFeedback({ type: "success", text: "Nota salva." }); setNoteContent(""); }
    });
  }

  function handleComment() {
    if (!commentContent.trim()) return;
    setFeedback(null);
    startTransition(async () => {
      const result = await addPublicComment(documentId, commentContent);
      if (result.error) setFeedback({ type: "error", text: result.error });
      else { setFeedback({ type: "success", text: "Comentário enviado ao cliente." }); setCommentContent(""); }
    });
  }

  return (
    <div className="space-y-5">
      {/* Status actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[#0F3D5E]">Alterar Status</h3>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Motivo / comentário (opcional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="Ex: Documento aprovado. / Favor reenviar com assinatura."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 resize-none transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-1 xl:grid-cols-2 gap-2">
          {ACTIONS.filter((a) => a.status !== currentStatus).map(({ status, label, icon: Icon, color }) => (
            <button
              key={status}
              onClick={() => handleReview(status)}
              disabled={isPending}
              className={`h-9 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60 ${color}`}
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Nota interna */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-[#0F3D5E]">Nota Interna</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Visível apenas para a equipe</p>
        </div>
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          rows={3}
          placeholder="Anotação interna sobre este documento..."
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 resize-none transition-colors"
        />
        <button
          onClick={handleNote}
          disabled={isPending || !noteContent.trim()}
          className="w-full h-9 rounded-xl bg-[#0F3D5E] text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#0d3352] disabled:opacity-60 transition-colors"
        >
          <Send className="w-3.5 h-3.5" /> Salvar Nota
        </button>
      </div>

      {/* Comentário para o cliente */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-[#0F3D5E]">Mensagem ao Cliente</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Visível para o cliente no portal</p>
        </div>
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          rows={3}
          placeholder="Mensagem que será exibida para o cliente..."
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 resize-none transition-colors"
        />
        <button
          onClick={handleComment}
          disabled={isPending || !commentContent.trim()}
          className="w-full h-9 rounded-xl bg-[#2563EB] text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          <Send className="w-3.5 h-3.5" /> Enviar ao Cliente
        </button>
      </div>

      {feedback && (
        <div className={`text-sm px-3 py-2 rounded-xl ${feedback.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
          {feedback.text}
        </div>
      )}
    </div>
  );
}
