import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validatePassword } from "@/lib/passwordValidation";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import RoleSelector from "@/components/auth/RoleSelector";
import AddressAutocomplete from "@/components/auth/AddressAutocomplete";
import logo from "@/assets/logo.png";

type SelectedRole = "client" | "worker";

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<SelectedRole>("client");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Redirect based on role
      checkUserRole();
    }
  }, [user]);

  const checkUserRole = async () => {
    if (!user) return;

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (roleData?.role === "admin") {
      navigate("/admin");
    } else if (roleData?.role === "worker") {
      // Check if profile is complete
      const { data: profile } = await supabase
        .from("profiles")
        .select("profile_completed, worker_status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile?.profile_completed) {
        navigate("/complete-profile");
      } else if (profile.worker_status !== "approved") {
        navigate("/pending-approval");
      } else {
        navigate("/worker-dashboard");
      }
    } else {
      navigate("/client-dashboard");
    }
  };

  const handleAddressChange = (addr: string, lat: number | null, lng: number | null) => {
    setAddress(addr);
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login flow
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You've successfully signed in.",
          });
        }
      } else {
        // Registration flow
        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
          toast({
            title: "Weak password",
            description: "Please meet all password requirements.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Validate required fields
        if (!firstName.trim() || !lastName.trim()) {
          toast({
            title: "Missing information",
            description: "Please fill in your first and last name.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // For clients, require address
        if (selectedRole === "client" && (!address || !latitude || !longitude)) {
          toast({
            title: "Invalid address",
            description: "Please select a valid address from the dropdown.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Sign up user
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
          toast({
            title: "Sign up failed",
            description: signUpError.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Wait for auth to complete
        const { data: { user: newUser } } = await supabase.auth.getUser();
        if (!newUser) {
          toast({
            title: "Sign up failed",
            description: "Could not get user data after signup.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Create user role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: newUser.id,
            role: selectedRole,
          });

        if (roleError) {
          console.error("Role creation error:", roleError);
        }

        // Create profile
        if (selectedRole === "client") {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              user_id: newUser.id,
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              address,
              latitude,
              longitude,
              profile_completed: true,
            });

          if (profileError) {
            console.error("Profile creation error:", profileError);
          }
        } else {
          // Worker - don't set address yet, they'll complete profile
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              user_id: newUser.id,
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              worker_status: "pending_approval",
              profile_completed: false,
            });

          if (profileError) {
            console.error("Profile creation error:", profileError);
          }
        }

        toast({
          title: "Account created!",
          description: selectedRole === "worker" 
            ? "Please complete your profile to continue."
            : "Welcome to Pure360!",
        });

        // Redirect based on role
        if (selectedRole === "worker") {
          navigate("/complete-profile");
        } else {
          navigate("/client-dashboard");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showBottomNav={false}>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
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
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <img src={logo} alt="Pure360" className="h-16 w-auto" />
            </div>

            <h1 className="mb-2 text-center text-2xl font-bold text-foreground">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              {isLogin 
                ? "Sign in to manage your bookings" 
                : "Sign up to book services or work with us"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selector - Only for signup */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label>I want to...</Label>
                  <RoleSelector value={selectedRole} onChange={setSelectedRole} />
                </div>
              )}

              {/* Name fields - Only for signup */}
              {!isLogin && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={8}
                  />
                </div>
                {!isLogin && <PasswordStrengthMeter password={password} />}
              </div>

              {/* Address - Only for client signup */}
              {!isLogin && selectedRole === "client" && (
                <AddressAutocomplete
                  value={address}
                  onChange={handleAddressChange}
                  required
                />
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading 
                  ? (isLogin ? "Signing in..." : "Creating account...")
                  : (isLogin ? "Sign In" : "Create Account")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
