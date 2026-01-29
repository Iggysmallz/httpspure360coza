import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Sparkles, Truck, Heart, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const services = [
    {
      title: "Cleaning",
      description: "Book a professional cleaning service",
      icon: Sparkles,
      href: "/cleaning",
      color: "text-primary",
    },
    {
      title: "Removals",
      description: "Request a moving quote",
      icon: Truck,
      href: "/removals",
      color: "text-blue-500",
    },
    {
      title: "Care Services",
      description: "Get care support quotes",
      icon: Heart,
      href: "/care",
      color: "text-pink-500",
    },
  ];

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {profile?.first_name || user?.email?.split("@")[0] || "there"}!
            </h1>
            <p className="text-muted-foreground">What would you like to do today?</p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <Card
              className="cursor-pointer transition-all hover:shadow-lg"
              onClick={() => navigate("/bookings")}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">My Bookings</CardTitle>
                    <CardDescription>View and manage your bookings</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all hover:shadow-lg"
              onClick={() => navigate("/profile")}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <User className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">My Profile</CardTitle>
                    <CardDescription>Update your information</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Services */}
          <h2 className="mb-4 text-lg font-semibold text-foreground">Book a Service</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {services.map((service) => (
              <Card
                key={service.title}
                className="cursor-pointer transition-all hover:shadow-lg"
                onClick={() => navigate(service.href)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <service.icon className={`h-6 w-6 ${service.color}`} />
                    </div>
                    <h3 className="font-medium text-foreground">{service.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientDashboard;
