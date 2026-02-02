import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

const UrgencyBanner = () => {
  const navigate = useNavigate();

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-primary/5 border-b border-primary/10">
      <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <Clock className="h-4 w-4 text-primary shrink-0 hidden sm:block" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Limited weekly slots available — bookings fill up fast.
              </p>
              <p className="text-xs text-muted-foreground">
                Secure your preferred date early to avoid disappointment.
              </p>
            </div>
          </div>
          <Button 
            onClick={scrollToServices}
            size="sm"
            className="shrink-0"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UrgencyBanner;
