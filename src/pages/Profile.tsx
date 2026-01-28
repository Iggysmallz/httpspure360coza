import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Settings, LogOut, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: "My Account", description: "Manage your profile" },
    { icon: Settings, label: "Settings", description: "App preferences" },
  ];

  const handleWhatsAppSupport = () => {
    // Replace with actual WhatsApp number
    window.open("https://wa.me/27000000000?text=Hi%20Pure360%2C%20I%20need%20help%20with...", "_blank");
  };

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
            Profile
          </h1>

          {/* Not logged in state */}
          <div className="rounded-2xl border border-border bg-card p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Sign in to your account</h3>
                <p className="text-sm text-muted-foreground">
                  Track your bookings and manage your profile
                </p>
              </div>
            </div>
            <Button onClick={() => navigate("/auth")} className="mt-4 w-full">
              Sign In
            </Button>
          </div>

          {/* Menu items */}
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{item.label}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* WhatsApp Support */}
          <div className="mt-6">
            <Button 
              variant="outline" 
              onClick={handleWhatsAppSupport}
              className="w-full gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Contact Support via WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
