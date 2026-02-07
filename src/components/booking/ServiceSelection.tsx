import { SprayCan, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceSelectionProps {
  value: string;
  onChange: (value: string) => void;
}

const services = [
  {
    id: "home_cleaning",
    name: "Home Cleaning",
    description: "Reliable recurring or once-off cleaning for your home or property.",
    icon: SprayCan,
  },
  {
    id: "removal_junk",
    name: "Removal & Junk Removal",
    description: "Safe collection and disposal of unwanted items, rubble or furniture.",
    icon: Truck,
  },
];

const ServiceSelection = ({ value, onChange }: ServiceSelectionProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">Select a Service</h3>
      <div className="grid gap-3">
        {services.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() => onChange(service.id)}
            className={cn(
              "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
              value === service.id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40"
            )}
          >
            <div className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
              value === service.id
                ? "bg-primary text-primary-foreground"
                : "bg-primary/10 text-primary"
            )}>
              <service.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">{service.name}</p>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
