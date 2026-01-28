import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Bookings = () => {
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
          
          <h1 className="text-2xl font-bold text-foreground mb-6">
            My Bookings
          </h1>

          <div className="space-y-4">
            {/* Empty state */}
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">No bookings yet</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                When you book a service, it will appear here
              </p>
              <Button onClick={() => navigate("/")}>
                Browse Services
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Bookings;
