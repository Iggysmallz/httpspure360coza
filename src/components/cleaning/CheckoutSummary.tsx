import { ShieldCheck, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Extra {
  id: string;
  label: string;
  price: number;
}

interface BookingData {
  serviceName: string;
  basePrice: number;
  extrasPrice: number;
  selectedExtras: Extra[];
  unit?: string;
  street?: string;
  suburb?: string;
  date: string;
  time: string;
}

interface CheckoutSummaryProps {
  bookingData: BookingData;
  onPay: () => void;
  isLoading?: boolean;
}

export default function CheckoutSummary({ bookingData, onPay, isLoading }: CheckoutSummaryProps) {
  const travelFee = 50;
  const totalAmount = bookingData.basePrice + bookingData.extrasPrice + travelFee;

  const addressParts = [
    bookingData.unit,
    bookingData.street,
    bookingData.suburb,
  ].filter(Boolean);

  return (
    <div className="space-y-6 pb-32">
      <h2 className="text-xl font-bold text-foreground">Review your booking</h2>

      {/* Service Summary */}
      <Card className="border-border/50">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Service Address</p>
              <p className="text-sm text-muted-foreground">
                {addressParts.length > 0 ? addressParts.join(", ") : "Address to be confirmed"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Date & Time</p>
              <p className="text-sm text-muted-foreground">
                {bookingData.date} at {bookingData.time}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      <Card className="border-border/50">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{bookingData.serviceName} Cleaning</span>
            <span className="font-medium text-foreground">R{bookingData.basePrice}</span>
          </div>

          {bookingData.selectedExtras.map((extra) => (
            <div key={extra.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">+ {extra.label}</span>
              <span className="font-medium text-foreground">R{extra.price}</span>
            </div>
          ))}

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Transport & Service Fee</span>
            <span className="font-medium text-foreground">R{travelFee}</span>
          </div>

          <Separator className="my-2" />

          <div className="flex justify-between">
            <span className="font-semibold text-foreground">Total to Pay</span>
            <span className="text-xl font-bold text-primary">R{totalAmount}</span>
          </div>
        </CardContent>
      </Card>

      {/* Trust Signals */}
      <div className="flex items-start gap-3 rounded-lg bg-green-50 dark:bg-green-950/30 p-4 border border-green-200 dark:border-green-900">
        <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            Secure Payment via PayFast
          </p>
          <p className="text-xs text-green-700 dark:text-green-400">
            Your card details are encrypted and never stored on our servers.
          </p>
        </div>
      </div>

      {/* Fixed Payment Footer */}
      <div className="fixed bottom-16 left-0 right-0 z-50 border-t bg-card p-4 shadow-lg md:bottom-0">
        <div className="mx-auto max-w-md space-y-2">
          <Button
            onClick={onPay}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg"
          >
            {isLoading ? "Processing..." : `Pay R${totalAmount}`}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            By clicking pay, you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
