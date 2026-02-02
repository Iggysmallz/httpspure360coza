import { ShieldCheck, ClipboardCheck, Users, ThumbsUp, Heart } from "lucide-react";

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: ShieldCheck,
      title: "Trained & Vetted Staff",
      description: "Every team member is background-checked and professionally trained.",
    },
    {
      icon: ClipboardCheck,
      title: "Supervisor Quality Checks",
      description: "Regular inspections ensure consistently high standards on every job.",
    },
    {
      icon: Users,
      title: "Reliable Local Teams",
      description: "Dependable Cape Town-based professionals you can trust in your home.",
    },
    {
      icon: ThumbsUp,
      title: "Satisfaction Guaranteed",
      description: "Not happy? We'll make it right — that's our promise to you.",
    },
    {
      icon: Heart,
      title: "Community Upliftment",
      description: "Fair wages and dignified work for our team members.",
    },
  ];

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
            Why Choose PURE360?
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            We're committed to quality, trust, and making a positive impact in our community.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group flex flex-col items-center rounded-xl bg-card p-6 text-center shadow-soft transition-all duration-300 hover:shadow-card"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary transition-colors duration-300 group-hover:bg-primary/10">
                <reason.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                {reason.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;