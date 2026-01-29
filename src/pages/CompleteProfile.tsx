import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import AddressAutocomplete from "@/components/auth/AddressAutocomplete";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();

  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [latitude, setLatitude] = useState<number | null>(profile?.latitude || null);
  const [longitude, setLongitude] = useState<number | null>(profile?.longitude || null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(profile?.profile_picture_url || "");
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddressChange = (addr: string, lat: number | null, lng: number | null) => {
    setAddress(addr);
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      setProfilePicture(file);
      setProfilePictureUrl(URL.createObjectURL(file));
    }
  };

  const uploadProfilePicture = async (): Promise<string | null> => {
    if (!profilePicture || !user) return profilePictureUrl;

    const fileExt = profilePicture.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-pictures")
      .upload(fileName, profilePicture, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in your first and last name.",
        variant: "destructive",
      });
      return;
    }

    if (!address || !latitude || !longitude) {
      toast({
        title: "Invalid address",
        description: "Please select a valid address from the dropdown.",
        variant: "destructive",
      });
      return;
    }

    if (!profilePictureUrl) {
      toast({
        title: "Profile picture required",
        description: "Please upload a profile picture.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const uploadedUrl = await uploadProfilePicture();

      await updateProfile.mutateAsync({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        address,
        latitude,
        longitude,
        profile_picture_url: uploadedUrl,
        profile_completed: true,
      });

      toast({
        title: "Profile completed!",
        description: "Your profile is now pending approval.",
      });

      navigate("/pending-approval");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showBottomNav={false}>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              Fill in your details to start receiving job opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Picture */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profilePictureUrl} />
                    <AvatarFallback>
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-sm text-muted-foreground">
                  Upload a profile picture (required)
                </p>
              </div>

              {/* Name Fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <AddressAutocomplete
                value={address}
                onChange={handleAddressChange}
                required
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Complete Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CompleteProfile;
