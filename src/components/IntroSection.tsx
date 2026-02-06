import { ShieldCheck, Users, Star } from "lucide-react";

const IntroSection = () => {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">
          Who We Are
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
          PURE360 is a professional home and property services company that takes the stress out of maintaining your space. 
          Every job is carried out by trained, company-managed staff — not random freelancers — so you always get consistent, reliable results. 
          We handle the vetting, scheduling and quality checks, so you don't have to worry about a thing.
        </p>

        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, label: "Vetted & Trained Staff" },
            { icon: Users, label: "Company-Managed Teams" },
            { icon: Star, label: "Quality Guaranteed" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground sm:text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
