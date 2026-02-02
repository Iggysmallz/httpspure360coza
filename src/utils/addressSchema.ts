import * as z from "zod";

export const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
] as const;

export const addressSchema = z.object({
  unit: z.string().min(1, "Unit/Flat number is required (even for houses, use '1')"),
  complex: z.string().optional(),
  street: z.string().min(3, "Please provide a valid street name and number"),
  suburb: z.string().min(2, "Suburb is required for our workers to find you"),
  city: z.string().min(2, "City is required"),
  province: z.enum(SA_PROVINCES, {
    errorMap: () => ({ message: "Please select a valid South African province" }),
  }),
  postalCode: z.string().regex(/^\d{4}$/, "SA Postal codes must be 4 digits"),
});

export type AddressValues = z.infer<typeof addressSchema>;

// Optional validation for partial addresses (before full submission)
export const partialAddressSchema = addressSchema.partial();

export type PartialAddressValues = z.infer<typeof partialAddressSchema>;
