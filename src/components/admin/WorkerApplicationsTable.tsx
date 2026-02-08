import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Clock, User, MapPin, FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface WorkerApplication {
  id: string;
  full_name: string;
  contact_number: string;
  area: string;
  work_type: string;
  years_experience: string | null;
  additional_notes: string | null;
  status: string;
  cv_url: string | null;
  id_document_url: string | null;
  profile_picture_url: string | null;
  created_at: string;
}

const WorkerApplicationsTable = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedApp, setSelectedApp] = useState<WorkerApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: applications, isLoading } = useQuery({
    queryKey: ["worker-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("worker_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as WorkerApplication[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("worker_applications")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worker-applications"] });
      toast({ title: "Success", description: "Application status updated" });
      setSelectedApp(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200"><CheckCircle className="mr-1 h-3 w-3" /> Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
    }
  };

  const pendingCount = applications?.filter(a => a.status === "pending").length || 0;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Worker Applications</CardTitle>
          <CardDescription>
            Review applications from the "Work With Us" page
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingCount} pending</Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading applications...</div>
          ) : !applications || applications.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No applications received yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Work Type</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={app.profile_picture_url || ""} />
                          <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{app.full_name}</p>
                          <p className="text-xs text-muted-foreground">{app.contact_number}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{app.work_type}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {app.area.length > 30 ? app.area.substring(0, 30) + "..." : app.area}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{format(new Date(app.created_at), "dd MMM yyyy")}</TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>
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

      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>Review this worker application</DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedApp.profile_picture_url || ""} />
                  <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
                </Avatar>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold">{selectedApp.full_name}</h3>
                {getStatusBadge(selectedApp.status)}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Contact:</span><span>{selectedApp.contact_number}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Work Type:</span><span className="capitalize">{selectedApp.work_type}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Experience:</span><span>{selectedApp.years_experience || "Not specified"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Area:</span><span className="text-right max-w-[200px]">{selectedApp.area}</span></div>
              </div>

              {selectedApp.additional_notes && (
                <div>
                  <p className="text-sm font-medium mb-1">Additional Notes</p>
                  <p className="text-sm text-muted-foreground">{selectedApp.additional_notes}</p>
                </div>
              )}

              <div className="flex gap-2">
                {selectedApp.cv_url && (
                  <a href={selectedApp.cv_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm"><Download className="mr-1 h-3 w-3" /> CV</Button>
                  </a>
                )}
                {selectedApp.id_document_url && (
                  <a href={selectedApp.id_document_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm"><FileText className="mr-1 h-3 w-3" /> ID Doc</Button>
                  </a>
                )}
              </div>

              <div className="flex gap-2">
                {selectedApp.status !== "approved" && (
                  <Button className="flex-1" onClick={() => updateStatus.mutate({ id: selectedApp.id, status: "approved" })} disabled={updateStatus.isPending}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Approve
                  </Button>
                )}
                {selectedApp.status !== "rejected" && (
                  <Button variant="destructive" className="flex-1" onClick={() => updateStatus.mutate({ id: selectedApp.id, status: "rejected" })} disabled={updateStatus.isPending}>
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkerApplicationsTable;
