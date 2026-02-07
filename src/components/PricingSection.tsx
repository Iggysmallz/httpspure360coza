import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SprayCan, Sparkles, Clock, Check } from "lucide-react";

interface PricingTier {
  name: string;
  price: string;
  description: string;
  includes: string[];
  note?: string;
  badge?: string;
  icon: React.ReactNode;
}

const PricingCard = ({ tier, onBook }: { tier: PricingTier; onBook: () => void }) => (
  <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 relative">
    {tier.badge && (
      <Badge className="absolute -top-2.5 right-4 bg-primary text-primary-foreground text-xs">
        {tier.badge}
      </Badge>
    )}
    <CardHeader className="pb-3">
      <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
        {tier.icon}
      </div>
      <CardTitle className="text-base font-semibold">{tier.name}</CardTitle>
      <p className="text-xl font-bold text-primary">{tier.price}</p>
      <p className="text-xs text-muted-foreground">{tier.description}</p>
    </CardHeader>
    <CardContent className="flex flex-col flex-1 pt-0">
      <ul className="mb-4 space-y-1.5 flex-1">
        {tier.includes.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
            <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {tier.note && (
        <p className="mb-3 text-[11px] text-muted-foreground/80 italic">{tier.note}</p>
      )}
      <Button onClick={onBook} variant="outline" size="sm" className="w-full">
        Book Now
      </Button>
    </CardContent>
  </Card>
);

const PricingSection = () => {
  const navigate = useNavigate();
  const handleBook = () => navigate("/cleaning?type=home");

  const tiers: PricingTier[] = [
    {
      name: "Express Clean",
      price: "From R179",
      description: "Quick, light cleaning — approx. 1.5–2 hours",
      badge: "Quick & Easy",
      icon: <Clock className="h-5 w-5 text-primary" />,
      includes: [
        "Light surface wiping",
        "Floor sweep & mop",
        "Kitchen & bathroom touch-up",
        "General tidying",
      ],
      note: "R179 Mon–Thu · R279 Fri–Sun",
    },
    {
      name: "Standard Clean — 1–2 Bed",
      price: "R230",
      description: "Ideal for regular home cleaning",
      icon: <SprayCan className="h-5 w-5 text-primary" />,
      includes: [
        "Kitchen cleaning",
        "Bathroom cleaning",
        "Dusting & surface wiping",
        "Floor sweep & mop",
      ],
      note: "Duration varies by home size & condition",
    },
    {
      name: "Standard Clean — 3 Bed",
      price: "R280",
      description: "Ideal for regular home cleaning",
      badge: "Most Popular",
      icon: <SprayCan className="h-5 w-5 text-primary" />,
      includes: [
        "Kitchen cleaning",
        "Bathroom cleaning",
        "Dusting & surface wiping",
        "Floor sweep & mop",
      ],
      note: "Duration varies by home size & condition",
    },
    {
      name: "Standard Clean — 4+ Bed",
      price: "R330",
      description: "Ideal for regular home cleaning",
      icon: <SprayCan className="h-5 w-5 text-primary" />,
      includes: [
        "Kitchen cleaning",
        "Bathroom cleaning",
        "Dusting & surface wiping",
        "Floor sweep & mop",
      ],
      note: "Duration varies by home size & condition",
    },
    {
      name: "Deep Clean",
      price: "From R380",
      description: "Move-ins, move-outs, or seasonal deep cleaning",
      icon: <Sparkles className="h-5 w-5 text-primary" />,
      includes: [
        "Detailed kitchen & bathroom cleaning",
        "Inside cupboards (if empty)",
        "Fridge & oven exterior",
        "Floors, skirting & surfaces",
      ],
      note: "Final price confirmed after reviewing details",
    },
  ];

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Intro */}
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
            Clear, Affordable Pricing — No Hidden Fees
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Know exactly what you're paying before you book. Every price is confirmed upfront — no surprises, no extras added without your approval.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
          {tiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} onBook={handleBook} />
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center space-y-1 rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground">
            Prices may vary depending on home size, condition, and specific requirements.
          </p>
          <p className="text-xs text-muted-foreground">
            Final pricing is always confirmed before your booking is accepted — so you're never caught off guard.
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            All services include vetted, professional staff.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
