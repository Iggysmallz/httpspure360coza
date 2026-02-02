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
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, Users, Heart, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

const workTypes = [
  { value: "cleaning", label: "Cleaning" },
  { value: "gardening", label: "Gardening" },
  { value: "care", label: "Care" },
  { value: "removals", label: "Removals" },
  { value: "other", label: "Other" },
];

const experienceOptions = [
  { value: "0-1", label: "Less than 1 year" },
  { value: "1-2", label: "1-2 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5+", label: "5+ years" },
];

const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  contactNumber: z.string().trim().min(10, "Please enter a valid contact number").max(15),
  area: z.string().trim().min(2, "Please enter your area").max(100),
  workType: z.string().min(1, "Please select a type of work"),
  yearsExperience: z.string().optional(),
  additionalNotes: z.string().max(500).optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const WorkWithUs = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormData, string>>>({});

  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: "",
    contactNumber: "",
    area: "",
    workType: "",
    yearsExperience: "",
    additionalNotes: "",
  });

  const handleInputChange = (field: keyof ApplicationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = applicationSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ApplicationFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ApplicationFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { error } = await supabase.from("worker_applications").insert({
        full_name: result.data.fullName,
        contact_number: result.data.contactNumber,
        area: result.data.area,
        work_type: result.data.workType,
        years_experience: result.data.yearsExperience || null,
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

  const benefits = [
    {
      icon: Users,
      title: "Flexible Hours",
      description: "Work when it suits you",
    },
    {
      icon: Heart,
      title: "Fair Pay",
      description: "Competitive rates always",
    },
    {
      icon: Shield,
      title: "Respect & Support",
      description: "You're valued here",
    },
  ];

  return (
    <Layout showBottomNav={false}>
      <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Work With PURE360
            </h1>
            <p className="mx-auto max-w-lg text-lg text-muted-foreground">
              Join PURE360 and become part of a trusted local service team. Choose flexible work opportunities in your area.
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-xl bg-secondary/50 p-4 text-center"
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Application Form */}
          <Card className="shadow-card">
            <CardContent className="pt-6">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    Application Received!
                  </h3>
                  <p className="max-w-sm text-muted-foreground">
                    Thank you for your interest. A PURE360 team member will contact you via WhatsApp within 48 hours.
                  </p>
                </div>
              ) : (
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

                  {/* Area */}
                  <div className="space-y-2">
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      placeholder="e.g. Sea Point, Cape Town"
                      value={formData.area}
                      onChange={(e) => handleInputChange("area", e.target.value)}
                      className={cn(errors.area && "border-destructive")}
                    />
                    {errors.area && (
                      <p className="text-sm text-destructive">{errors.area}</p>
                    )}
                  </div>

                  {/* Type of Work */}
                  <div className="space-y-2">
                    <Label>Type of Work</Label>
                    <Select
                      value={formData.workType}
                      onValueChange={(value) => handleInputChange("workType", value)}
                    >
                      <SelectTrigger className={cn(errors.workType && "border-destructive")}>
                        <SelectValue placeholder="Select type of work" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {workTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.workType && (
                      <p className="text-sm text-destructive">{errors.workType}</p>
                    )}
                  </div>

                  {/* Years of Experience */}
                  <div className="space-y-2">
                    <Label>Years of Experience (optional)</Label>
                    <Select
                      value={formData.yearsExperience}
                      onValueChange={(value) => handleInputChange("yearsExperience", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {experienceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes (optional)</Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="Tell us about your experience, availability, or any questions..."
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
                      "Submit Application"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Reassuring Note */}
          <div className="mt-8 rounded-xl bg-secondary/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Our Promise:</strong> At PURE360, we believe in fair work and respectful treatment. 
              Every team member is valued, supported, and paid fairly for their contribution.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WorkWithUs;