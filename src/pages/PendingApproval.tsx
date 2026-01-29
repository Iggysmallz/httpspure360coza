import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const PendingApproval = () => {
  const { profile, isLoading } = useProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Redirect based on status
  useEffect(() => {
    if (!isLoading && profile) {
      if (profile.worker_status === "approved") {
        navigate("/worker-dashboard");
      } else if (profile.worker_status === "rejected") {
        // Stay on this page but show rejected status
      }
    }
  }, [profile, isLoading, navigate]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
  };

  const getStatusIcon = () => {
    switch (profile?.worker_status) {
      case "approved":
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case "rejected":
        return <XCircle className="h-16 w-16 text-destructive" />;
      default:
        return <Clock className="h-16 w-16 text-primary animate-pulse" />;
    }
  };

  const getStatusMessage = () => {
    switch (profile?.worker_status) {
      case "approved":
        return {
          title: "You're Approved!",
          description: "You can now start accepting jobs.",
        };
      case "rejected":
        return {
          title: "Application Not Approved",
          description:
            "Unfortunately, your application was not approved at this time. Please contact support for more information.",
        };
      default:
        return {
          title: "Pending Approval",
          description:
            "Your profile is being reviewed by our team. This usually takes 24-48 hours.",
        };
    }
  };

  const status = getStatusMessage();

  return (
    <Layout showBottomNav={false}>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4">{getStatusIcon()}</div>
            <CardTitle>{status.title}</CardTitle>
            <CardDescription>{status.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile?.worker_status === "pending_approval" && (
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Check Status
              </Button>
            )}
            {profile?.worker_status === "approved" && (
              <Button onClick={() => navigate("/worker-dashboard")}>
                Go to Dashboard
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PendingApproval;
