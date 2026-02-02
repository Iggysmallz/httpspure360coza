import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
  urgencyText?: string;
}

const ServiceCard = ({ title, description, icon: Icon, onClick, className, urgencyText }: ServiceCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl bg-card p-6 text-left shadow-card transition-all duration-300",
        "hover:shadow-elevated hover:-translate-y-1",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "active:scale-[0.98]",
        className
      )}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Icon container */}
      <div className="relative mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-secondary transition-colors duration-300 group-hover:bg-primary/10">
        <Icon className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" />
      </div>
      
      {/* Content */}
      <div className="relative">
        <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        {urgencyText && (
          <p className="mt-2 text-xs text-primary/80 italic">
            {urgencyText}
          </p>
        )}
      </div>
      
      {/* Arrow indicator */}
      <div className="absolute bottom-6 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
        <svg
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};

export default ServiceCard;
