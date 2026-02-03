import { CheckCircle, Calendar, MapPin, Clock, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface BookingConfirmationProps {
  bookingDetails: {
    serviceName: string;
    date: string;
    time: string;
    totalPrice: number;
    address?: string;
  };
}

export default function BookingConfirmation({ bookingDetails }: BookingConfirmationProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      {/* Success Header */}
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Booking Confirmed!</h2>
        <p className="text-sm text-muted-foreground">
          Your cleaning service has been scheduled successfully.
        </p>
      </div>

      {/* Booking Summary Card */}
      <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Service</p>
              <p className="text-sm text-muted-foreground">{bookingDetails.serviceName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Date & Time</p>
              <p className="text-sm text-muted-foreground">
                {bookingDetails.date} at {bookingDetails.time}
              </p>
            </div>
          </div>

          {bookingDetails.address && (
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Address</p>
                <p className="text-sm text-muted-foreground">{bookingDetails.address}</p>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-green-200 dark:border-green-800">
            <div className="flex justify-between items-center">
              <span className="font-medium text-foreground">Total Paid</span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                R{bookingDetails.totalPrice}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-border/50">
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-foreground">What happens next?</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                1
              </span>
              <p className="text-sm text-muted-foreground">
                You'll receive a confirmation SMS and email with your booking details.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                2
              </span>
              <p className="text-sm text-muted-foreground">
                Our vetted cleaner will arrive at your address on the scheduled date.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                3
              </span>
              <p className="text-sm text-muted-foreground">
                After the service, you can rate your experience in the app.
              </p>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Support Section */}
      <div className="rounded-lg bg-muted/50 p-4 flex items-center gap-3">
        <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Need help?</p>
          <p className="text-xs text-muted-foreground">
            Contact us via WhatsApp for any questions.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open("https://wa.me/27000000000", "_blank")}
        >
          Chat
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          onClick={() => navigate("/bookings")} 
          className="w-full"
        >
          View My Bookings
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate("/")} 
          className="w-full"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
