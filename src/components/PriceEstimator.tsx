import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── EDITABLE CONFIG ────────────────────────────────────────────────
const CONFIG = {
  // Replace with your WhatsApp number (digits only, with country code)
  WHATSAPP_NUMBER: "27XXXXXXXXXX",

  REGULAR: {
    // Flat base price per number of bedrooms
    bedroomPrices: { 1: 350, 2: 450, 3: 580, 4: 720, 5: 880 } as Record<number, number>,
    // Extra charge per bathroom beyond the first
    extraBathroomFee: 60,
    // Frequency discounts (as decimal, e.g. 0.05 = 5%)
    frequencyDiscounts: {
      "once-off": 0,
      "every-2-weeks": 0.05,
      weekly: 0.1,
    } as Record<string, number>,
  },

  OFFICE: {
    // Flat "from" prices per size tier
    small: 450,   // < 100 m²
    medium: 950,  // 100–400 m²
    large: null,  // 400 m²+ → custom quote
  },

  MOVE_OUT: {
    // Flat per-job prices by bedroom count
    prices: {
      "Studio / 1 bed": 1200,
      "2 bed": 1600,
      "3 bed": 2000,
      "4 bed+": 2500,
    } as Record<string, number>,
  },
};
// ────────────────────────────────────────────────────────────────────

type Tab = "regular" | "office" | "move-out";

const FREQUENCY_LABELS: Record<string, string> = {
  "once-off": "Once-off",
  "every-2-weeks": "Every 2 weeks  (−5%)",
  weekly: "Weekly  (−10%)",
};

const OFFICE_SIZES = [
  { key: "small", label: "Small  (< 100 m²)", price: CONFIG.OFFICE.small },
  { key: "medium", label: "Medium  (100–400 m²)", price: CONFIG.OFFICE.medium },
  { key: "large", label: "Large  (400 m²+)", price: null },
] as const;

const MOVE_OUT_SIZES = Object.keys(CONFIG.MOVE_OUT.prices);

// ── Small stepper ──────────────────────────────────────────────────
const Stepper = ({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-sm text-muted-foreground">{label}</span>
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:border-primary hover:text-primary disabled:opacity-40"
        disabled={value <= min}
      >
        −
      </button>
      <span className="w-5 text-center font-semibold text-foreground">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:border-primary hover:text-primary disabled:opacity-40"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  </div>
);

// ── Tab button ─────────────────────────────────────────────────────
const TabBtn = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 rounded-lg py-2 text-sm font-medium transition-all",
      active
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground"
    )}
  >
    {children}
  </button>
);

