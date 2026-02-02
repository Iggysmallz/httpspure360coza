import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Shield, CalendarCheck, LogOut, ChevronDown, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useUserRole } from "@/hooks/useProfile";
import logo from "@/assets/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminRole();
  const { data: userRole } = useUserRole();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getDashboardPath = () => {
    if (isAdmin) return "/admin";
    if (userRole === "worker") return "/worker-dashboard";
    return "/client-dashboard";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
        >
          <img src={logo} alt="Pure360" className="h-10 w-auto" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <button
            onClick={() => {
              navigate("/");
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-muted"
          >
            Home
          </button>
          <button
            onClick={() => {
              navigate("/");
              setTimeout(() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }), 100);
            }}
            className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-muted"
          >
            Our Services
          </button>
          <button
            onClick={() => {
              navigate("/");
              setTimeout(() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }), 100);
            }}
            className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-muted"
          >
            Book a Service
          </button>
          <button
            onClick={() => navigate("/work-with-us")}
            className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-muted"
          >
            Work With PURE360
          </button>
          <button
            onClick={() => {
              navigate("/");
              setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 100);
            }}
            className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-muted"
          >
            Contact Us
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex items-center gap-1.5"
              onClick={() => navigate("/admin")}
            >
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </Button>
          )}
          
          {user ? (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 rounded-lg font-medium"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline max-w-[120px] truncate">
                      {user.email?.split('@')[0] || 'Account'}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-background z-50">
                  <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(getDashboardPath())} className="cursor-pointer">
                    {userRole === "worker" ? (
                      <><Briefcase className="mr-2 h-4 w-4" />My Dashboard</>
                    ) : (
                      <><CalendarCheck className="mr-2 h-4 w-4" />My Bookings</>
                    )}
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/admin")} className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-1.5">Logout</span>
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              size="sm"
              className="rounded-lg font-medium"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
