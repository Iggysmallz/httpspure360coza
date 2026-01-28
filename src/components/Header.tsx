import { Button } from "@/components/ui/button";
import { User, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminRole();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">P</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold text-foreground">Pure</span>
            <span className="text-lg font-bold text-primary">360</span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#services" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Services
          </a>
          <a href="#about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            About
          </a>
          <a href="#contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Contact
          </a>
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
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => navigate("/profile")}
            >
              <User className="h-5 w-5" />
            </Button>
          )}
          {user ? (
            <Button
              onClick={() => signOut()}
              variant="outline"
              size="sm"
              className="rounded-lg font-medium"
            >
              Sign Out
            </Button>
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
