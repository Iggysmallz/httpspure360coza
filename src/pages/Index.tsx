import { useNavigate } from "react-router-dom";
import { 
  SprayCan, 
  Sparkles, 
  TreeDeciduous, 
  Home, 
  Truck, 
  Heart, 
  Trash2,
  Car,
  Waves,
  LayoutGrid
} from "lucide-react";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import WhyChooseUs from "@/components/WhyChooseUs";
import ContactSection from "@/components/ContactSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import PricingSection from "@/components/PricingSection";
import UrgencyBanner from "@/components/UrgencyBanner";
import ServiceBundles from "@/components/ServiceBundles";

const Index = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Home Cleaning",
      description: "Reliable recurring or once-off home cleaning services.",
      icon: SprayCan,
      path: "/cleaning?type=home",
      urgencyText: "Popular service — early booking recommended",
    },
    {
      title: "Deep & Moving Cleaning",
      description: "Move-in, move-out and deep cleaning solutions.",
      icon: Sparkles,
      path: "/cleaning?type=deep",
      urgencyText: "High demand in selected areas",
    },
    {
      title: "Outdoor & Garden",
      description: "Gardening, outdoor cleaning and maintenance.",
      icon: TreeDeciduous,
      path: "/cleaning?type=outdoor",
      urgencyText: "Limited availability during month-end",
    },
    {
      title: "Airbnb & Short-Stay",
      description: "Professional turnover cleans for short-term rentals.",
      icon: Home,
      path: "/cleaning?type=airbnb",
      urgencyText: "Popular with Cape Town hosts",
    },
    {
      title: "Rubble & Furniture Removal",
      description: "Safe removal of rubble, old furniture and unwanted items.",
      icon: Truck,
      path: "/removals",
      urgencyText: "High demand in selected areas",
    },
    {
      title: "Care Services",
      description: "Elderly care and in-home assistance, including nurse-supported services.",
      icon: Heart,
      path: "/care",
      urgencyText: "Limited availability — book ahead",
    },
    {
      title: "Bin Cleaning",
      description: "Hygienic, eco-friendly bin cleaning and deodorising services.",
      icon: Trash2,
      path: "/cleaning?type=bin",
      urgencyText: "Popular service — early booking recommended",
    },
    {
      title: "Car Wash",
      description: "Convenient car wash services at your home or office.",
      icon: Car,
      path: "/coming-soon?service=car-wash",
      urgencyText: "Launching soon",
      comingSoon: true,
    },
    {
      title: "Pool Cleaning",
      description: "Professional pool cleaning and maintenance services.",
      icon: Waves,
      path: "/coming-soon?service=pool-cleaning",
      urgencyText: "Launching soon",
      comingSoon: true,
    },
    {
      title: "Window Cleaning",
      description: "Crystal-clear windows inside and out.",
      icon: LayoutGrid,
      path: "/coming-soon?service=window-cleaning",
      urgencyText: "Launching soon",
      comingSoon: true,
    },
  ];

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleWorkWithUs = () => {
    navigate("/work-with-us");
  };

  return (
    <Layout>
      <UrgencyBanner />
      <Hero onBookService={scrollToServices} onWorkWithUs={handleWorkWithUs} />
      
      {/* Services Section */}
      <section id="services" className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
              Our Services
            </h2>
            <p className="text-muted-foreground">
              Professional solutions for every home and property need
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.path + service.title}
                title={service.title}
                description={service.description}
                icon={service.icon}
                onClick={() => navigate(service.path)}
                urgencyText={service.urgencyText}
                comingSoon={service.comingSoon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Service Bundles Section */}
      <ServiceBundles />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Positioning Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            More than a booking platform.
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            PURE360 doesn't just connect you to workers — we manage the service. 
            Our team handles coordination, quality checks and customer support so 
            you can enjoy peace of mind.
          </p>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="mb-6 text-xl font-semibold text-foreground">
            Trusted by Cape Town Families
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">4.9★</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24hr</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
          </div>
        </div>
      </section>

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
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Our Services
            </button>
            <button
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
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
