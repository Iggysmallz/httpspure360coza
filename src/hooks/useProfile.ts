import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type WorkerStatus = "pending_approval" | "approved" | "rejected";

export interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  address: string | null;
  unit_number: string | null;
  complex_name: string | null;
  street_address: string | null;
  suburb: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  profile_picture_url: string | null;
  worker_status: WorkerStatus | null;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  user_id: string;
  first_name: string;
  last_name: string;
  address?: string | null;
  unit_number?: string | null;
  complex_name?: string | null;
  street_address?: string | null;
  suburb?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  profile_picture_url?: string | null;
  worker_status?: WorkerStatus | null;
  profile_completed?: boolean;
}

export interface ProfileUpdate {
  first_name?: string;
  last_name?: string;
  address?: string | null;
  unit_number?: string | null;
  complex_name?: string | null;
  street_address?: string | null;
  suburb?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  profile_picture_url?: string | null;
  worker_status?: WorkerStatus | null;
  profile_completed?: boolean;
}

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!user,
  });

  const createProfile = useMutation({
    mutationFn: async (profileData: ProfileInsert) => {
      const { data, error } = await supabase
        .from("profiles")
        .insert(profileData)
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (profileData: ProfileUpdate) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });

  return {
    profile,
    isLoading,
    error,
    createProfile,
    updateProfile,
  };
};

export const useUserRole = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["userRole", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data?.role as "admin" | "moderator" | "user" | "client" | "worker" | null;
    },
    enabled: !!user,
  });
};
