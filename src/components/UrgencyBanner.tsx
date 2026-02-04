import { Clock } from "lucide-react";

const UrgencyBanner = () => {
  return (
    <div className="bg-primary/5 border-b border-primary/10">
      <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3 text-center">
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
      </div>
    </div>
  );
};

export default UrgencyBanner;
