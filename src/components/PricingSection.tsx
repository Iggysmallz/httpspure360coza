import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SprayCan, Truck } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface PricingItem {
  label: string;
  price: string;
}

interface PricingCardProps {
  title: string;
  icon: LucideIcon;
  pricingItems: PricingItem[];
  path: string;
}

const PricingCard = ({ title, icon: Icon, pricingItems, path }: PricingCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 pt-0">
        <div className="mb-4 space-y-2 flex-1">
          {pricingItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium text-foreground">{item.price}</span>
            </div>
          ))}
        </div>
        <Button 
          onClick={() => navigate(path)} 
          variant="outline" 
          size="sm"
          className="w-full"
        >
          Book Now
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
      pricingItems: [
        { label: "Once-off", price: "From R230" },
        { label: "Weekly", price: "From R210" },
      ],
      path: "/cleaning?type=home",
    },
    {
      title: "Rubble & Furniture Removal",
      icon: Truck,
      pricingItems: [
        { label: "Small load", price: "From R440" },
        { label: "Medium load", price: "From R780" },
        { label: "Large load", price: "From R1,280" },
      ],
      path: "/removals",
    },
  ];

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
            Transparent Pricing — Always Cheaper Than the Competition
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Prices start here — final cost is confirmed via WhatsApp before booking.
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {pricingData.map((item) => (
            <PricingCard key={item.title} {...item} />
          ))}
        </div>

        <div className="mt-8 text-center space-y-1">
          <p className="text-xs text-muted-foreground">
            Final price confirmed before booking. Prices may vary by home size and location.
          </p>
          <p className="text-xs text-muted-foreground">
            All services include vetted staff and quality guarantee.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
