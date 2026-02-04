import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Star, Briefcase } from "lucide-react";
interface HeroProps {
  onBookService: () => void;
  onWorkWithUs: () => void;
}
const Hero = ({
  onBookService,
  onWorkWithUs
}: HeroProps) => {
  const features = [{
    icon: Shield,
    text: "Trusted & Vetted"
  }, {
    icon: Clock,
    text: "Same Day Service"
  }, {
    icon: Star,
    text: "5-Star Rated"
  }];
  return <section className="relative overflow-hidden px-4 pb-8 pt-12 sm:px-6 sm:pb-12 sm:pt-16 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      
      <div className="relative mx-auto max-w-4xl">
        {/* Badge */}
        <div className="mb-6 flex justify-center animate-fade-in">
          
        </div>

        {/* Main heading */}
        <h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-fade-in" style={{
        animationDelay: "0.1s"
      }}>
          All your home & property services.{" "}
          <span className="relative">
            <span className="text-primary">One trusted team.</span>
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 10C50 4 150 4 198 10" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
            </svg>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-8 max-w-2xl text-center text-lg text-muted-foreground sm:text-xl animate-fade-in" style={{
        animationDelay: "0.2s"
      }}>
          From home cleaning and gardening to removals, Airbnb turnovers and care services — PURE360 manages it all, professionally and reliably.
        </p>

        {/* CTA Buttons */}
        <div className="mb-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{
        animationDelay: "0.3s"
      }}>
          <Button onClick={onBookService} size="lg" className="group h-14 w-full sm:w-auto gap-3 rounded-xl px-8 text-base font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30">
            Book a Service
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
          <Button onClick={onWorkWithUs} variant="outline" size="lg" className="group h-14 w-full sm:w-auto gap-3 rounded-xl px-8 text-base font-semibold border-2 transition-all duration-300 hover:bg-secondary">
            <Briefcase className="h-5 w-5" />
            Work With PURE360
          </Button>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 animate-fade-in" style={{
        animationDelay: "0.4s"
      }}>
          {features.map((feature, index) => <div key={index} className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2">
              <feature.icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{feature.text}</span>
            </div>)}
        </div>
      </div>
    </section>;
};
export default Hero;