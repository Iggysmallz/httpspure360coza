import { Button } from "@/components/ui/button";
import { MessageCircle, FileText } from "lucide-react";

interface HeroProps {
  onRequestQuote: () => void;
}

const Hero = ({ onRequestQuote }: HeroProps) => {
  const whatsappNumber = "27764002332";

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi Pure360, I'd like to book a service.");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-14 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        {/* Main heading */}
        <h1 className="mb-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl animate-fade-in">
          Professional home cleaning{" "}
          <span className="text-primary">&amp; removal services</span>{" "}
          you can rely on.
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto mb-4 max-w-2xl text-base text-muted-foreground sm:text-lg animate-fade-in" style={{ animationDelay: "0.1s" }}>
          PURE360 provides managed, vetted cleaning and removal solutions for homes, rental properties and businesses — so you don't have to worry about a thing.
        </p>

        {/* Cape Town launch note */}
        <p className="mx-auto mb-8 text-sm text-muted-foreground/80 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          Now serving Cape Town · Expanding to other provinces soon
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Button
            onClick={handleWhatsApp}
            size="lg"
            className="h-12 w-full sm:w-auto gap-2.5 rounded-xl px-7 text-base font-semibold shadow-lg shadow-primary/20"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp to Book
          </Button>
          <Button
            onClick={onRequestQuote}
            variant="outline"
            size="lg"
            className="h-12 w-full sm:w-auto gap-2.5 rounded-xl px-7 text-base font-semibold border-2"
          >
            <FileText className="h-5 w-5" />
            Request a Quote
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
