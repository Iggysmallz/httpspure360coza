export interface PasswordValidation {
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  strength: "weak" | "fair" | "good" | "strong";
  strengthPercent: number;
}

export const validatePassword = (password: string): PasswordValidation => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isValid = hasMinLength && hasUppercase && hasNumber && hasSpecialChar;

  // Calculate strength
  let score = 0;
  if (hasMinLength) score++;
  if (hasUppercase) score++;
  if (hasNumber) score++;
  if (hasSpecialChar) score++;

  let strength: PasswordValidation["strength"] = "weak";
  let strengthPercent = 0;

  if (score === 4) {
    strength = "strong";
    strengthPercent = 100;
  } else if (score === 3) {
    strength = "good";
    strengthPercent = 75;
  } else if (score === 2) {
    strength = "fair";
    strengthPercent = 50;
  } else if (score >= 1) {
    strength = "weak";
    strengthPercent = 25;
  }

  return {
    isValid,
    hasMinLength,
    hasUppercase,
    hasNumber,
    hasSpecialChar,
    strength,
    strengthPercent,
  };
};

export const getStrengthColor = (strength: PasswordValidation["strength"]): string => {
  switch (strength) {
    case "strong":
      return "bg-green-500";
    case "good":
      return "bg-blue-500";
    case "fair":
      return "bg-yellow-500";
    case "weak":
    default:
      return "bg-red-500";
  }
};
