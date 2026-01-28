import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Sparkles, Home, Clock, Check, ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const SERVICE_TYPES = [
  { id: "regular", name: "Regular Clean", description: "Weekly or bi-weekly maintenance cleaning", icon: Home },
  { id: "deep_clean", name: "Deep Clean", description: "Thorough top-to-bottom cleaning", icon: Sparkles },
  { id: "airbnb", name: "AirBnB Turnover", description: "Quick turnaround for short-term rentals", icon: Clock },
];

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"
];

const BASE_PRICE = 300;
const HOURLY_RATE = 80;

const calculateHours = (bedrooms: number, bathrooms: number): number => {
  return 3 + Math.max(0, bedrooms - 2) + Math.max(0, bathrooms - 1);
};

const calculatePrice = (bedrooms: number, bathrooms: number): number => {
  const hours = calculateHours(bedrooms, bathrooms);
  return BASE_PRICE + Math.max(0, hours - 3) * HOURLY_RATE;
};

const CleaningWizard = () => {
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const totalPrice = calculatePrice(bedrooms, bathrooms);
  const estimatedHours = calculateHours(bedrooms, bathrooms);

  const canProceed = () => {
    if (step === 1) return !!serviceType;
    if (step === 2) return bedrooms > 0 && bathrooms > 0;
    if (step === 3) return !!date && !!time;
    return false;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to book a cleaning service.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!date || !time) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        service_type: serviceType,
        bedrooms,
        bathrooms,
        scheduled_date: format(date, "yyyy-MM-dd"),
        scheduled_time: time,
        total_price: totalPrice,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Booking confirmed!",
        description: `Your ${SERVICE_TYPES.find(s => s.id === serviceType)?.name} has been scheduled for ${format(date, "PPP")} at ${time}.`,
      });
      navigate("/bookings");
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
              s === step
                ? "bg-primary text-primary-foreground"
                : s < step
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {s < step ? <Check className="h-4 w-4" /> : s}
          </div>
        ))}
      </div>

      {/* Step 1: Service Type */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-center text-xl font-semibold text-foreground">
            Choose Your Service
          </h2>
          <div className="grid gap-3">
            {SERVICE_TYPES.map((service) => (
              <button
                key={service.id}
                onClick={() => setServiceType(service.id)}
                className={cn(
                  "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
                  serviceType === service.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-lg",
                  serviceType === service.id ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <service.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{service.name}</p>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Rooms */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-center text-xl font-semibold text-foreground">
            How Many Rooms?
          </h2>
          
          <div className="space-y-4">
            <div className="rounded-xl border border-border p-4">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Bedrooms
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
                  disabled={bedrooms <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center text-xl font-semibold">{bedrooms}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setBedrooms(Math.min(10, bedrooms + 1))}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border p-4">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Bathrooms
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                  disabled={bathrooms <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center text-xl font-semibold">{bathrooms}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setBathrooms(Math.min(10, bathrooms + 1))}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">Estimated duration</p>
            <p className="text-lg font-semibold text-foreground">{estimatedHours} hours</p>
          </div>
        </div>
      )}

      {/* Step 3: Date & Time */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-center text-xl font-semibold text-foreground">
            Pick a Date & Time
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Time
              </label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Price Display */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Price</p>
            <p className="text-2xl font-bold text-primary">R{totalPrice}</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Base: R{BASE_PRICE} (3 hrs)</p>
            {estimatedHours > 3 && (
              <p>+R{(estimatedHours - 3) * HOURLY_RATE} ({estimatedHours - 3} extra hrs)</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        {step < 3 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="flex-1"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? "Booking..." : "Confirm Booking"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CleaningWizard;
