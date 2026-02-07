import { MessageCircle, FileCheck, Briefcase, ThumbsUp } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    title: "Get in Touch",
    description: "Reach out via WhatsApp or our online booking form to tell us what you need.",
  },
  {
    icon: FileCheck,
    title: "We Confirm the Details",
    description: "We'll agree on the service, pricing and a date that works for you.",
  },
  {
    icon: Briefcase,
    title: "We Get It Done",
    description: "Our team arrives on time and completes the job to a high standard.",
  },
  {
    icon: ThumbsUp,
    title: "You're Happy",
    description: "Sit back, relax and enjoy the results — it's that simple.",
  },
];

const HowItWorks = () => {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8 bg-secondary/40">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Booking a service with PURE360 is quick and straightforward.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
              </div>
              <h3 className="mb-1 font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
