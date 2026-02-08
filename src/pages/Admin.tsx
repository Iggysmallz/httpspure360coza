import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BookingsTable from "@/components/admin/BookingsTable";
import QuotesTable from "@/components/admin/QuotesTable";
import WorkerApplicationsTable from "@/components/admin/WorkerApplicationsTable";
import { 
  Shield, 
  Loader2, 
  Users, 
  CalendarCheck, 
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

type WorkerStatus = "pending_approval" | "approved" | "rejected";

interface WorkerProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  profile_picture_url: string | null;
  worker_status: WorkerStatus | null;
  profile_completed: boolean;
  created_at: string;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);

  // Fetch workers
  const { data: workers, isLoading: workersLoading } = useQuery({
    queryKey: ["admin-workers"],
    queryFn: async () => {
      const { data: workerRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "worker");

      if (rolesError) throw rolesError;
      if (!workerRoles || workerRoles.length === 0) return [];

      const workerIds = workerRoles.map((r) => r.user_id);

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", workerIds)
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;
      return profiles as WorkerProfile[];
    },
    enabled: isAdmin,
  });

  const updateWorkerStatus = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: WorkerStatus }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ worker_status: status })
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-workers"] });
      toast({ title: "Success", description: "Worker status updated" });
      setSelectedWorker(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    },
  });

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
      toast({ title: "Error", description: "Failed to update booking status", variant: "destructive" });
    } else {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      toast({ title: "Success", description: "Booking status updated" });
    }
  };

  const handleQuoteStatusChange = async (id: string, status: string) => {
    const { error } = await supabase
      .from("quote_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to update quote status", variant: "destructive" });
    } else {
      setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
      toast({ title: "Success", description: "Quote status updated" });
    }
  };

  const handleAddNotes = async (id: string, notes: string) => {
    const { error } = await supabase
      .from("quote_requests")
      .update({ admin_notes: notes })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to save notes", variant: "destructive" });
    } else {
      setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, admin_notes: notes } : q)));
      toast({ title: "Success", description: "Notes saved successfully" });
    }
  };

  const getStatusBadge = (status: WorkerStatus | null) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200"><CheckCircle className="mr-1 h-3 w-3" /> Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
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

  const pendingCount = workers?.filter(w => w.worker_status === "pending_approval").length || 0;

  return (
    <Layout showBottomNav={false}>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">
                Manage workers, bookings and quote requests
              </p>
            </div>
          </div>

          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-4">
              <TabsTrigger value="applications" className="gap-2">
                <FileText className="h-4 w-4" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="workers" className="gap-2">
                <Users className="h-4 w-4" />
                Workers
                {pendingCount > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">{pendingCount}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2">
                <CalendarCheck className="h-4 w-4" />
                Bookings ({bookings.length})
              </TabsTrigger>
              <TabsTrigger value="quotes" className="gap-2">
                <FileText className="h-4 w-4" />
                Quotes ({quotes.length})
              </TabsTrigger>
            </TabsList>

            {/* Applications Tab */}
            <TabsContent value="applications">
              <WorkerApplicationsTable />
            </TabsContent>

            {/* Workers Tab */}
            <TabsContent value="workers">
              <Card>
                <CardHeader>
                  <CardTitle>Worker Management</CardTitle>
                  <CardDescription>Review and manage worker applications</CardDescription>
                </CardHeader>
                <CardContent>
                  {workersLoading ? (
                    <div className="py-8 text-center text-muted-foreground">Loading workers...</div>
                  ) : !workers || workers.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">No workers registered yet</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Worker</TableHead>
                          <TableHead>Profile</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workers.map((worker) => (
                          <TableRow key={worker.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={worker.profile_picture_url || ""} />
                                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{worker.first_name} {worker.last_name}</p>
                                  {worker.address && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {worker.address.split(",")[0]}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {worker.profile_completed ? (
                                <Badge variant="outline" className="text-green-600 border-green-200">Complete</Badge>
                              ) : (
                                <Badge variant="outline" className="text-amber-600 border-amber-200">Incomplete</Badge>
                              )}
                            </TableCell>
                            <TableCell>{getStatusBadge(worker.worker_status)}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" onClick={() => setSelectedWorker(worker)}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <BookingsTable bookings={bookings} onStatusChange={handleBookingStatusChange} />
            </TabsContent>

            <TabsContent value="quotes">
              <QuotesTable quotes={quotes} onStatusChange={handleQuoteStatusChange} onAddNotes={handleAddNotes} />
            </TabsContent>
          </Tabs>

          {/* Worker Detail Dialog */}
          <Dialog open={!!selectedWorker} onOpenChange={() => setSelectedWorker(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Worker Profile</DialogTitle>
                <DialogDescription>Review worker details and update status</DialogDescription>
              </DialogHeader>
              
              {selectedWorker && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={selectedWorker.profile_picture_url || ""} />
                      <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="space-y-2 text-center">
                    <h3 className="text-lg font-semibold">{selectedWorker.first_name} {selectedWorker.last_name}</h3>
                    {getStatusBadge(selectedWorker.worker_status)}
                  </div>

                  {selectedWorker.address && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{selectedWorker.address}</p>
                      {selectedWorker.latitude && selectedWorker.longitude && (
                        <div className="h-40 rounded-lg bg-muted overflow-hidden">
                          <iframe
                            title="Worker location"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            src={`https://www.google.com/maps?q=${selectedWorker.latitude},${selectedWorker.longitude}&z=15&output=embed`}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {selectedWorker.worker_status !== "approved" && (
                      <Button
                        className="flex-1"
                        onClick={() => updateWorkerStatus.mutate({ userId: selectedWorker.user_id, status: "approved" })}
                        disabled={updateWorkerStatus.isPending}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    )}
                    {selectedWorker.worker_status !== "rejected" && (
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => updateWorkerStatus.mutate({ userId: selectedWorker.user_id, status: "rejected" })}
                        disabled={updateWorkerStatus.isPending}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
