import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const services = [
  { value: "home_cleaning", label: "Home Cleaning" },
  { value: "deep_moving_cleaning", label: "Deep & Moving Cleaning" },
  { value: "outdoor_garden", label: "Outdoor & Garden Services" },
  { value: "airbnb_shortstay", label: "Airbnb & Short-Stay Cleaning" },
  { value: "rubble_removal", label: "Rubble & Furniture Removal" },
  { value: "care_services", label: "Care Services" },
  { value: "bin_cleaning", label: "Bin Cleaning" },
];

const enquirySchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  contactNumber: z.string().trim().min(10, "Please enter a valid contact number").max(15),
  areaSurburb: z.string().trim().min(2, "Please enter your area or suburb").max(100),
  serviceRequired: z.string().min(1, "Please select a service"),
  preferredDate: z.date().optional(),
  additionalNotes: z.string().max(500).optional(),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

const EnquiryForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryFormData, string>>>({});
  
  const [formData, setFormData] = useState<EnquiryFormData>({
    fullName: "",
    contactNumber: "",
    areaSurburb: "",
    serviceRequired: "",
    preferredDate: undefined,
    additionalNotes: "",
  });

  const handleInputChange = (field: keyof EnquiryFormData, value: string | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = enquirySchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof EnquiryFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof EnquiryFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { error } = await supabase.from("enquiries").insert({
        full_name: result.data.fullName,
        contact_number: result.data.contactNumber,
        area_suburb: result.data.areaSurburb,
        service_required: result.data.serviceRequired,
        preferred_date: result.data.preferredDate?.toISOString().split("T")[0] || null,
        additional_notes: result.data.additionalNotes || null,
      });

      if (error) throw error;

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us via WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-foreground">
          Thank you for your request
        </h3>
        <p className="max-w-sm text-muted-foreground">
          A PURE360 team member will contact you via WhatsApp shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          placeholder="Your full name"
          value={formData.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          className={cn(errors.fullName && "border-destructive")}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName}</p>
        )}
      </div>

      {/* Contact Number */}
      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          type="tel"
          placeholder="e.g. 076 400 2332"
          value={formData.contactNumber}
          onChange={(e) => handleInputChange("contactNumber", e.target.value)}
          className={cn(errors.contactNumber && "border-destructive")}
        />
        {errors.contactNumber && (
          <p className="text-sm text-destructive">{errors.contactNumber}</p>
        )}
      </div>

      {/* Area / Suburb */}
      <div className="space-y-2">
        <Label htmlFor="areaSurburb">Area / Suburb</Label>
        <Input
          id="areaSurburb"
          placeholder="e.g. Sea Point, Cape Town"
          value={formData.areaSurburb}
          onChange={(e) => handleInputChange("areaSurburb", e.target.value)}
          className={cn(errors.areaSurburb && "border-destructive")}
        />
        {errors.areaSurburb && (
          <p className="text-sm text-destructive">{errors.areaSurburb}</p>
        )}
      </div>

      {/* Service Required */}
      <div className="space-y-2">
        <Label>Service Required</Label>
        <Select
          value={formData.serviceRequired}
          onValueChange={(value) => handleInputChange("serviceRequired", value)}
        >
          <SelectTrigger className={cn(errors.serviceRequired && "border-destructive")}>
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {services.map((service) => (
              <SelectItem key={service.value} value={service.value}>
                {service.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.serviceRequired && (
          <p className="text-sm text-destructive">{errors.serviceRequired}</p>
        )}
      </div>

      {/* Preferred Date */}
      <div className="space-y-2">
        <Label>Preferred Date (optional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.preferredDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.preferredDate
                ? format(formData.preferredDate, "PPP")
                : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-popover" align="start">
            <Calendar
              mode="single"
              selected={formData.preferredDate}
              onSelect={(date) => handleInputChange("preferredDate", date)}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="additionalNotes">Additional Notes (optional)</Label>
        <Textarea
          id="additionalNotes"
          placeholder="Any specific requirements or details..."
          value={formData.additionalNotes}
          onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Enquiry"
        )}
      </Button>
    </form>
  );
};

export default EnquiryForm;