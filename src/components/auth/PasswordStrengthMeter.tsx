import { validatePassword, getStrengthColor } from "@/lib/passwordValidation";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const validation = validatePassword(password);

  if (!password) return null;

  const requirements = [
    { met: validation.hasMinLength, label: "At least 8 characters" },
    { met: validation.hasUppercase, label: "One uppercase letter" },
    { met: validation.hasNumber, label: "One number" },
    { met: validation.hasSpecialChar, label: "One special character (!@#$%^&*)" },
  ];

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full transition-all duration-300",
              getStrengthColor(validation.strength)
            )}
            style={{ width: `${validation.strengthPercent}%` }}
          />
        </div>
        <span className="text-xs font-medium capitalize text-muted-foreground">
          {validation.strength}
        </span>
      </div>

      {/* Requirements List */}
      <ul className="space-y-1">
        {requirements.map((req, index) => (
          <li
            key={index}
            className={cn(
              "flex items-center gap-2 text-xs",
              req.met ? "text-green-600" : "text-muted-foreground"
            )}
          >
            {req.met ? (
              <Check className="h-3 w-3" />
            ) : (
              <X className="h-3 w-3 text-destructive" />
            )}
            {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthMeter;
