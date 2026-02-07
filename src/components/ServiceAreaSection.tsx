import { MapPin, TrendingUp } from "lucide-react";

const ServiceAreaSection = () => {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
            Where We Operate
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Bringing professional, managed services to communities across South Africa.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Current Service Area */}
          <div className="flex items-start gap-4 rounded-xl bg-primary/5 border border-primary/15 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-foreground">
                Now Serving Cape Town
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                PURE360 currently operates across the Cape Town metro, delivering professional cleaning and removal services to homes, rental properties and businesses throughout the region.
              </p>
            </div>
          </div>

          {/* Expansion Plans */}
          <div className="flex items-start gap-4 rounded-xl bg-card border border-border p-5 shadow-soft">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-foreground">
                Expanding Nationwide
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We have a structured plan to expand into other provinces over time — bringing the same standard of vetted, company-managed service to more communities across South Africa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreaSection;
