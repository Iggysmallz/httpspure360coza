import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Clock, FileText, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const CARE_TYPES = [
  { id: "elderly_companion", name: "Elderly Companion", description: "Companionship and daily assistance" },
  { id: "nursing", name: "Nursing Care", description: "Professional medical care at home" },
];

const FREQUENCIES = [
  "Daily",
  "Weekdays only",
  "Weekends only",
  "2-3 times per week",
  "Once a week",
  "Live-in",
];

const CareQuoteForm = () => {
  const [careType, setCareType] = useState<string>("");
  const [frequency, setFrequency] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        service_type: "care",
        care_type: careType,
        frequency,
        special_requirements: specialRequirements || null,
        status: "pending",
      });

      if (error) throw error;

      setIsSubmitted(true);
    } catch (error) {
      console.error("Quote request error:", error);
      toast({
        title: "Request failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
          <Check className="h-8 w-8 text-primary-foreground" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-foreground">
          Quote Request Received!
        </h3>
        <p className="mb-6 text-muted-foreground">
          Thank you! A Pure360 care consultant will contact you with a custom quote within 2 hours.
        </p>
        <Button onClick={() => navigate("/bookings")}>
          View My Requests
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">Care Services Quote</p>
            <p className="text-sm text-muted-foreground">
              Compassionate care tailored to your needs
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Type of Care</Label>
          <div className="grid gap-3">
            {CARE_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setCareType(type.id)}
                className={cn(
                  "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
                  careType === type.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  careType === type.id ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{type.name}</p>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency" className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Frequency
          </Label>
          <Select value={frequency} onValueChange={setFrequency} required>
            <SelectTrigger>
              <SelectValue placeholder="How often do you need care?" />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCIES.map((freq) => (
                <SelectItem key={freq} value={freq}>
                  {freq}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="requirements" className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Special Requirements (Optional)
          </Label>
          <Textarea
            id="requirements"
            placeholder="Any specific needs, medical conditions, or preferences we should know about..."
            value={specialRequirements}
            onChange={(e) => setSpecialRequirements(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting || !careType || !frequency}
      >
        {isSubmitting ? "Submitting..." : "Request Quote"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Our care consultants will respond within 2 hours
      </p>
    </form>
  );
};

export default CareQuoteForm;
