"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { updateProfile } from "./actions";

interface Props {
  defaultValues: {
    email: string;
    phone: string;
    address: string;
    responsible_person: string;
  };
}

const inputClass = "w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-[#0F3D5E] focus:ring-[#0F3D5E]/20 transition-colors";

export default function ProfileForm({ defaultValues }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) setError(result.error);
      if (result?.success) setSuccess(result.success);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">E-mail</label>
          <input name="email" type="email" defaultValue={defaultValues.email} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Telefone</label>
          <input name="phone" type="tel" defaultValue={defaultValues.phone} placeholder="(11) 99999-9999" className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1.5">Responsável</label>
        <input name="responsible_person" type="text" defaultValue={defaultValues.responsible_person} placeholder="Nome do responsável" maxLength={100} className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1.5">Endereço</label>
        <input name="address" type="text" defaultValue={defaultValues.address} placeholder="Rua, número, bairro, cidade" maxLength={200} className={inputClass} />
      </div>

      {error && <p role="alert" className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
      {success && (
        <div className="flex items-center gap-2 text-sm text-[#10B981] bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {success}
        </div>
      )}

      <button type="submit" disabled={isPending} className="h-11 px-6 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#0d3352] transition-colors disabled:opacity-60">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar alterações"}
      </button>
    </form>
  );
}
