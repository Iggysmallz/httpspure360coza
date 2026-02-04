import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Bell, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email address").max(255);

const serviceInfo: Record<string, { title: string; description: string }> = {
  "car-wash": {
    title: "Car Wash",
    description: "Pure360 will soon offer car wash services for your convenience.",
  },
  "pool-cleaning": {
    title: "Pool Cleaning",
    description: "We're working hard to launch pool cleaning services for your home.",
  },
  "window-cleaning": {
    title: "Window Cleaning",
    description: "Professional window cleaning services are coming soon.",
  },
};

const ComingSoon = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceType = searchParams.get("service") || "car-wash";
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const service = serviceInfo[serviceType] || serviceInfo["car-wash"];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({
        title: "Invalid email",
        description: result.error.errors[0]?.message || "Please enter a valid email",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("waitlist_signups")
        .insert({
          email: result.data,
          service_type: serviceType,
        });

      if (error) {
        // Handle duplicate signup
        if (error.code === "23505") {
          toast({
            title: "Already subscribed",
            description: "You're already on the waitlist for this service!",
          });
          setIsSubscribed(true);
          return;
        }
        throw error;
      }

      setIsSubscribed(true);
      toast({
        title: "You're on the list!",
        description: `We'll notify you when ${service.title} launches.`,
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center shadow-elevated">
          <CardContent className="p-8">
            <div className="mb-6 flex justify-center">
              <img src={logo} alt="Pure360" className="h-14 w-auto" />
            </div>
            
            <h1 className="mb-4 text-2xl font-bold text-primary sm:text-3xl">
              {service.title}
            </h1>
            
            <div className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-2">
              <span className="font-semibold text-primary">Coming Soon!</span>
            </div>
            
            <p className="mb-6 text-muted-foreground">
              {service.description}
            </p>
            
            {/* Email Signup Form */}
            <div className="mb-8 rounded-xl bg-muted/50 p-4">
              {isSubscribed ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <CheckCircle className="h-8 w-8 text-primary" />
                  <p className="font-medium text-foreground">You're on the list!</p>
                  <p className="text-sm text-muted-foreground">
                    We'll email you when {service.title} launches.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Bell className="h-4 w-4 text-primary" />
                    Get notified when we launch
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                      disabled={isSubmitting}
                      required
                    />
                    <Button type="submit" disabled={isSubmitting} size="sm">
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Notify Me"
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We'll only email you about this service launch.
                  </p>
                </form>
              )}
            </div>
            
            <div className="mb-8 space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Or contact us directly:</p>
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a 
                  href="mailto:contact@pure360.co.za" 
                  className="text-primary hover:underline"
                >
                  contact@pure360.co.za
                </a>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="font-medium">076 400 2332</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ComingSoon;
