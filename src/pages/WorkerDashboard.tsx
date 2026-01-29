import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Briefcase, CheckCircle } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

const WorkerDashboard = () => {
  const { profile } = useProfile();

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Welcome Section */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Worker Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.first_name || "Worker"}!
              </p>
            </div>
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="mr-1 h-3 w-3" />
              Approved
            </Badge>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Available Jobs</CardDescription>
                <CardTitle className="text-2xl">0</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Completed This Week</CardDescription>
                <CardTitle className="text-2xl">0</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Earnings This Month</CardDescription>
                <CardTitle className="text-2xl">R 0.00</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Available Jobs */}
          <h2 className="mb-4 text-lg font-semibold text-foreground">Available Jobs</h2>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Briefcase className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="font-medium text-foreground">No jobs available</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Check back soon for new job opportunities
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default WorkerDashboard;
