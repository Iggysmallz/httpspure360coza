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
import ServiceCard from "@/components/ServiceCard";
import PricingSection from "@/components/PricingSection";
import ServiceBundles from "@/components/ServiceBundles";
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

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </Layout>
  );
};

export default Services;
