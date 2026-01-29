import { cn } from "@/lib/utils";
import { User, Briefcase } from "lucide-react";

type Role = "client" | "worker";

interface RoleSelectorProps {
  value: Role;
  onChange: (role: Role) => void;
}

const RoleSelector = ({ value, onChange }: RoleSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onChange("client")}
        className={cn(
          "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
          value === "client"
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        )}
      >
        <User
          className={cn(
            "h-6 w-6",
            value === "client" ? "text-primary" : "text-muted-foreground"
          )}
        />
        <div className="text-center">
          <p
            className={cn(
              "font-medium",
              value === "client" ? "text-primary" : "text-foreground"
            )}
          >
            I need services
          </p>
          <p className="text-xs text-muted-foreground">Book cleaning & more</p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onChange("worker")}
        className={cn(
          "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
          value === "worker"
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        )}
      >
        <Briefcase
          className={cn(
            "h-6 w-6",
            value === "worker" ? "text-primary" : "text-muted-foreground"
          )}
        />
        <div className="text-center">
          <p
            className={cn(
              "font-medium",
              value === "worker" ? "text-primary" : "text-foreground"
            )}
          >
            I want to work
          </p>
          <p className="text-xs text-muted-foreground">Provide services</p>
        </div>
      </button>
    </div>
  );
};

export default RoleSelector;
