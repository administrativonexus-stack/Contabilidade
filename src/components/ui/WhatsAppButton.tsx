"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";

export default function WhatsAppButton() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="fixed bottom-6 right-6 z-[40] group">
      <span
        className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#1E293B] text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        aria-hidden="true"
      >
        Fale conosco
      </span>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir conversa no WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#10B981] text-white shadow-lg hover:bg-[#059669] transition-colors duration-200"
      >
        {!shouldReduceMotion && (
          <motion.span
            className="absolute inset-0 rounded-full bg-[#10B981]"
            animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            aria-hidden="true"
          />
        )}
        <MessageCircle className="w-6 h-6 relative z-10" strokeWidth={2} />
      </a>
    </div>
  );
}
