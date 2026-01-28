import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BookingsTable from "@/components/admin/BookingsTable";
import QuotesTable from "@/components/admin/QuotesTable";
import { Shield, Loader2 } from "lucide-react";

interface Booking {
  id: string;
  service_type: string;
  bedrooms: number;
  bathrooms: number;
  scheduled_date: string;
  scheduled_time: string;
  total_price: number;
  status: string;
  created_at: string;
  user_id: string;
}

interface QuoteRequest {
  id: string;
  service_type: string;
  care_type: string | null;
  frequency: string | null;
  pickup_suburb: string | null;
  dropoff_suburb: string | null;
  item_description: string | null;
  special_requirements: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  user_id: string;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        navigate("/");
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          variant: "destructive",
        });
      }
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate, toast]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) return;

      try {
        const [bookingsRes, quotesRes] = await Promise.all([
          supabase
            .from("bookings")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("quote_requests")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

        if (bookingsRes.data) setBookings(bookingsRes.data);
        if (quotesRes.data) setQuotes(quotesRes.data as QuoteRequest[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const handleBookingStatusChange = async (id: string, status: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    } else {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
      toast({
        title: "Success",
        description: "Booking status updated",
      });
    }
  };

  const handleQuoteStatusChange = async (id: string, status: string) => {
    const { error } = await supabase
      .from("quote_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update quote status",
        variant: "destructive",
      });
    } else {
      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status } : q))
      );
      toast({
        title: "Success",
        description: "Quote status updated",
      });
    }
  };

  const handleAddNotes = async (id: string, notes: string) => {
    const { error } = await supabase
      .from("quote_requests")
      .update({ admin_notes: notes })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
    } else {
      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, admin_notes: notes } : q))
      );
      toast({
        title: "Success",
        description: "Notes saved successfully",
      });
    }
  };

  if (authLoading || roleLoading || isLoading) {
    return (
      <Layout showBottomNav={false}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout showBottomNav={false}>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">
                Manage bookings and quote requests
              </p>
            </div>
          </div>

          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="bookings">
                Bookings ({bookings.length})
              </TabsTrigger>
              <TabsTrigger value="quotes">
                Quote Requests ({quotes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <BookingsTable
                bookings={bookings}
                onStatusChange={handleBookingStatusChange}
              />
            </TabsContent>

            <TabsContent value="quotes">
              <QuotesTable
                quotes={quotes}
                onStatusChange={handleQuoteStatusChange}
                onAddNotes={handleAddNotes}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
