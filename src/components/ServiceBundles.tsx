import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Truck, Building, TreeDeciduous, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface BundleCardProps {
  title: string;
  icon: LucideIcon;
  includes: string[];
  price: string;
  description: string;
  buttonText: string;
  path: string;
  isRecommended?: boolean;
}

const BundleCard = ({ 
  title, 
  icon: Icon, 
  includes, 
  price, 
  description, 
  buttonText, 
  path,
  isRecommended 
}: BundleCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className={`flex flex-col h-full transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 ${isRecommended ? 'ring-2 ring-primary/20 bg-primary/[0.02]' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          {isRecommended && (
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
              Recommended
            </Badge>
          )}
        </div>
        <CardTitle className="text-base font-semibold mt-3">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 pt-0">
        <div className="mb-3 space-y-1.5">
          {includes.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
              {item}
            </div>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground mb-3 flex-1">
          {description}
        </p>
        
        <div className="mb-3">
          <p className="text-lg font-semibold text-foreground">{price}</p>
        </div>
        
        <Button 
          onClick={() => navigate(path)} 
          variant={isRecommended ? "default" : "outline"}
          size="sm"
          className="w-full"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

const ServiceBundles = () => {
  const bundles: BundleCardProps[] = [
    {
      title: "Home Care Bundle",
      icon: Home,
      includes: ["Home Cleaning", "Laundry & light tidying"],
      price: "From R410",
      description: "Ideal for busy households looking for a reliable reset.",
      buttonText: "Request This Bundle",
      path: "/cleaning?type=home&bundle=home-care",
    },
    {
      title: "Move-Out Stress Saver",
      icon: Truck,
      includes: ["Deep / Moving Cleaning", "Rubble or unwanted item removal"],
      price: "From R1,180",
      description: "Perfect for tenants, landlords and property handovers.",
      buttonText: "Request This Bundle",
      path: "/cleaning?type=deep&bundle=move-out",
    },
    {
      title: "Airbnb Host Bundle",
      icon: Building,
      includes: ["Airbnb turnover cleaning", "Linen change support", "Restocking checklist"],
      price: "From R180/turnover",
      description: "Reliable, consistent cleaning for hosts who value 5-star reviews.",
      buttonText: "Enquire for Airbnb Bundle",
      path: "/cleaning?type=airbnb&bundle=host",
    },
    {
      title: "Outdoor Refresh Bundle",
      icon: TreeDeciduous,
      includes: ["Garden clean-up", "Outdoor wash-down"],
      price: "From R390",
      description: "Give your outdoor space a fresh, clean look.",
      buttonText: "Request This Bundle",
      path: "/cleaning?type=outdoor&bundle=refresh",
    },
    {
      title: "Hygiene Essentials Bundle",
      icon: Sparkles,
      includes: ["Home Cleaning", "Bin Cleaning"],
      price: "From R390",
      description: "Perfect for families focused on hygiene and freshness.",
      buttonText: "Request This Bundle",
      path: "/cleaning?type=home&bundle=hygiene",
      isRecommended: true,
    },
  ];

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 bg-muted/30">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
            Popular Service Bundles
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Save time and money with our most requested combinations.
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => (
            <BundleCard key={bundle.title} {...bundle} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceBundles;
