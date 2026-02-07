import { MessageCircle, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BookingCTA = () => {
  const navigate = useNavigate();
  const whatsappNumber = "27764002332";

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi Pure360, I'd like to book a service.");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8 bg-primary/5">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
          Ready to Book?
        </h2>
        <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
          Get in touch via WhatsApp for the fastest response, or complete our simple online form. Either way, we'll take care of the rest.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Button
            onClick={handleWhatsApp}
            size="lg"
            className="h-12 w-full sm:w-auto gap-2.5 rounded-xl px-7 text-base font-semibold shadow-lg shadow-primary/20"
          >
            <MessageCircle className="h-5 w-5" />
            Book via WhatsApp
          </Button>
          <Button
            onClick={() => navigate("/book")}
            variant="outline"
            size="lg"
            className="h-12 w-full sm:w-auto gap-2.5 rounded-xl px-7 text-base font-semibold border-2"
          >
            <FileText className="h-5 w-5" />
            Request a Booking Online
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>All bookings are reviewed and confirmed by the PURE360 team before service delivery.</span>
        </div>
      </div>
    </section>
  );
};

export default BookingCTA;
