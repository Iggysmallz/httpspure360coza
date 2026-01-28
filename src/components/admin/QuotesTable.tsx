import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Truck, MessageSquare } from "lucide-react";

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

interface QuotesTableProps {
  quotes: QuoteRequest[];
  onStatusChange: (id: string, status: string) => void;
  onAddNotes: (id: string, notes: string) => void;
}

const STATUS_OPTIONS = ["pending", "quoted", "accepted", "declined", "completed"];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  quoted: "bg-purple-100 text-purple-800",
  accepted: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

const QuotesTable = ({ quotes, onStatusChange, onAddNotes }: QuotesTableProps) => {
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [notes, setNotes] = useState("");

  const handleOpenNotes = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    setNotes(quote.admin_notes || "");
  };

  const handleSaveNotes = () => {
    if (selectedQuote) {
      onAddNotes(selectedQuote.id, notes);
      setSelectedQuote(null);
      setNotes("");
    }
  };

  if (quotes.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No quote requests found</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {quote.service_type === "removals" ? (
                      <Truck className="h-4 w-4 text-primary" />
                    ) : (
                      <Heart className="h-4 w-4 text-primary" />
                    )}
                    <span className="font-medium capitalize">
                      {quote.service_type === "care"
                        ? quote.care_type === "elderly_companion"
                          ? "Elderly Companion"
                          : "Nursing Care"
                        : "Removals"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {quote.service_type === "removals" ? (
                    <div className="max-w-xs space-y-1 text-sm">
                      {quote.pickup_suburb && quote.dropoff_suburb && (
                        <p>
                          {quote.pickup_suburb} → {quote.dropoff_suburb}
                        </p>
                      )}
                      {quote.item_description && (
                        <p className="line-clamp-2 text-muted-foreground">
                          {quote.item_description}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="max-w-xs space-y-1 text-sm">
                      {quote.frequency && <p>Frequency: {quote.frequency}</p>}
                      {quote.special_requirements && (
                        <p className="line-clamp-2 text-muted-foreground">
                          {quote.special_requirements}
                        </p>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Select
                    value={quote.status}
                    onValueChange={(value) => onStatusChange(quote.id, value)}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue>
                        <Badge className={STATUS_COLORS[quote.status] || ""}>
                          {quote.status}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          <Badge className={STATUS_COLORS[status] || ""}>
                            {status}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(quote.created_at), "PP")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenNotes(quote)}
                    className="gap-1"
                  >
                    <MessageSquare className="h-3 w-3" />
                    {quote.admin_notes ? "Edit Notes" : "Add Notes"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Notes / Response</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Add notes or response for this quote request..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedQuote(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotes}>Save Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuotesTable;
