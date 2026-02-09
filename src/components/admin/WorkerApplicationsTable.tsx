import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Clock, User, MapPin, FileText, Download, Phone, Briefcase, Calendar, MessageSquare, Save, Loader2 } from "lucide-react";
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
  admin_notes: string | null;
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["worker-applications"] });
      toast({ title: "Success", description: "Application status updated" });
      if (selectedApp) {
        setSelectedApp({ ...selectedApp, status: variables.status });
      }
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    },
  });

  const saveNotes = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase
        .from("worker_applications")
        .update({ admin_notes: notes })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worker-applications"] });
      toast({ title: "Success", description: "Notes saved" });
      if (selectedApp) {
        setSelectedApp({ ...selectedApp, admin_notes: adminNotes });
      }
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save notes", variant: "destructive" });
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
                      <Button variant="outline" size="sm" onClick={() => { setSelectedApp(app); setAdminNotes(app.admin_notes || ""); }}>
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

      <Sheet open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Application Details</SheetTitle>
            <SheetDescription>Full worker application review</SheetDescription>
          </SheetHeader>

          {selectedApp && (
            <div className="mt-6 space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-28 w-28">
                  <AvatarImage src={selectedApp.profile_picture_url || ""} />
                  <AvatarFallback><User className="h-14 w-14" /></AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{selectedApp.full_name}</h3>
                  <div className="mt-1">{getStatusBadge(selectedApp.status)}</div>
                </div>
              </div>

              <Separator />

              {/* Details */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Personal Details</h4>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Contact Number</p>
                      <p className="font-medium">{selectedApp.contact_number}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Area</p>
                      <p className="font-medium">{selectedApp.area}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Work Type</p>
                      <p className="font-medium capitalize">{selectedApp.work_type}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Experience</p>
                      <p className="font-medium">{selectedApp.years_experience || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Applied On</p>
                      <p className="font-medium">{format(new Date(selectedApp.created_at), "dd MMMM yyyy, HH:mm")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedApp.additional_notes && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Additional Notes</h4>
                    <p className="text-sm whitespace-pre-wrap rounded-lg bg-muted p-3">{selectedApp.additional_notes}</p>
                  </div>
                </>
              )}

              <Separator />

              {/* Attachments */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Attachments</h4>

                {selectedApp.profile_picture_url && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Profile Picture</p>
                    <img
                      src={selectedApp.profile_picture_url}
                      alt="Profile"
                      className="w-full max-h-64 object-contain rounded-lg border bg-muted"
                    />
                  </div>
                )}

                {selectedApp.cv_url && (
                  <a href={selectedApp.cv_url} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted transition-colors">
                      <Download className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">CV / Resume</p>
                        <p className="text-xs text-muted-foreground">Click to download</p>
                      </div>
                    </div>
                  </a>
                )}

                {selectedApp.id_document_url && (
                  <a href={selectedApp.id_document_url} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted transition-colors">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">ID Document</p>
                        <p className="text-xs text-muted-foreground">Click to download</p>
                      </div>
                    </div>
                  </a>
                )}

                {!selectedApp.cv_url && !selectedApp.id_document_url && !selectedApp.profile_picture_url && (
                  <p className="text-sm text-muted-foreground">No attachments uploaded</p>
                )}
              </div>

              <Separator />

              {/* Admin Notes */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Admin Notes
                </h4>
                <Textarea
                  placeholder="Add internal notes about this applicant..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => saveNotes.mutate({ id: selectedApp.id, notes: adminNotes })}
                  disabled={saveNotes.isPending}
                >
                  {saveNotes.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Notes
                </Button>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-2 pb-4">
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
        </SheetContent>
      </Sheet>
    </>
  );
};

export default WorkerApplicationsTable;
