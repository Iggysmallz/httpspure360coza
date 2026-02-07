import { CheckCircle, MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BookingConfirmationScreen = () => {
  const navigate = useNavigate();

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi Pure360, I just submitted a booking request and have a follow-up question.");
    window.open(`https://wa.me/27764002332?text=${message}`, "_blank");
  };

  return (
    <div className="mx-auto max-w-md text-center py-12 px-4">
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/50">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
      </div>

      <h2 className="mb-2 text-2xl font-bold text-foreground">
        Thank You!
      </h2>
      <p className="mb-2 text-muted-foreground">
        Your booking request has been received.
      </p>
      <p className="mb-8 text-sm text-muted-foreground">
        A PURE360 team member will contact you shortly to confirm pricing, availability and service details.
      </p>

      <div className="space-y-3">
        <Button
          onClick={handleWhatsApp}
          className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          <MessageCircle className="h-5 w-5" />
          Contact Us on WhatsApp
        </Button>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="w-full gap-2"
          size="lg"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmationScreen;
