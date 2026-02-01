import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  CalendarIcon, Sparkles, Home, Clock, Check, ArrowLeft, ArrowRight,
  Truck, Leaf, Building2, Shirt, Zap, CalendarCheck, Droplets, 
  Factory, Store, Flower2, Key, LucideIcon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface ServiceType {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  isQuoteBased: boolean;
  priceInfo?: string;
}

const SERVICE_TYPES: ServiceType[] = [
  // Instant Book Services
  { id: "indoor_cleaning", name: "Indoor Cleaning", description: "3.5-10 hours comprehensive home cleaning", icon: Home, isQuoteBased: false },
  { id: "deep_clean", name: "Deep Cleaning", description: "Thorough top-to-bottom intensive cleaning", icon: Sparkles, isQuoteBased: false },
  { id: "airbnb", name: "AirBnB Turnover", description: "Quick turnaround for short-term rentals", icon: Key, isQuoteBased: false },
  { id: "express_cleaning", name: "Express Cleaning", description: "1-3 hour quick cleaning tasks", icon: Zap, isQuoteBased: false },
  { id: "moving_cleaning", name: "Moving Cleaning", description: "Move-in/move-out deep cleaning", icon: Truck, isQuoteBased: false, priceInfo: "From R235" },
  { id: "one_time_cleaning", name: "One-Time Cleaning", description: "Single, flexible booking", icon: CalendarCheck, isQuoteBased: false, priceInfo: "From R235" },
  { id: "window_cleaning", name: "Window Cleaning", description: "Professional window cleaning", icon: Droplets, isQuoteBased: false, priceInfo: "R50/hour" },
  
  // Quote-Based Services
  { id: "office_cleaning", name: "Office Cleaning", description: "Half-day or full-day office cleaning", icon: Building2, isQuoteBased: true },
  { id: "commercial_cleaning", name: "Commercial Cleaning", description: "Office and industrial spaces (R5.10/sqm)", icon: Factory, isQuoteBased: true },
  { id: "small_business_cleaning", name: "Small Business Cleaning", description: "Retail and small facility cleaning", icon: Store, isQuoteBased: true },
  { id: "outdoor_services", name: "Outdoor Services", description: "Garden maintenance and dog walking", icon: Leaf, isQuoteBased: true },
  { id: "gardening", name: "Gardening Services", description: "Landscaping and irrigation", icon: Flower2, isQuoteBased: true },
  { id: "laundry_ironing", name: "Laundry & Ironing", description: "Professional laundry services", icon: Shirt, isQuoteBased: true },
];

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"
];

// Updated pricing (R15 cheaper)
const BASE_PRICE = 285;
const HOURLY_RATE = 65;
const WINDOW_HOURLY_RATE = 50;

const calculateHours = (bedrooms: number, bathrooms: number): number => {
  return 3 + Math.max(0, bedrooms - 2) + Math.max(0, bathrooms - 1);
};

