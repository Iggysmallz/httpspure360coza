import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cleaning = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Cleaning Services
            </h1>
            <p className="text-muted-foreground">
              Booking wizard coming soon...
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cleaning;
