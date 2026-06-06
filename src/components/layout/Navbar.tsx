"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, TrendingUp } from "lucide-react";
import { NAV_LINKS, WHATSAPP_URL } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[20] transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgb(15_61_94/0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20"
        aria-label="Navegação principal"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-heading font-700 text-[#0F3D5E] flex-shrink-0"
          aria-label="Nexus Contabilidade - Página inicial"
        >
          <span className="w-8 h-8 rounded-lg bg-[#0F3D5E] flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-semibold">
            Nexus <span className="text-[#2563EB]">Contabilidade</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#475569] hover:text-[#0F3D5E] transition-colors duration-200 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[#2563EB] after:transition-all after:duration-200 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/client-portal/login"
            className="px-5 py-2.5 rounded-lg border border-[#0F3D5E] text-[#0F3D5E] text-sm font-semibold hover:bg-[#0F3D5E] hover:text-white transition-all duration-200"
          >
            Portal do Cliente
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg bg-[#0F3D5E] text-white text-sm font-semibold hover:bg-[#1a4f75] transition-colors duration-200"
          >
            Falar no WhatsApp
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 rounded-lg text-[#0F3D5E] hover:bg-[#F8FAFC] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="lg:hidden bg-white/98 backdrop-blur-md border-t border-slate-100 px-4 pb-6 pt-2"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 px-3 rounded-lg text-[#475569] font-medium hover:text-[#0F3D5E] hover:bg-[#F8FAFC] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-slate-100 mt-2 pt-4 flex flex-col gap-2">
                <Link
                  href="/client-portal/login"
                  onClick={() => setMenuOpen(false)}
                  className="py-3 px-4 rounded-lg border border-[#0F3D5E] text-[#0F3D5E] font-semibold text-center hover:bg-[#0F3D5E] hover:text-white transition-all"
                >
                  Portal do Cliente
                </Link>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-lg bg-[#0F3D5E] text-white font-semibold text-center hover:bg-[#1a4f75] transition-colors"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