const calculatePrice = (bedrooms: number, bathrooms: number, serviceType: string): number => {
  if (serviceType === "window_cleaning") {
    const hours = calculateHours(bedrooms, bathrooms);
    return hours * WINDOW_HOURLY_RATE;
  }
  if (serviceType === "moving_cleaning" || serviceType === "one_time_cleaning") {
    const hours = calculateHours(bedrooms, bathrooms);
    return 235 + Math.max(0, hours - 3) * HOURLY_RATE;
  }
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
  
  // Quote form fields
  const [specialRequirements, setSpecialRequirements] = useState<string>("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const selectedService = SERVICE_TYPES.find(s => s.id === serviceType);
  const isQuoteBased = selectedService?.isQuoteBased ?? false;
  
  const totalPrice = calculatePrice(bedrooms, bathrooms, serviceType);
  const estimatedHours = calculateHours(bedrooms, bathrooms);

  // Determine total steps based on service type
  const totalSteps = isQuoteBased ? 2 : 3;

  const canProceed = () => {
    if (step === 1) return !!serviceType;
    if (isQuoteBased) {
      // Quote-based: step 2 is the quote form
      return true; // Can always submit a quote
    } else {
      // Instant book: step 2 is rooms, step 3 is date/time
      if (step === 2) return bedrooms > 0 && bathrooms > 0;
      if (step === 3) return !!date && !!time;
    }
    return false;
  };

  const handleBookingSubmit = async () => {
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
        description: `Your ${selectedService?.name} has been scheduled for ${format(date, "PPP")} at ${time}.`,
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

  const handleQuoteSubmit = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to request a quote.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("quote_requests").insert({
        user_id: user.id,
        service_type: serviceType,
        special_requirements: specialRequirements || null,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Quote request submitted!",
        description: `We'll get back to you about your ${selectedService?.name} request within 2 hours.`,
      });
      navigate("/bookings");
    } catch (error) {
      console.error("Quote error:", error);
      toast({
        title: "Quote request failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && isQuoteBased) {
      setStep(2); // Go to quote form
    } else {
      setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    if (isQuoteBased) {
      handleQuoteSubmit();
    } else {
      handleBookingSubmit();
    }
  };

  const instantBookServices = SERVICE_TYPES.filter(s => !s.isQuoteBased);
  const quoteServices = SERVICE_TYPES.filter(s => s.isQuoteBased);

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
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
          
          {/* Instant Book Services */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Instant Booking</p>
            <div className="grid gap-2">
              {instantBookServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setServiceType(service.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all",
                    serviceType === service.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    serviceType === service.id 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-primary/10 text-primary"
                  )}>
                    <service.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{service.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{service.description}</p>
                  </div>
                  {service.priceInfo && (
                    <span className="shrink-0 text-sm font-medium text-primary">{service.priceInfo}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quote-Based Services */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Request a Quote</p>
            <div className="grid gap-2">
              {quoteServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setServiceType(service.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all",
                    serviceType === service.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    serviceType === service.id 
                      ? "bg-[hsl(var(--quote-service))] text-white" 
                      : "bg-[hsl(var(--quote-service-light))] text-[hsl(var(--quote-service-foreground))]"
                  )}>
                    <service.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{service.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{service.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">Quote</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2 for Quote-Based: Quote Request Form */}
      {step === 2 && isQuoteBased && (
        <div className="space-y-6">
          <h2 className="text-center text-xl font-semibold text-foreground">
            Request a Quote
          </h2>
          
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              {selectedService && <selectedService.icon className="h-6 w-6 text-primary" />}
              <div>
                <p className="font-medium text-foreground">{selectedService?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedService?.description}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Tell us about your requirements (optional)
              </label>
              <Textarea
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                placeholder="E.g., Size of space, frequency needed, specific requirements..."
                rows={4}
              />
            </div>
          </div>

          <div className="rounded-xl bg-primary/10 p-4 text-center">
            <p className="text-sm text-muted-foreground">We'll respond within</p>
            <p className="text-lg font-semibold text-primary">2 hours</p>
          </div>
        </div>
      )}

      {/* Step 2 for Instant Book: Rooms */}
      {step === 2 && !isQuoteBased && (
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

      {/* Step 3: Date & Time (only for instant book) */}
      {step === 3 && !isQuoteBased && (
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

      {/* Price Display (only for instant book services) */}
      {!isQuoteBased && (
        <div className="rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Price</p>
              <p className="text-2xl font-bold text-primary">R{totalPrice}</p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              {serviceType === "window_cleaning" ? (
                <p>{estimatedHours} hrs × R{WINDOW_HOURLY_RATE}/hr</p>
              ) : (
                <>
                  <p>Base: R{serviceType === "moving_cleaning" || serviceType === "one_time_cleaning" ? 235 : BASE_PRICE} (3 hrs)</p>
                  {estimatedHours > 3 && (
                    <p>+R{(estimatedHours - 3) * HOURLY_RATE} ({estimatedHours - 3} extra hrs)</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

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
        {step < totalSteps ? (
          <Button
            onClick={handleNext}
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
            {isSubmitting 
              ? (isQuoteBased ? "Submitting..." : "Booking...") 
              : (isQuoteBased ? "Submit Quote Request" : "Confirm Booking")
            }
          </Button>
        )}
      </div>
    </div>
  );
};

export default CleaningWizard;
