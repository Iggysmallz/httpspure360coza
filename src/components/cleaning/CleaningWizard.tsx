import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  CalendarIcon, Sparkles, Home, Clock, Check, Edit2, ChevronRight,
  Truck, LucideIcon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import CheckoutSummary from "./CheckoutSummary";
import BookingConfirmation from "./BookingConfirmation";
import { useProfile } from "@/hooks/useProfile";

interface ServiceType {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  isQuoteBased: boolean;
  priceInfo?: string;
}

interface AddOn {
  id: string;
  label: string;
  price: number;
  icon: string;
}

const SERVICE_TYPES: ServiceType[] = [
  { id: "indoor_cleaning", name: "Home Cleaning", description: "Reliable recurring or once-off home cleaning", icon: Home, isQuoteBased: false },
  { id: "rubble_removal", name: "Rubble & Furniture Removal", description: "Safe removal of rubble, old furniture and unwanted items", icon: Truck, isQuoteBased: true },
];

const ADD_ONS: AddOn[] = [
  { id: "ironing", label: "Ironing", price: 60, icon: "👕" },
  { id: "oven", label: "Oven Clean", price: 75, icon: "🔥" },
  { id: "windows_addon", label: "Windows", price: 50, icon: "🪟" },
  { id: "fridge", label: "Fridge", price: 65, icon: "❄️" },
  { id: "laundry", label: "Laundry", price: 55, icon: "🧺" },
  { id: "cabinets", label: "Cabinets", price: 45, icon: "🗄️" },
];

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"
];

// Updated pricing (R15 cheaper)
const BASE_PRICE = 320;
const HOURLY_RATE = 65;
const WINDOW_HOURLY_RATE = 50;

const calculateHours = (bedrooms: number, bathrooms: number): number => {
  return 6 + Math.max(0, bedrooms - 2) + Math.max(0, bathrooms - 1);
};

const calculatePrice = (bedrooms: number, bathrooms: number, serviceType: string): number => {
  if (serviceType === "window_cleaning") {
    const hours = calculateHours(bedrooms, bathrooms);
    return hours * WINDOW_HOURLY_RATE;
  }
  if (serviceType === "moving_cleaning" || serviceType === "one_time_cleaning") {
    const hours = calculateHours(bedrooms, bathrooms);
    return 235 + Math.max(0, hours - 6) * HOURLY_RATE;
  }
  // Base price R320 for 1-2 bedrooms, 1 bathroom
  const extraBedroomCost = Math.max(0, bedrooms - 2) * HOURLY_RATE;
  const extraBathroomCost = Math.max(0, bathrooms - 1) * HOURLY_RATE;
  return BASE_PRICE + extraBedroomCost + extraBathroomCost;
};

const CleaningWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [serviceType, setServiceType] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  
  // Quote form fields
  const [specialRequirements, setSpecialRequirements] = useState<string>("");

  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile } = useProfile();

  const selectedService = SERVICE_TYPES.find(s => s.id === serviceType);
  const isQuoteBased = selectedService?.isQuoteBased ?? false;
  
  const basePrice = calculatePrice(bedrooms, bathrooms, serviceType);
  const addOnsTotal = selectedAddOns.reduce((acc, id) => {
    const addon = ADD_ONS.find(a => a.id === id);
    return acc + (addon?.price || 0);
  }, 0);
  const totalPrice = basePrice + addOnsTotal;
  const estimatedHours = calculateHours(bedrooms, bathrooms);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const travelFee = 50;
  const finalTotalPrice = totalPrice + travelFee;

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
        total_price: finalTotalPrice,
        status: "pending",
      });

      if (error) throw error;

      // Send confirmation email
      const addressParts = [
        profile?.unit_number,
        profile?.complex_name,
        profile?.street_address,
        profile?.suburb,
        profile?.city,
      ].filter(Boolean);

      try {
        await supabase.functions.invoke("send-booking-confirmation", {
          body: {
            email: user.email,
            customerName: profile?.first_name || "Customer",
            serviceName: selectedService?.name || serviceType,
            date: format(date, "PPP"),
            time,
            address: addressParts.join(", "),
            totalPrice: finalTotalPrice,
          },
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't fail the booking if email fails
      }

      setBookingComplete(true);
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

  const instantBookServices = SERVICE_TYPES.filter(s => !s.isQuoteBased);
  const quoteServices = SERVICE_TYPES.filter(s => s.isQuoteBased);

  // For instant book: Step 1 = Service, Step 2 = Home Size, Step 3 = Add-ons, Step 4 = Date/Time, Step 5 = Checkout
  // For quote: Step 1 = Service, Step 2 = Quote Form

  const renderServiceSection = () => (
    <div className={cn(
      "rounded-xl border p-4 transition-all",
      currentStep > 1 ? "border-muted bg-muted/30" : "border-border bg-card shadow-sm"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentStep > 1 && serviceType && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-3.5 w-3.5" />
            </div>
          )}
          <h3 className="font-semibold text-foreground">1. Choose Service</h3>
        </div>
        {currentStep > 1 && (
          <button 
            onClick={() => setCurrentStep(1)} 
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <Edit2 className="h-3.5 w-3.5" /> Edit
          </button>
        )}
      </div>
      
      {currentStep === 1 ? (
        <div className="mt-4 space-y-4 animate-in fade-in duration-300">
          {/* Instant Book Services */}
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Instant Booking</p>
            <div className="grid gap-2">
              {instantBookServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setServiceType(service.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all",
                    serviceType === service.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    serviceType === service.id 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-primary/10 text-primary"
                  )}>
                    <service.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{service.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{service.description}</p>
                  </div>
                  {service.priceInfo && (
                    <span className="shrink-0 text-xs font-medium text-primary">{service.priceInfo}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quote-Based Services */}
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Request a Quote</p>
            <div className="grid gap-2">
              {quoteServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setServiceType(service.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all",
                    serviceType === service.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    serviceType === service.id 
                      ? "bg-amber-600 text-white" 
                      : "bg-amber-100 text-amber-700"
                  )}>
                    <service.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{service.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{service.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">Quote</span>
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={() => setCurrentStep(2)} 
            disabled={!serviceType}
            className="w-full"
          >
            Next: {isQuoteBased ? "Request Quote" : "Home Size"}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <p className="mt-1 text-sm text-muted-foreground">
          {selectedService?.name}
        </p>
      )}
    </div>
  );

  const renderHomeSizeSection = () => {
    if (isQuoteBased) return null;

    return (
      <div className={cn(
        "rounded-xl border p-4 transition-all",
        currentStep < 2 ? "border-muted bg-muted/30 opacity-50" : 
        currentStep > 2 ? "border-muted bg-muted/30" : "border-border bg-card shadow-sm"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentStep > 2 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3.5 w-3.5" />
              </div>
            )}
            <h3 className="font-semibold text-foreground">2. Home Size</h3>
          </div>
          {currentStep > 2 && (
            <button 
              onClick={() => setCurrentStep(2)} 
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Edit2 className="h-3.5 w-3.5" /> Edit
            </button>
          )}
        </div>
        
        {currentStep === 2 ? (
          <div className="mt-4 space-y-4 animate-in fade-in duration-300">
            {/* Bedrooms */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Bedrooms</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => setBedrooms(num)}
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-lg border-2 text-lg font-semibold transition-all",
                      bedrooms === num
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/50"
                    )}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setBedrooms(6)}
                  className={cn(
                    "flex h-12 items-center justify-center rounded-lg border-2 px-3 text-sm font-medium transition-all",
                    bedrooms >= 6
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary/50"
                  )}
                >
                  6+
                </button>
              </div>
            </div>

            {/* Bathrooms */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Bathrooms</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => setBathrooms(num)}
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-lg border-2 text-lg font-semibold transition-all",
                      bathrooms === num
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/50"
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Time */}
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Estimated time</span>
              </div>
              <span className="font-semibold text-foreground">{estimatedHours} hours</span>
            </div>

            {/* Multi-staff notice for 6+ bedrooms */}
            {bedrooms >= 6 && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-foreground">
                <p className="font-medium">🏠 Large home detected</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You may need more than 1 staff member. We'll confirm the team size and final price before your booking.
                </p>
              </div>
            )}

            <Button 
              onClick={() => setCurrentStep(3)} 
              className="w-full"
            >
              Next: Add Extras
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ) : currentStep > 2 ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {bedrooms} Bed, {bathrooms} Bath • ~{estimatedHours} hours
          </p>
        ) : null}
      </div>
    );
  };

  const renderAddOnsSection = () => {
    if (isQuoteBased) return null;

    return (
      <div className={cn(
        "rounded-xl border p-4 transition-all",
        currentStep < 3 ? "border-muted bg-muted/30 opacity-50" : 
        currentStep > 3 ? "border-muted bg-muted/30" : "border-border bg-card shadow-sm"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentStep > 3 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3.5 w-3.5" />
              </div>
            )}
            <h3 className="font-semibold text-foreground">3. Any Extras?</h3>
          </div>
          {currentStep > 3 && (
            <button 
              onClick={() => setCurrentStep(3)} 
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Edit2 className="h-3.5 w-3.5" /> Edit
            </button>
          )}
        </div>
        
        {currentStep === 3 ? (
          <div className="mt-4 space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-3 gap-2">
              {ADD_ONS.map(addon => (
                <button 
                  key={addon.id}
                  onClick={() => toggleAddOn(addon.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all",
                    selectedAddOns.includes(addon.id) 
                      ? "border-primary bg-primary/10" 
                      : "border-border bg-background hover:border-primary/50"
                  )}
                >
                  <span className="text-2xl">{addon.icon}</span>
                  <span className="text-xs font-medium text-foreground">{addon.label}</span>
                  <span className="text-[10px] text-muted-foreground">+R{addon.price}</span>
                </button>
              ))}
            </div>

            <Button 
              onClick={() => setCurrentStep(4)} 
              className="w-full"
            >
              Next: Pick Date & Time
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ) : currentStep > 3 ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {selectedAddOns.length === 0 
              ? "No extras added" 
              : selectedAddOns.map(id => ADD_ONS.find(a => a.id === id)?.label).join(", ")
            }
          </p>
        ) : null}
      </div>
    );
  };

  const renderDateTimeSection = () => {
    if (isQuoteBased) return null;

    return (
      <div className={cn(
        "rounded-xl border p-4 transition-all",
        currentStep < 4 ? "border-muted bg-muted/30 opacity-50" : 
        currentStep > 4 ? "border-muted bg-muted/30" : "border-border bg-card shadow-sm"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentStep > 4 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3.5 w-3.5" />
              </div>
            )}
            <h3 className="font-semibold text-foreground">4. Pick Date & Time</h3>
          </div>
          {currentStep > 4 && (
            <button 
              onClick={() => setCurrentStep(4)} 
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Edit2 className="h-3.5 w-3.5" /> Edit
            </button>
          )}
        </div>
        
        {currentStep === 4 ? (
          <div className="mt-4 space-y-4 animate-in fade-in duration-300">
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
                    disabled={(d) => {
                      const now = new Date();
                      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                      const tomorrow = new Date(today);
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      // Block past dates, and block tomorrow if it's past 8pm
                      if (d < today) return true;
                      if (d.getTime() === today.getTime()) return true;
                      if (d.getTime() === tomorrow.getTime() && now.getHours() >= 20) return true;
                      if (d.getDay() === 0) return true; // No Sundays
                      return false;
                    }}
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

            <Button 
              onClick={() => setCurrentStep(5)} 
              disabled={!date || !time}
              className="w-full"
            >
              Next: Review & Pay
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ) : currentStep > 4 ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {date && format(date, "PPP")} at {time}
          </p>
        ) : null}
      </div>
    );
  };

  const renderCheckoutSection = () => {
    if (isQuoteBased || currentStep !== 5) return null;

    const selectedExtras = selectedAddOns.map(id => {
      const addon = ADD_ONS.find(a => a.id === id);
      return addon ? { id: addon.id, label: addon.label, price: addon.price } : null;
    }).filter(Boolean) as { id: string; label: string; price: number }[];

    const bookingData = {
      serviceName: selectedService?.name || "",
      basePrice,
      extrasPrice: addOnsTotal,
      selectedExtras,
      unit: profile?.unit_number || "",
      street: profile?.street_address || "",
      suburb: profile?.suburb || "",
      date: date ? format(date, "PPP") : "",
      time,
    };

    return (
      <CheckoutSummary 
        bookingData={bookingData}
        onPay={handleBookingSubmit}
        isLoading={isSubmitting}
      />
    );
  };

  const renderQuoteSection = () => {
    if (!isQuoteBased) return null;

    return (
      <div className={cn(
        "rounded-xl border p-4 transition-all",
        currentStep < 2 ? "border-muted bg-muted/30 opacity-50" : "border-border bg-card shadow-sm"
      )}>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">2. Request Details</h3>
        </div>
        
        {currentStep === 2 ? (
          <div className="mt-4 space-y-4 animate-in fade-in duration-300">
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-3">
                {selectedService && <selectedService.icon className="h-5 w-5 text-primary" />}
                <div>
                  <p className="text-sm font-medium text-foreground">{selectedService?.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedService?.description}</p>
                </div>
              </div>
            </div>

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

            <div className="rounded-lg bg-primary/10 p-3 text-center">
              <p className="text-xs text-muted-foreground">We'll respond within</p>
              <p className="font-semibold text-primary">2 hours</p>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const canSubmit = () => {
    if (isQuoteBased) {
      return currentStep === 2;
    }
    return currentStep === 5 && date && time;
  };

  // Show confirmation page after successful booking
  if (bookingComplete) {
    const addressParts = [
      profile?.unit_number,
      profile?.street_address,
      profile?.suburb,
    ].filter(Boolean);

    return (
      <BookingConfirmation
        bookingDetails={{
          serviceName: selectedService?.name || "",
          date: date ? format(date, "PPP") : "",
          time,
          totalPrice: finalTotalPrice,
          address: addressParts.length > 0 ? addressParts.join(", ") : undefined,
        }}
      />
    );
  }

  // Show checkout step alone for cleaner UI
  if (currentStep === 5 && !isQuoteBased) {
    return renderCheckoutSection();
  }

  return (
    <div className="space-y-4 pb-28">
      {renderServiceSection()}
      {renderHomeSizeSection()}
      {renderAddOnsSection()}
      {renderDateTimeSection()}
      {renderQuoteSection()}

      {/* Sticky Price Footer - hide on checkout step */}
      {serviceType && !isQuoteBased && currentStep > 1 && currentStep < 5 && (
        <div className="fixed bottom-20 left-0 right-0 z-40 border-t border-border bg-card p-4 shadow-lg md:bottom-0">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-tight text-muted-foreground">Total Price</p>
              <p className="text-2xl font-black text-primary">R{totalPrice}</p>
              {selectedAddOns.length > 0 && (
                <p className="text-[10px] text-muted-foreground">
                  Base: R{basePrice} + Extras: R{addOnsTotal}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quote Submit Button */}
      {isQuoteBased && currentStep === 2 && (
        <Button
          className="w-full"
          size="lg"
          disabled={isSubmitting}
          onClick={handleQuoteSubmit}
        >
          {isSubmitting ? "Submitting..." : "Submit Quote Request"}
        </Button>
      )}
    </div>
  );
};

export default CleaningWizard;
