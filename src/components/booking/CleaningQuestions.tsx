import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CleaningData {
  cleaningType: string;
  propertyType: string;
  numberOfRooms: string;
  specialInstructions: string;
}

interface CleaningQuestionsProps {
  data: CleaningData;
  onChange: (data: CleaningData) => void;
}

const CleaningQuestions = ({ data, onChange }: CleaningQuestionsProps) => {
  const update = (field: keyof CleaningData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Cleaning Details</h3>

      <div className="space-y-2">
        <Label>Type of Cleaning *</Label>
        <div className="grid grid-cols-2 gap-2">
          {["Standard Clean", "Deep Clean"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => update("cleaningType", type)}
              className={cn(
                "rounded-lg border-2 p-3 text-sm font-medium transition-all",
                data.cleaningType === type
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/40"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Property Type (optional)</Label>
        <div className="grid grid-cols-2 gap-2">
          {["House", "Apartment"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => update("propertyType", type)}
              className={cn(
                "rounded-lg border-2 p-3 text-sm font-medium transition-all",
                data.propertyType === type
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/40"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Number of Rooms (optional)</Label>
        <div className="flex gap-2">
          {["1–2", "3–4", "5+"].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => update("numberOfRooms", count)}
              className={cn(
                "flex-1 rounded-lg border-2 p-3 text-sm font-medium transition-all",
                data.numberOfRooms === count
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/40"
              )}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialInstructions">Special Instructions (optional)</Label>
        <Textarea
          id="specialInstructions"
          value={data.specialInstructions}
          onChange={(e) => update("specialInstructions", e.target.value)}
          placeholder="e.g. Focus on kitchen area, pet-friendly products preferred"
          rows={3}
        />
      </div>
    </div>
  );
};

export default CleaningQuestions;
