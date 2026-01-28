import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CareQuoteForm from "@/components/quotes/CareQuoteForm";

const Care = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-lg">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <CareQuoteForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Care;
