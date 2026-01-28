import { useNavigate } from "react-router-dom";
import { SprayCan, Truck, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";

const Index = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Cleaning Services",
      description: "Professional home cleaning with flexible packages. Book regular, deep clean, or AirBnB turnover services.",
      icon: SprayCan,
      path: "/cleaning",
    },
    {
      title: "Removals",
      description: "Reliable furniture moving and rubble removal. Get a custom quote for your specific needs.",
      icon: Truck,
      path: "/removals",
    },
    {
      title: "Care Services",
      description: "Compassionate elderly companion care and professional nursing services for your loved ones.",
      icon: Heart,
      path: "/care",
    },
  ];

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      <Hero onGetStarted={scrollToServices} />
      
      {/* Services Section */}
      <section id="services" className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
              Our Services
            </h2>
            <p className="text-muted-foreground">
              Choose a service to get started
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.path}
                title={service.title}
                description={service.description}
                icon={service.icon}
                onClick={() => navigate(service.path)}
              />
            ))}
          </div>
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

      {/* Footer */}
      <footer className="border-t border-border bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">P</span>
            </div>
            <span className="font-semibold text-foreground">Pure360</span>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Professional Home & Care Services in Cape Town
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Pure360. All rights reserved.
          </p>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
