import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerDetails {
  fullName: string;
  contactNumber: string;
  email: string;
  serviceAddress: string;
  preferredDate: string;
  preferredTimeWindow: string;
}

interface CustomerDetailsFormProps {
  data: CustomerDetails;
  onChange: (data: CustomerDetails) => void;
}

const timeWindows = [
  "Morning (08:00 – 12:00)",
  "Afternoon (12:00 – 16:00)",
  "Any time",
];

const CustomerDetailsForm = ({ data, onChange }: CustomerDetailsFormProps) => {
  const update = (field: keyof CustomerDetails, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Your Details</h3>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          value={data.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          placeholder="e.g. John Smith"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact Number *</Label>
        <Input
          id="contactNumber"
          type="tel"
          value={data.contactNumber}
          onChange={(e) => update("contactNumber", e.target.value)}
          placeholder="e.g. 076 400 2332"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address (optional)</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="e.g. john@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceAddress">Service Address *</Label>
        <Input
          id="serviceAddress"
          value={data.serviceAddress}
          onChange={(e) => update("serviceAddress", e.target.value)}
          placeholder="e.g. 12 Main Road, Claremont, Cape Town"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="preferredDate">Preferred Date</Label>
          <Input
            id="preferredDate"
            type="date"
            value={data.preferredDate}
            onChange={(e) => update("preferredDate", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredTimeWindow">Preferred Time</Label>
          <select
            id="preferredTimeWindow"
            value={data.preferredTimeWindow}
            onChange={(e) => update("preferredTimeWindow", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Select a time window</option>
            {timeWindows.map((tw) => (
              <option key={tw} value={tw}>{tw}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsForm;
