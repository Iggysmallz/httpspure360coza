import { useNavigate } from "react-router-dom";

import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import IntroSection from "@/components/IntroSection";
import OurServices from "@/components/OurServices";
import WhyChooseUs from "@/components/WhyChooseUs";
import ContactSection from "@/components/ContactSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import UrgencyBanner from "@/components/UrgencyBanner";
import ServiceAreaSection from "@/components/ServiceAreaSection";
import HowItWorks from "@/components/HowItWorks";


const Index = () => {
  const navigate = useNavigate();

  const handleRequestQuote = () => {
    navigate("/services");
  };

  return (
    <Layout>
      <UrgencyBanner />
      <Hero onRequestQuote={handleRequestQuote} />
      <IntroSection />
      <OurServices />
      <HowItWorks />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Service Area */}
      <ServiceAreaSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <footer className="border-t border-border bg-background px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Logo */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">P</span>
            </div>
            <span className="font-semibold text-foreground">Pure360</span>
          </div>
          
          {/* Navigation Links */}
          <nav className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/services")}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Our Services
            </button>
            <button
              onClick={() => navigate("/services")}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Book a Service
            </button>
            <button
              onClick={() => navigate("/work-with-us")}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Work With PURE360
            </button>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Contact Us
            </button>
          </nav>
          
          {/* Tagline & Copyright */}
          <div className="text-center">
            <p className="mb-2 text-sm font-medium text-foreground">
              PURE360 – Trusted home & property services.
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Pure360. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </Layout>
  );
};

export default Index;
