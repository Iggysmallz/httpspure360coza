import { useNavigate } from "react-router-dom";
import { SprayCan, Truck } from "lucide-react";
import Layout from "@/components/Layout";
import ServiceCard from "@/components/ServiceCard";
import PricingSection from "@/components/PricingSection";
import WhatsAppButton from "@/components/WhatsAppButton";

const Services = () => {
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
      title: "Rubble & Furniture Removal",
      description: "Safe removal of rubble, old furniture and unwanted items.",
      icon: Truck,
      path: "/removals",
      urgencyText: "High demand in selected areas",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Our Services
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional solutions for every home and property need
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
            {services.map((service) => (
              <ServiceCard
                key={service.path + service.title}
                title={service.title}
                description={service.description}
                icon={service.icon}
                onClick={() => navigate(service.path)}
                urgencyText={service.urgencyText}
              />
            ))}
          </div>

          {/* More services coming soon */}
          <div className="mt-10 text-center rounded-2xl border border-border bg-muted/30 p-8">
            <p className="text-lg font-semibold text-foreground mb-2">
              More exciting services coming soon
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We're working on bringing you even more professional home and property services. Stay tuned!
            </p>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </Layout>
  );
};

export default Services;