// ── Main component ─────────────────────────────────────────────────
const PriceEstimator = () => {
  const [tab, setTab] = useState<Tab>("regular");

  // Regular state
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [frequency, setFrequency] = useState("once-off");

  // Office state
  const [officeSize, setOfficeSize] = useState<"small" | "medium" | "large">("small");

  // Move-out state
  const [moveOutSize, setMoveOutSize] = useState(MOVE_OUT_SIZES[0]);

  // ── Price calculation ──────────────────────────────────────────
  const computePrice = (): { display: string; raw: number | null; label: string } => {
    if (tab === "regular") {
      const base =
        CONFIG.REGULAR.bedroomPrices[Math.min(bedrooms, 5)] ??
        CONFIG.REGULAR.bedroomPrices[5];
      const extraBath = Math.max(0, bathrooms - 1) * CONFIG.REGULAR.extraBathroomFee;
      const subtotal = base + extraBath;
      const discount = CONFIG.REGULAR.frequencyDiscounts[frequency] ?? 0;
      const total = Math.round(subtotal * (1 - discount));
      const suffix =
        frequency === "once-off" ? "once-off" : frequency === "weekly" ? "per visit" : "per visit";
      return { display: `R${total}`, raw: total, label: suffix };
    }

    if (tab === "office") {
      const tier = OFFICE_SIZES.find((s) => s.key === officeSize)!;
      if (tier.price === null)
        return { display: "Custom quote", raw: null, label: "based on your requirements" };
      return { display: `from R${tier.price}`, raw: tier.price, label: "per visit" };
    }

    // move-out
    const price = CONFIG.MOVE_OUT.prices[moveOutSize];
    return { display: `R${price}`, raw: price, label: "flat rate" };
  };

  const { display, raw, label } = computePrice();

  // ── WhatsApp message ───────────────────────────────────────────
  const openWhatsApp = () => {
    let msg = "";
    if (tab === "regular") {
      msg = `Hi Pure360! I'd like a Regular Clean quote.\n• Bedrooms: ${bedrooms}\n• Bathrooms: ${bathrooms}\n• Frequency: ${FREQUENCY_LABELS[frequency]}\n• Estimated price: ${display} (${label})`;
    } else if (tab === "office") {
      const sizeLabel = OFFICE_SIZES.find((s) => s.key === officeSize)?.label;
      msg = `Hi Pure360! I'd like an Office Clean quote.\n• Office size: ${sizeLabel}\n• Estimated price: ${display} (${label})`;
    } else {
      msg = `Hi Pure360! I'd like a Move-out Clean quote.\n• Property size: ${moveOutSize}\n• Estimated price: ${display} (${label})`;
    }
    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        {/* Heading */}
        <div className="mb-8 text-center">
          <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Instant Estimate
          </span>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            What will it cost?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get a ballpark figure in seconds — no sign-up needed.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card shadow-card">
          {/* Tabs */}
          <div className="flex gap-1 rounded-t-2xl border-b border-border bg-muted/30 p-2">
            <TabBtn active={tab === "regular"} onClick={() => setTab("regular")}>
              Regular clean
            </TabBtn>
            <TabBtn active={tab === "office"} onClick={() => setTab("office")}>
              Office clean
            </TabBtn>
            <TabBtn active={tab === "move-out"} onClick={() => setTab("move-out")}>
              Move-out clean
            </TabBtn>
          </div>

          <div className="p-6">
            {/* ── REGULAR ─────────────────────────────────────── */}
            {tab === "regular" && (
              <div className="space-y-5">
                <Stepper
                  label="Bedrooms"
                  value={bedrooms}
                  min={1}
                  max={5}
                  onChange={setBedrooms}
                />
                <Stepper
                  label="Bathrooms"
                  value={bathrooms}
                  min={1}
                  max={5}
                  onChange={setBathrooms}
                />
                <div>
                  <label className="mb-2 block text-sm text-muted-foreground">
                    Frequency
                  </label>
                  <div className="relative">
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2.5 pr-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {Object.entries(FREQUENCY_LABELS).map(([v, lbl]) => (
                        <option key={v} value={v}>
                          {lbl}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>
            )}

            {/* ── OFFICE ──────────────────────────────────────── */}
            {tab === "office" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Select your office size</p>
                {OFFICE_SIZES.map((tier) => (
                  <button
                    key={tier.key}
                    onClick={() => setOfficeSize(tier.key)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all",
                      officeSize === tier.key
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <span className="text-sm font-medium text-foreground">
                      {tier.label}
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {tier.price !== null ? `from R${tier.price}` : "Custom"}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* ── MOVE-OUT ─────────────────────────────────────── */}
            {tab === "move-out" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Select property size</p>
                {MOVE_OUT_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setMoveOutSize(size)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all",
                      moveOutSize === size
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <span className="text-sm font-medium text-foreground">{size}</span>
                    <span className="text-sm font-semibold text-primary">
                      R{CONFIG.MOVE_OUT.prices[size]}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* ── Price display ─────────────────────────────────── */}
            <div className="mt-6 rounded-xl bg-primary/5 px-5 py-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Estimated price
              </p>
              <p className="mt-1 text-4xl font-black text-primary">{display}</p>
              <p className="mt-0.5 text-xs text-muted-foreground capitalize">{label}</p>
            </div>

            {/* ── CTA ───────────────────────────────────────────── */}
            <Button className="mt-4 w-full gap-2" size="lg" onClick={openWhatsApp}>
              <MessageCircle className="h-5 w-5" />
              Book on WhatsApp
            </Button>

            {/* ── Disclaimer ────────────────────────────────────── */}
            <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
              This is an <strong>estimate only</strong>, not a binding quote. Final price
              confirmed in writing before work begins. Price may vary by property size,
              condition and access. Heavy cleans, post-build or specialist jobs quoted
              separately. Includes VAT where applicable. Valid in our service areas only.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceEstimator;
