import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SprayCan, Sparkles, Home, TreeDeciduous, Truck, Trash2 } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface PricingCardProps {
  title: string;
  icon: LucideIcon;
  features: string[];
  pricing: string;
  path: string;
}

const PricingCard = ({ title, icon: Icon, features, pricing, path }: PricingCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <ul className="mb-4 space-y-2 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mb-4">
          <p className="text-lg font-semibold text-foreground">{pricing}</p>
        </div>
        <Button 
          onClick={() => navigate(path)} 
          variant="outline" 
          className="w-full"
        >
          Request a Quote
        </Button>
      </CardContent>
    </Card>
  );
};

const PricingSection = () => {
  const pricingData: PricingCardProps[] = [
    {
      title: "Home Cleaning",
      icon: SprayCan,
      features: ["Once-off cleaning", "Weekly / Fortnightly options"],
      pricing: "From R285",
      path: "/cleaning?type=home",
    },
    {
      title: "Deep & Moving Cleaning",
      icon: Sparkles,
      features: ["Move-in / Move-out", "Deep cleans"],
      pricing: "From R235 depending on size",
      path: "/cleaning?type=deep",
    },
    {
      title: "Airbnb & Short-Stay",
      icon: Home,
      features: ["Per turnover clean", "Optional linen & restocking support"],
      pricing: "Per booking",
      path: "/cleaning?type=airbnb",
    },
    {
      title: "Outdoor & Garden",
      icon: TreeDeciduous,
      features: ["Once-off or maintenance", "Gardening & outdoor cleaning"],
      pricing: "Hourly or per job",
      path: "/cleaning?type=outdoor",
    },
    {
      title: "Rubble & Furniture Removal",
      icon: Truck,
      features: ["Small, medium and large loads", "Safe disposal included"],
      pricing: "Quoted after assessment",
      path: "/removals",
    },
    {
      title: "Bin Cleaning",
      icon: Trash2,
      features: ["Monthly or once-off", "Eco-friendly deodorising"],
      pricing: "Per bin",
      path: "/cleaning?type=bin",
    },
  ];

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
            Simple, transparent pricing.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Final pricing may vary based on size, scope and location. Our team will confirm via WhatsApp.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pricingData.map((item) => (
            <PricingCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
