import { z } from "zod";

export const leadSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo"),
  company: z
    .string()
    .min(2, "Nome da empresa deve ter pelo menos 2 caracteres")
    .max(100, "Nome da empresa muito longo"),
  email: z
    .string()
    .email("Digite um e-mail válido")
    .max(150, "E-mail muito longo"),
  phone: z
    .string()
    .min(10, "Digite um telefone válido com DDD")
    .max(20, "Telefone inválido")
    .regex(
      /^[\d\s\(\)\-\+]+$/,
      "Telefone deve conter apenas números e símbolos"
    ),
  revenue: z.enum(
    ["ate-50k", "50k-150k", "150k-500k", "acima-500k"],
    { message: "Selecione uma faixa de faturamento" }
  ),
});

export type LeadFormData = z.infer<typeof leadSchema>;

export const toolLeadSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo"),
  company: z
    .string()
    .min(2, "Nome da empresa deve ter pelo menos 2 caracteres")
    .max(100, "Nome da empresa muito longo"),
  email: z
    .string()
    .email("Digite um e-mail válido")
    .max(150, "E-mail muito longo"),
  whatsapp: z
    .string()
    .min(10, "Digite um WhatsApp válido com DDD")
    .max(20, "Número inválido")
    .regex(/^[\d\s\(\)\-\+]+$/, "WhatsApp deve conter apenas números e símbolos"),
  employees: z.enum(["1", "2-5", "6-20", "21-50", "50+"], {
    message: "Selecione o número de funcionários",
  }),
});

export type ToolLeadFormData = z.infer<typeof toolLeadSchema>;
