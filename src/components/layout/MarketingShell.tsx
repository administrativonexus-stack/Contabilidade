"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const PORTAL_PREFIXES = ["/client-portal", "/admin"];

export default function MarketingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPortal = PORTAL_PREFIXES.some((p) => pathname.startsWith(p));

  if (isPortal) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
