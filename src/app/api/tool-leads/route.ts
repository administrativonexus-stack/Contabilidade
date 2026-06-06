import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { toolLeadSchema } from "@/lib/validations";

const LEADS_FILE = path.join(process.cwd(), "src/data/tool-leads.json");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { monthlySalary, taxRegime, estimatedSavings, ...formData } = body;

    const parsed = toolLeadSchema.safeParse(formData);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const lead = {
      ...parsed.data,
      monthlySalary: typeof monthlySalary === "number" ? monthlySalary : 0,
      taxRegime: typeof taxRegime === "string" ? taxRegime : "",
      estimatedSavings: typeof estimatedSavings === "number" ? estimatedSavings : 0,
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID(),
    };

    let leads: unknown[] = [];
    try {
      const raw = await fs.readFile(LEADS_FILE, "utf-8");
      leads = JSON.parse(raw);
    } catch {
      // File doesn't exist yet — start fresh
    }

    leads.push(lead);
    await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}
