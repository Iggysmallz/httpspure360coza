import { SprayCan, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: SprayCan,
    title: "Home Cleaning",
    description:
      "Keep your home spotless with our reliable, recurring or once-off cleaning service. Our trained, company-managed cleaners handle everything — so you can enjoy a fresh, healthy living space without lifting a finger.",
    path: "/cleaning",
  },
  {
    icon: Truck,
    title: "Removal & Junk Removal",
    description:
      "Need rubble cleared, old furniture collected, or a full property cleanout? Our professional removal team handles it safely and efficiently, saving you the time and hassle of doing it yourself.",
    path: "/removals",
  },
];

const OurServices = () => {
  const navigate = useNavigate();

  return (
    <section id="services" className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
            Our Services
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Professional, managed services you can count on — every time.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <Card
              key={service.title}
              className="flex flex-col transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
            >
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <Button
                  onClick={() => navigate(service.path)}
                  variant="outline"
                  className="w-full"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground italic">
          Additional services launching soon.
        </p>
      </div>
    </section>
  );
};

export default OurServices;
