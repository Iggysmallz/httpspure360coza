import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface RemovalData {
  itemTypes: string;
  loadSize: string;
  accessibilityNotes: string;
}

interface RemovalQuestionsProps {
  data: RemovalData;
  onChange: (data: RemovalData) => void;
}

const RemovalQuestions = ({ data, onChange }: RemovalQuestionsProps) => {
  const update = (field: keyof RemovalData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Removal Details</h3>

      <div className="space-y-2">
        <Label htmlFor="itemTypes">What needs to be removed?</Label>
        <Textarea
          id="itemTypes"
          value={data.itemTypes}
          onChange={(e) => update("itemTypes", e.target.value)}
          placeholder="e.g. Old furniture, garden rubble, broken appliances"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Approximate Load Size</Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "small", label: "Small", desc: "A few items" },
            { value: "medium", label: "Medium", desc: "Half a bakkie" },
            { value: "large", label: "Large", desc: "Full load or more" },
          ].map((size) => (
            <button
              key={size.value}
              type="button"
              onClick={() => update("loadSize", size.value)}
              className={cn(
                "flex flex-col items-center rounded-lg border-2 p-3 text-center transition-all",
                data.loadSize === size.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              <span className="text-sm font-medium text-foreground">{size.label}</span>
              <span className="text-[11px] text-muted-foreground">{size.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="accessibilityNotes">Access Notes (optional)</Label>
        <Textarea
          id="accessibilityNotes"
          value={data.accessibilityNotes}
          onChange={(e) => update("accessibilityNotes", e.target.value)}
          placeholder="e.g. Third floor, no lift, narrow driveway"
          rows={2}
        />
      </div>
    </div>
  );
};

export default RemovalQuestions;
