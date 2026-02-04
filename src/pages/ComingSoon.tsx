import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import logo from "@/assets/logo.png";

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
  
  const service = serviceInfo[serviceType] || serviceInfo["car-wash"];

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
            
            <div className="mb-8 space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">For updates, contact us:</p>
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
