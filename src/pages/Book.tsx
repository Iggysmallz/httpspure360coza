import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, ShieldCheck, Lock, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ServiceSelection from "@/components/booking/ServiceSelection";
import CustomerDetailsForm from "@/components/booking/CustomerDetailsForm";
import CleaningQuestions from "@/components/booking/CleaningQuestions";
import RemovalQuestions from "@/components/booking/RemovalQuestions";
import BookingConfirmationScreen from "@/components/booking/BookingConfirmationScreen";

const TOTAL_STEPS = 4;

const Book = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Step 1
  const [serviceType, setServiceType] = useState("");

  // Step 2
  const [customerDetails, setCustomerDetails] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    serviceAddress: "",
    preferredDate: "",
    preferredTimeWindow: "",
  });

  // Step 3 - Cleaning
  const [cleaningData, setCleaningData] = useState({
    cleaningType: "",
    propertyType: "",
    numberOfRooms: "",
    specialInstructions: "",
  });

  // Step 3 - Removal
  const [removalData, setRemovalData] = useState({
    itemTypes: "",
    loadSize: "",
    accessibilityNotes: "",
  });

  if (isComplete) {
    return (
      <Layout>
        <BookingConfirmationScreen />
      </Layout>
    );
  }

  const canProceed = () => {
    switch (step) {
      case 1: return !!serviceType;
      case 2: return !!(customerDetails.fullName.trim() && customerDetails.contactNumber.trim() && customerDetails.serviceAddress.trim());
      case 3:
        if (serviceType === "home_cleaning") return !!cleaningData.cleaningType;
        return true; // removal fields are all optional-ish
      case 4: return true;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in or create an account to submit your booking.",
      });
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("booking_requests").insert({
        user_id: user.id,
        service_type: serviceType,
        full_name: customerDetails.fullName.trim(),
        contact_number: customerDetails.contactNumber.trim(),
        email: customerDetails.email.trim() || null,
        service_address: customerDetails.serviceAddress.trim(),
        preferred_date: customerDetails.preferredDate || null,
        preferred_time_window: customerDetails.preferredTimeWindow || null,
        // Cleaning
        cleaning_type: serviceType === "home_cleaning" ? cleaningData.cleaningType || null : null,
        property_type: serviceType === "home_cleaning" ? cleaningData.propertyType || null : null,
        number_of_rooms: serviceType === "home_cleaning" ? cleaningData.numberOfRooms || null : null,
        special_instructions: serviceType === "home_cleaning" ? cleaningData.specialInstructions || null : null,
        // Removal
        item_types: serviceType === "removal_junk" ? removalData.itemTypes || null : null,
        load_size: serviceType === "removal_junk" ? removalData.loadSize || null : null,
        accessibility_notes: serviceType === "removal_junk" ? removalData.accessibilityNotes || null : null,
      });

      if (error) throw error;
      setIsComplete(true);
    } catch (error) {
      console.error("Booking request error:", error);
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-lg px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>Step {step} of {TOTAL_STEPS}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        {step === 1 && (
          <ServiceSelection value={serviceType} onChange={setServiceType} />
        )}

        {step === 2 && (
          <CustomerDetailsForm data={customerDetails} onChange={setCustomerDetails} />
        )}

        {step === 3 && serviceType === "home_cleaning" && (
          <CleaningQuestions data={cleaningData} onChange={setCleaningData} />
        )}

        {step === 3 && serviceType === "removal_junk" && (
          <RemovalQuestions data={removalData} onChange={setRemovalData} />
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Confirm & Submit</h3>

            {/* Pricing message */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">No Hidden Charges</p>
                  <p className="text-sm text-muted-foreground">
                    Pricing is confirmed after we review your booking details. A PURE360 team member will contact you to discuss availability and confirm the final cost before any work begins.
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium text-foreground">
                  {serviceType === "home_cleaning" ? "Home Cleaning" : "Removal & Junk Removal"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium text-foreground">{customerDetails.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contact</span>
                <span className="font-medium text-foreground">{customerDetails.contactNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Address</span>
                <span className="font-medium text-foreground truncate max-w-[200px]">{customerDetails.serviceAddress}</span>
              </div>
              {customerDetails.preferredDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Preferred Date</span>
                  <span className="font-medium text-foreground">{customerDetails.preferredDate}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={prevStep} className="gap-1">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          )}

          {step < TOTAL_STEPS ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="ml-auto gap-1"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : !user ? (
            <Button
              onClick={() => navigate("/auth")}
              className="ml-auto gap-2"
            >
              <LogIn className="h-4 w-4" />
              Sign In to Submit
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="ml-auto"
            >
              {isSubmitting ? "Submitting..." : "Submit Booking Request"}
            </Button>
          )}
        </div>

        {/* Trust & Privacy */}
        <div className="mt-6 rounded-lg bg-muted/50 p-3 text-center">
          <p className="text-xs text-muted-foreground">
            🔒 Your information is used only to manage your booking and is handled responsibly. We do not share your details with third parties.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Book;
