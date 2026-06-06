import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { leadSchema } from "@/lib/validations";
import type { Database } from "@/types/database";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, company, email, phone, revenue } = parsed.data;

    await supabase.from("crm_leads").insert({
      name,
      company_name: company,
      email,
      phone: phone ?? null,
      source: "Landing Page",
      notes: revenue ? `Faturamento: ${revenue}` : null,
      status: "new",
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
  }
}
