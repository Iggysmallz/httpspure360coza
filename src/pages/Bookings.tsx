import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Heart, Truck, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

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
  created_at: string;
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
  regular: "Regular Clean",
  deep_clean: "Deep Clean",
  airbnb: "AirBnB Turnover",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  quoted: "bg-purple-100 text-purple-800",
  accepted: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
};

const Bookings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [bookingsRes, quotesRes] = await Promise.all([
          supabase
            .from("bookings")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("quote_requests")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        ]);

        if (bookingsRes.data) setBookings(bookingsRes.data);
        if (quotesRes.data) setQuoteRequests(quotesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleContactSupport = () => {
    // Replace with actual WhatsApp number
    window.open("https://wa.me/27123456789?text=Hi%20Pure360%2C%20I%20need%20help%20with%20my%20booking.", "_blank");
  };

  if (loading || isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleContactSupport}
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Support
            </Button>
          </div>

          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bookings">
                My Bookings ({bookings.length})
              </TabsTrigger>
              <TabsTrigger value="quotes">
                Quote Requests ({quoteRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="mt-4 space-y-4">
              {bookings.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-medium text-foreground">No bookings yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Book your first cleaning service
                  </p>
                  <Button onClick={() => navigate("/cleaning")}>
                    Book a Clean
                  </Button>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">
                          {SERVICE_TYPE_LABELS[booking.service_type] || booking.service_type}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {booking.bedrooms} bed, {booking.bathrooms} bath
                        </p>
                      </div>
                      <Badge className={STATUS_COLORS[booking.status] || ""}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(booking.scheduled_date), "PPP")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {booking.scheduled_time}
                      </div>
                    </div>
                    <div className="mt-3 border-t border-border pt-3">
                      <span className="text-lg font-semibold text-primary">
                        R{booking.total_price}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="quotes" className="mt-4 space-y-4">
              {quoteRequests.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-medium text-foreground">No quote requests yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Request a quote for removals or care services
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={() => navigate("/removals")}>
                      Removals
                    </Button>
                    <Button onClick={() => navigate("/care")}>
                      Care Services
                    </Button>
                  </div>
                </div>
              ) : (
                quoteRequests.map((quote) => (
                  <div
                    key={quote.id}
                    className="rounded-xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {quote.service_type === "removals" ? (
                          <Truck className="h-5 w-5 text-primary" />
                        ) : (
                          <Heart className="h-5 w-5 text-primary" />
                        )}
                        <h3 className="font-medium capitalize text-foreground">
                          {quote.service_type === "care" 
                            ? (quote.care_type === "elderly_companion" ? "Elderly Companion" : "Nursing Care")
                            : "Removals"}
                        </h3>
                      </div>
                      <Badge className={STATUS_COLORS[quote.status] || ""}>
                        {quote.status}
                      </Badge>
                    </div>
                    
                    {quote.service_type === "removals" && (
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {quote.item_description && (
                          <p className="line-clamp-2">{quote.item_description}</p>
                        )}
                        {quote.pickup_suburb && quote.dropoff_suburb && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {quote.pickup_suburb} → {quote.dropoff_suburb}
                          </div>
                        )}
                      </div>
                    )}

                    {quote.service_type === "care" && (
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {quote.frequency && <p>Frequency: {quote.frequency}</p>}
                        {quote.special_requirements && (
                          <p className="line-clamp-2">{quote.special_requirements}</p>
                        )}
                      </div>
                    )}

                    <div className="mt-3 text-xs text-muted-foreground">
                      Requested {format(new Date(quote.created_at), "PPP")}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Bookings;
