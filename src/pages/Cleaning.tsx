import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CleaningWizard from "@/components/cleaning/CleaningWizard";

const Cleaning = () => {
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
            <CleaningWizard />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cleaning;
