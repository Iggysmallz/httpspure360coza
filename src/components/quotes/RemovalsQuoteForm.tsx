import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Truck, MapPin, Package, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const RemovalsQuoteForm = () => {
  const [itemDescription, setItemDescription] = useState("");
  const [pickupSuburb, setPickupSuburb] = useState("");
  const [dropoffSuburb, setDropoffSuburb] = useState("");
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
        service_type: "removals",
        item_description: itemDescription,
        pickup_suburb: pickupSuburb,
        dropoff_suburb: dropoffSuburb,
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
          Thank you! A Pure360 consultant will contact you with a custom quote within 2 hours.
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
            <Truck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">Removals Quote</p>
            <p className="text-sm text-muted-foreground">
              We'll provide a custom quote based on your items
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="items" className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            What items need moving?
          </Label>
          <Textarea
            id="items"
            placeholder="e.g., 3-seater couch, double bed, fridge, 10 boxes..."
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            className="min-h-[100px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pickup" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Pickup Suburb
          </Label>
          <Input
            id="pickup"
            placeholder="e.g., Sea Point, Cape Town"
            value={pickupSuburb}
            onChange={(e) => setPickupSuburb(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dropoff" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Drop-off Suburb
          </Label>
          <Input
            id="dropoff"
            placeholder="e.g., Camps Bay, Cape Town"
            value={dropoffSuburb}
            onChange={(e) => setDropoffSuburb(e.target.value)}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Request Quote"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        We'll contact you within 2 hours with your custom quote
      </p>
    </form>
  );
};

export default RemovalsQuoteForm;
