import Hero from "@/components/sections/Hero";
import TrustIndicators from "@/components/sections/TrustIndicators";
import Services from "@/components/sections/Services";
import BusinessTools from "@/components/sections/BusinessTools";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import LeadCTA from "@/components/sections/LeadCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustIndicators />
      <Services />
      <BusinessTools />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <LeadCTA />
    </>
  );
}
