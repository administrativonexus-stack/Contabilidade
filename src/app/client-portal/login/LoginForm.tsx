"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { signIn, resetPassword } from "./actions";

type View = "login" | "reset";

const inputClass = "w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors";

export default function LoginForm() {
  const [view, setView] = useState<View>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleLogin(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signIn(formData);
      if (result?.error) setError(result.error);
    });
  }

  async function handleReset(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await resetPassword(formData);
      if (result?.error) setError(result.error);
      if (result?.success) setSuccess(result.success);
    });
  }

  if (view === "reset") {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-base font-heading font-semibold text-[#0F3D5E] mb-1">Redefinir senha</h2>
        <p className="text-sm text-slate-500 mb-6">Informe seu e-mail para receber o link de redefinição.</p>

        <form action={handleReset} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input name="email" type="email" placeholder="seu@email.com" required className={inputClass} />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
          {success && <p className="text-sm text-[#10B981] bg-green-50 border border-green-100 rounded-lg px-3 py-2">{success}</p>}

          <button type="submit" disabled={isPending} className="w-full h-11 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0d3352] transition-colors disabled:opacity-60">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar link"}
          </button>
        </form>

        <button onClick={() => { setView("login"); setError(null); setSuccess(null); }} className="mt-4 w-full text-center text-sm text-[#2563EB] hover:underline">
          Voltar ao login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
      <form action={handleLogin} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input name="email" type="email" placeholder="E-mail" required autoComplete="email" className={inputClass} />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            required
            autoComplete="current-password"
            className={`${inputClass} pr-10`}
          />
          <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button type="submit" disabled={isPending} className="w-full h-11 rounded-xl bg-gradient-to-r from-[#0F3D5E] to-[#2563EB] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar"}
        </button>
      </form>

      <button onClick={() => { setView("reset"); setError(null); }} className="mt-4 w-full text-center text-sm text-[#2563EB] hover:underline">
        Esqueci minha senha
      </button>
    </div>
  );
}
