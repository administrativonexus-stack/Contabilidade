"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { TESTIMONIALS } from "@/lib/constants";

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % TESTIMONIALS.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), []);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isHovered, next]);

  const testimonial = TESTIMONIALS[current];

  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#0F3D5E] bg-[#0F3D5E]/8 border border-[#0F3D5E]/15 px-3 py-1.5 rounded-full mb-5">
            <span className="w-1 h-1 rounded-full bg-[#0F3D5E]" />
            Depoimentos
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#0F3D5E] mb-4 leading-tight">
            O que nossos{" "}
            <span className="text-[#2563EB]">clientes dizem</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection>
          <div
            className="max-w-3xl mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative bg-white rounded-3xl p-8 sm:p-10 shadow-[0_4px_32px_rgba(15,61,94,0.08)] border border-slate-100 overflow-hidden">
              <Quote
                className="absolute top-6 right-8 w-10 h-10 text-slate-100"
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-[#1E293B] text-lg leading-relaxed mb-8 relative z-10">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0F3D5E] to-[#2563EB] flex items-center justify-center flex-shrink-0"
                      aria-hidden="true"
                    >
                      <span className="text-sm font-heading font-bold text-white">
                        {testimonial.initials}
                      </span>
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-[#0F3D5E] text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {testimonial.role} · {testimonial.company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={prev}
                aria-label="Depoimento anterior"
                className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#0F3D5E] hover:text-[#0F3D5E] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex gap-2" role="tablist" aria-label="Depoimentos">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === current}
                    aria-label={`Depoimento ${i + 1}`}
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === current ? "w-6 bg-[#0F3D5E]" : "w-1.5 bg-slate-200 hover:bg-slate-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                aria-label="Próximo depoimento"
                className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#0F3D5E] hover:text-[#0F3D5E] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
