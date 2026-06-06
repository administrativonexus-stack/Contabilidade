import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import MarketingShell from "@/components/layout/MarketingShell";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus Contabilidade | Contabilidade Digital para Empresas",
  description:
    "Serviços completos de contabilidade, fiscal, departamento pessoal e consultoria empresarial. Tecnologia e expertise para simplificar sua gestão financeira.",
  keywords: [
    "contabilidade digital",
    "escritório contábil",
    "contabilidade empresarial",
    "BPO financeiro",
    "planejamento tributário",
    "abertura de empresa",
  ],
  authors: [{ name: "Nexus Contabilidade" }],
  openGraph: {
    title: "Nexus Contabilidade | Contabilidade Digital para Empresas",
    description:
      "Contabilidade completa com tecnologia e suporte especializado. Simplifique sua gestão financeira.",
    type: "website",
    locale: "pt_BR",
    siteName: "Nexus Contabilidade",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Contabilidade | Contabilidade Digital",
    description:
      "Contabilidade completa com tecnologia e suporte especializado.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    name: "Nexus Contabilidade",
    description:
      "Escritório de contabilidade digital com serviços completos de contabilidade, fiscal, RH e consultoria.",
    url: "https://nexuscontabilidade.com.br",
    telephone: "+55-11-99999-9999",
    address: {
      "@type": "PostalAddress",
      addressCountry: "BR",
    },
    sameAs: [
      "https://www.linkedin.com/company/nexus-contabilidade",
      "https://www.instagram.com/nexuscontabilidade",
    ],
  };

  return (
    <html
      lang="pt-BR"
      className={`${plusJakarta.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo principal
        </a>
        <MarketingShell>{children}</MarketingShell>
      </body>
    </html>
  );
}
