import { Building2, FileText, ClipboardCheck, Headphones } from "lucide-react";

const reasons = [
  {
    icon: Building2,
    title: "In-house & Partner Teams",
    description:
      "Our services are delivered by a combination of in-house staff and vetted partner professionals — all trained and supervised by PURE360. You get accountability and consistency every time.",
  },
  {
    icon: FileText,
    title: "Clear Scope & Pricing",
    description:
      "You'll know exactly what's included and what it costs before we start. No hidden fees, no surprises.",
  },
  {
    icon: ClipboardCheck,
    title: "Quality Checks & Follow-Ups",
    description:
      "Supervisors inspect completed work and we follow up after every job to make sure you're 100% satisfied.",
  },
  {
    icon: Headphones,
    title: "Real Support When You Need It",
    description:
      "If something isn't right, our support team is a WhatsApp message away — and we'll fix it fast.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8 bg-secondary/40">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
            Why Choose PURE360?
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            We run our services like a proper business — because that's what your home deserves.
          </p>
        </div>

        <div className="space-y-4">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-xl bg-card p-5 shadow-soft transition-all duration-300 hover:shadow-card"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <reason.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  {reason.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
