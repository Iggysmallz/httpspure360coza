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

interface BookingsTableProps {
  bookings: Booking[];
  onStatusChange: (id: string, status: string) => void;
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
  regular: "Regular Clean",
  deep_clean: "Deep Clean",
  airbnb: "AirBnB Turnover",
};

const STATUS_OPTIONS = ["pending", "confirmed", "in_progress", "completed", "cancelled"];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const BookingsTable = ({ bookings, onStatusChange }: BookingsTableProps) => {
  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {SERVICE_TYPE_LABELS[booking.service_type] || booking.service_type}
              </TableCell>
              <TableCell>
                {booking.bedrooms} bed, {booking.bathrooms} bath
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {format(new Date(booking.scheduled_date), "PPP")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {booking.scheduled_time}
                </div>
              </TableCell>
              <TableCell className="font-semibold text-primary">
                R{booking.total_price}
              </TableCell>
              <TableCell>
                <Select
                  value={booking.status}
                  onValueChange={(value) => onStatusChange(booking.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue>
                      <Badge className={STATUS_COLORS[booking.status] || ""}>
                        {booking.status}
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
                {format(new Date(booking.created_at), "PP")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookingsTable;
